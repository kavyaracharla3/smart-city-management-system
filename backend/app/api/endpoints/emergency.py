from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, get_current_admin_user
from app.models.models import Emergency, User
from app.schemas.schemas import EmergencyOut, EmergencyCreate, EmergencyUpdate

router = APIRouter()


@router.get("", response_model=List[EmergencyOut])
def get_emergencies(
    zone: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db)
):
    query = db.query(Emergency)
    if zone and zone != "All Zones":
        query = query.filter(Emergency.zone == zone)
    if severity and severity != "All":
        query = query.filter(Emergency.severity == severity)
    if status_filter and status_filter != "All":
        query = query.filter(Emergency.status == status_filter)
    return query.order_by(Emergency.created_at.desc()).all()


@router.post("", response_model=EmergencyOut, status_code=status.HTTP_201_CREATED)
def create_emergency_alert(
    emergency_in: EmergencyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_emergency = Emergency(**emergency_in.model_dump())
    db.add(new_emergency)
    db.commit()
    db.refresh(new_emergency)
    return new_emergency


@router.put("/{emergency_id}", response_model=EmergencyOut)
def update_emergency_alert(
    emergency_id: int,
    emergency_in: EmergencyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    emergency = db.query(Emergency).filter(Emergency.id == emergency_id).first()
    if not emergency:
        raise HTTPException(status_code=404, detail="Emergency record not found")
    
    update_data = emergency_in.model_dump(exclude_unset=True)
    if update_data.get("status") == "Resolved" and not emergency.resolved_at:
        update_data["resolved_at"] = datetime.utcnow()

    for field, value in update_data.items():
        setattr(emergency, field, value)
        
    db.commit()
    db.refresh(emergency)
    return emergency


@router.delete("/{emergency_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_emergency_alert(
    emergency_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    emergency = db.query(Emergency).filter(Emergency.id == emergency_id).first()
    if not emergency:
        raise HTTPException(status_code=404, detail="Emergency record not found")
    db.delete(emergency)
    db.commit()
    return None
