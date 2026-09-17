import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.models import User, CitizenIssue, CityBulletin, ActivityLog, OperatorNote
from app.schemas.schemas import (
    CitizenIssueCreate, CitizenIssueUpdate, CitizenIssueOut,
    CityBulletinCreate, CityBulletinOut,
    ActivityLogCreate, ActivityLogOut,
    OperatorNoteCreate, OperatorNoteOut
)

router = APIRouter()


# 1. Citizen Incident & Issue Hub
@router.get("/issues", response_model=List[CitizenIssueOut])
def get_citizen_issues(
    zone: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CitizenIssue)
    if zone and zone != "All Zones":
        query = query.filter(CitizenIssue.zone == zone)
    if status_filter and status_filter != "All Statuses":
        query = query.filter(CitizenIssue.status == status_filter)
    if category and category != "All Categories":
        query = query.filter(CitizenIssue.category == category)
    return query.order_by(CitizenIssue.created_at.desc()).all()


@router.post("/issues", response_model=CitizenIssueOut, status_code=status.HTTP_201_CREATED)
def create_citizen_issue(issue_in: CitizenIssueCreate, db: Session = Depends(get_db)):
    ticket_num = str(uuid.uuid4().int)[:6]
    ticket_id = f"TKT-HYD-{ticket_num}"
    
    new_issue = CitizenIssue(
        ticket_id=ticket_id,
        category=issue_in.category,
        title=issue_in.title,
        description=issue_in.description,
        location=issue_in.location,
        zone=issue_in.zone or "Hyderabad Central",
        reporter_name=issue_in.reporter_name or "Anonymous Citizen",
        priority=issue_in.priority or "Medium",
        status="Reported",
        assigned_crew="Unassigned",
        lat=issue_in.lat or 17.4065,
        lng=issue_in.lng or 78.4772,
    )
    db.add(new_issue)
    
    # Log activity
    log = ActivityLog(
        operator_name=issue_in.reporter_name or "Citizen Reporter",
        action_type="ALERT",
        module="Collaboration",
        details=f"Reported new issue [{ticket_id}]: {issue_in.title} in {issue_in.zone}"
    )
    db.add(log)
    
    db.commit()
    db.refresh(new_issue)
    return new_issue


@router.put("/issues/{issue_id}", response_model=CitizenIssueOut)
def update_citizen_issue(
    issue_id: int,
    issue_update: CitizenIssueUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    issue = db.query(CitizenIssue).filter(CitizenIssue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Citizen issue ticket not found")
    
    if issue_update.status:
        issue.status = issue_update.status
    if issue_update.assigned_crew:
        issue.assigned_crew = issue_update.assigned_crew
    if issue_update.priority:
        issue.priority = issue_update.priority
        
    issue.updated_at = datetime.utcnow()
    
    # Audit log
    log = ActivityLog(
        operator_name=current_user.name,
        action_type="DISPATCH" if issue_update.assigned_crew else "STATUS_UPDATE",
        module="Collaboration",
        details=f"Updated ticket {issue.ticket_id}: Status={issue.status}, Crew={issue.assigned_crew}"
    )
    db.add(log)
    
    db.commit()
    db.refresh(issue)
    return issue


# 2. Inter-Departmental City Bulletins
@router.get("/bulletins", response_model=List[CityBulletinOut])
def get_city_bulletins(active_only: bool = True, db: Session = Depends(get_db)):
    query = db.query(CityBulletin)
    if active_only:
        query = query.filter(CityBulletin.active == True)
    return query.order_by(CityBulletin.created_at.desc()).all()


@router.post("/bulletins", response_model=CityBulletinOut, status_code=status.HTTP_201_CREATED)
def create_city_bulletin(
    bulletin_in: CityBulletinCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bulletin = CityBulletin(
        title=bulletin_in.title,
        message=bulletin_in.message,
        category=bulletin_in.category or "General",
        urgency=bulletin_in.urgency or "Normal",
        posted_by=current_user.name or bulletin_in.posted_by or "Command Center Admin",
        active=True
    )
    db.add(bulletin)
    
    # Log activity
    log = ActivityLog(
        operator_name=current_user.name,
        action_type="BULLETIN",
        module="Collaboration",
        details=f"Broadcasted City Bulletin: '{bulletin.title}' ({bulletin.urgency} Urgency)"
    )
    db.add(log)
    
    db.commit()
    db.refresh(bulletin)
    return bulletin


# 3. Live Operator Activity Logs
@router.get("/activity-logs", response_model=List[ActivityLogOut])
def get_activity_logs(limit: int = 50, db: Session = Depends(get_db)):
    return db.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).limit(limit).all()


@router.post("/activity-logs", response_model=ActivityLogOut, status_code=status.HTTP_201_CREATED)
def create_activity_log(log_in: ActivityLogCreate, db: Session = Depends(get_db)):
    log = ActivityLog(
        operator_name=log_in.operator_name,
        action_type=log_in.action_type,
        module=log_in.module,
        details=log_in.details
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


# 4. Command Center Shift Notes & Operator Chat
@router.get("/notes", response_model=List[OperatorNoteOut])
def get_operator_notes(zone: Optional[str] = None, limit: int = 30, db: Session = Depends(get_db)):
    query = db.query(OperatorNote)
    if zone and zone != "All Zones":
        query = query.filter(OperatorNote.zone == zone)
    return query.order_by(OperatorNote.created_at.desc()).limit(limit).all()


@router.post("/notes", response_model=OperatorNoteOut, status_code=status.HTTP_201_CREATED)
def create_operator_note(
    note_in: OperatorNoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = OperatorNote(
        operator_name=current_user.name,
        role=current_user.role,
        zone=note_in.zone or "All Zones",
        note=note_in.note
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note
