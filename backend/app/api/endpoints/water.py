from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.models import WaterUsage, WaterLeak, User
from app.schemas.schemas import WaterUsageOut, WaterLeakOut, WaterLeakUpdate

router = APIRouter()


@router.get("", response_model=List[WaterUsageOut])
def get_water_usage(
    zone: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(WaterUsage)
    if zone and zone != "All Zones":
        query = query.filter(WaterUsage.zone == zone)
    return query.all()


@router.get("/analytics")
def get_water_analytics(db: Session = Depends(get_db)):
    usages = db.query(WaterUsage).all()
    leaks = db.query(WaterLeak).all()
    
    total_consumption = sum([u.consumption_kl for u in usages])
    total_capacity = sum([u.capacity_kl for u in usages])
    active_leaks = [l for l in leaks if l.status in ["Detected", "Investigating"]]
    estimated_water_loss_lph = sum([l.estimated_loss_lph for l in active_leaks])

    # Generate 24-hour hourly trend simulation
    hourly_trends = [
        {"hour": f"{h:02d}:00", "consumption": round(total_consumption * (0.02 + 0.03 * (1 if 6 <= h <= 10 or 18 <= h <= 22 else 0.5)), 1)}
        for h in range(24)
    ]

    return {
        "total_daily_consumption_kl": round(total_consumption, 1),
        "total_capacity_kl": round(total_capacity, 1),
        "overall_usage_percentage": round((total_consumption / total_capacity * 100), 1) if total_capacity else 0.0,
        "avg_reservoir_level_pct": 82.5,
        "active_leaks_count": len(active_leaks),
        "total_water_loss_lph": round(estimated_water_loss_lph, 1),
        "hourly_trends": hourly_trends
    }


@router.get("/leaks", response_model=List[WaterLeakOut])
def get_water_leaks(
    zone: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db)
):
    query = db.query(WaterLeak)
    if zone and zone != "All Zones":
        query = query.filter(WaterLeak.zone == zone)
    if status_filter and status_filter != "All":
        query = query.filter(WaterLeak.status == status_filter)
    return query.all()


@router.put("/leaks/{leak_id}", response_model=WaterLeakOut)
def update_water_leak(
    leak_id: int,
    leak_in: WaterLeakUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    leak = db.query(WaterLeak).filter(WaterLeak.id == leak_id).first()
    if not leak:
        raise HTTPException(status_code=404, detail="Water leak record not found")
    
    update_data = leak_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(leak, field, value)
        
    db.commit()
    db.refresh(leak)
    return leak
