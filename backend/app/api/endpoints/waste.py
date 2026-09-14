from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, get_current_admin_user
from app.models.models import WasteBin, User
from app.schemas.schemas import WasteBinOut, WasteBinCreate, WasteBinUpdate

router = APIRouter()


@router.get("", response_model=List[WasteBinOut])
def get_waste_bins(
    zone: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db)
):
    query = db.query(WasteBin)
    if zone and zone != "All Zones":
        query = query.filter(WasteBin.city_zone == zone)
    if status_filter and status_filter != "All":
        query = query.filter(WasteBin.status == status_filter)
    return query.all()


@router.get("/{bin_id}", response_model=WasteBinOut)
def get_waste_bin_by_id(bin_id: int, db: Session = Depends(get_db)):
    waste_bin = db.query(WasteBin).filter(WasteBin.id == bin_id).first()
    if not waste_bin:
        raise HTTPException(status_code=404, detail="Waste bin not found")
    return waste_bin


@router.post("", response_model=WasteBinOut, status_code=status.HTTP_201_CREATED)
def create_waste_bin(
    bin_in: WasteBinCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(WasteBin).filter(WasteBin.bin_code == bin_in.bin_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bin code already exists")
    
    new_bin = WasteBin(**bin_in.model_dump())
    db.add(new_bin)
    db.commit()
    db.refresh(new_bin)
    return new_bin


@router.put("/{bin_id}", response_model=WasteBinOut)
def update_waste_bin(
    bin_id: int,
    bin_in: WasteBinUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    waste_bin = db.query(WasteBin).filter(WasteBin.id == bin_id).first()
    if not waste_bin:
        raise HTTPException(status_code=404, detail="Waste bin not found")
    
    update_data = bin_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(waste_bin, field, value)
        
    db.commit()
    db.refresh(waste_bin)
    return waste_bin


@router.post("/{bin_id}/collect", response_model=WasteBinOut)
def dispatch_bin_collection(
    bin_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Simulates dispatching a waste collection vehicle to empty the smart bin.
    Resets fill level to 5.0% and sets status to Normal.
    """
    waste_bin = db.query(WasteBin).filter(WasteBin.id == bin_id).first()
    if not waste_bin:
        raise HTTPException(status_code=404, detail="Waste bin not found")
    
    waste_bin.fill_level = 5.0
    waste_bin.status = "Normal"
    waste_bin.last_collection = datetime.utcnow()
    
    db.commit()
    db.refresh(waste_bin)
    return waste_bin
