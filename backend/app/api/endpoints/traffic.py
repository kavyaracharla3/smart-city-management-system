from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, get_current_admin_user
from app.models.models import Traffic, User
from app.schemas.schemas import TrafficOut, TrafficCreate, TrafficUpdate

router = APIRouter()


@router.get("", response_model=List[TrafficOut])
def get_traffic_data(
    zone: Optional[str] = Query(None),
    congestion: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Traffic)
    if zone and zone != "All Zones":
        query = query.filter(Traffic.city_zone == zone)
    if congestion and congestion != "All":
        query = query.filter(Traffic.congestion_level == congestion)
    return query.all()


@router.get("/{traffic_id}", response_model=TrafficOut)
def get_traffic_by_id(traffic_id: int, db: Session = Depends(get_db)):
    traffic = db.query(Traffic).filter(Traffic.id == traffic_id).first()
    if not traffic:
        raise HTTPException(status_code=404, detail="Traffic road record not found")
    return traffic


@router.post("", response_model=TrafficOut, status_code=status.HTTP_201_CREATED)
def create_traffic_record(
    traffic_in: TrafficCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_traffic = Traffic(**traffic_in.model_dump())
    db.add(new_traffic)
    db.commit()
    db.refresh(new_traffic)
    return new_traffic


@router.put("/{traffic_id}", response_model=TrafficOut)
def update_traffic_record(
    traffic_id: int,
    traffic_in: TrafficUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    traffic = db.query(Traffic).filter(Traffic.id == traffic_id).first()
    if not traffic:
        raise HTTPException(status_code=404, detail="Traffic road record not found")
    
    update_data = traffic_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(traffic, field, value)
        
    db.commit()
    db.refresh(traffic)
    return traffic


@router.delete("/{traffic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_traffic_record(
    traffic_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    traffic = db.query(Traffic).filter(Traffic.id == traffic_id).first()
    if not traffic:
        raise HTTPException(status_code=404, detail="Traffic road record not found")
    db.delete(traffic)
    db.commit()
    return None
