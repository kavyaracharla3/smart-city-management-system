from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="user")  # "admin" or "user"
    created_at = Column(DateTime, default=datetime.utcnow)


class Traffic(Base):
    __tablename__ = "traffic"

    id = Column(Integer, primary_key=True, index=True)
    road_name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    city_zone = Column(String, default="Hyderabad Central")
    vehicle_count = Column(Integer, default=0)
    average_speed = Column(Float, default=40.0)  # km/h
    congestion_level = Column(String, default="Low")  # "Low", "Moderate", "Heavy"
    incidents_count = Column(Integer, default=0)
    camera_status = Column(String, default="Active")  # "Active", "Offline"
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)


class WasteBin(Base):
    __tablename__ = "waste_bins"

    id = Column(Integer, primary_key=True, index=True)
    bin_code = Column(String, unique=True, index=True, nullable=False)
    location = Column(String, nullable=False)
    city_zone = Column(String, default="Hyderabad Central")
    fill_level = Column(Float, default=0.0)  # 0 to 100%
    capacity_liters = Column(Integer, default=1100)
    status = Column(String, default="Normal")  # "Normal", "Almost Full", "Full", "Pending Collection"
    last_collection = Column(DateTime, default=datetime.utcnow)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)


class WaterUsage(Base):
    __tablename__ = "water_usage"

    id = Column(Integer, primary_key=True, index=True)
    zone = Column(String, nullable=False)
    consumption_kl = Column(Float, default=120.0)  # Kiloliters
    capacity_kl = Column(Float, default=200.0)
    usage_percentage = Column(Float, default=60.0)
    reservoir_level_pct = Column(Float, default=85.0)
    active_leaks_count = Column(Integer, default=0)
    timestamp = Column(DateTime, default=datetime.utcnow)


class WaterLeak(Base):
    __tablename__ = "water_leaks"

    id = Column(Integer, primary_key=True, index=True)
    leak_code = Column(String, unique=True, index=True, nullable=False)
    location = Column(String, nullable=False)
    zone = Column(String, nullable=False)
    estimated_loss_lph = Column(Float, default=500.0)  # Liters per hour
    detection_time = Column(DateTime, default=datetime.utcnow)
    severity = Column(String, default="Medium")  # "Low", "Medium", "High", "Critical"
    status = Column(String, default="Detected")  # "Detected", "Investigating", "Resolved"
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)


class Emergency(Base):
    __tablename__ = "emergencies"

    id = Column(Integer, primary_key=True, index=True)
    emergency_type = Column(String, nullable=False)  # "Accident", "Fire", "Flood", "Medical Emergency", "Crime", "Natural Disaster", "Infrastructure Failure"
    location = Column(String, nullable=False)
    zone = Column(String, default="Hyderabad Central")
    severity = Column(String, default="High")  # "Low", "Medium", "High", "Critical"
    description = Column(String, nullable=False)
    status = Column(String, default="Active")  # "Active", "Investigating", "Resolved"
    assigned_team = Column(String, default="Unassigned")
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)


class Pollution(Base):
    __tablename__ = "pollution"

    id = Column(Integer, primary_key=True, index=True)
    station_code = Column(String, unique=True, index=True, nullable=False)
    station_name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    zone = Column(String, default="Hyderabad Central")
    aqi = Column(Integer, default=75)
    pm25 = Column(Float, default=25.0)
    pm10 = Column(Float, default=45.0)
    co = Column(Float, default=0.8)
    no2 = Column(Float, default=18.0)
    so2 = Column(Float, default=9.0)
    o3 = Column(Float, default=30.0)
    status = Column(String, default="Moderate")  # "Good", "Moderate", "Unhealthy for Sensitive Groups", "Unhealthy", "Very Unhealthy", "Hazardous"
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)


class CitizenIssue(Base):
    __tablename__ = "citizen_issues"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, nullable=False)  # Pothole, Streetlight, Garbage Overflow, Water Burst, Traffic Signal, Noise
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    location = Column(String, nullable=False)
    zone = Column(String, default="Hyderabad Central")
    reporter_name = Column(String, default="Anonymous Citizen")
    priority = Column(String, default="Medium")  # Low, Medium, High, Critical
    status = Column(String, default="Reported")  # Reported, Crew Dispatched, Under Repair, Resolved
    assigned_crew = Column(String, default="Unassigned")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    lat = Column(Float, default=17.4065)
    lng = Column(Float, default=78.4772)


class CityBulletin(Base):
    __tablename__ = "city_bulletins"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    category = Column(String, default="General")  # Emergency, Traffic, Water, Weather, Maintenance
    urgency = Column(String, default="Normal")  # Low, Normal, High, Critical
    posted_by = Column(String, default="Command Center")
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    operator_name = Column(String, nullable=False)
    action_type = Column(String, nullable=False)  # DISPATCH, RESOLUTION, ALERT, BULLETIN, STATUS_UPDATE
    module = Column(String, nullable=False)  # Traffic, Waste, Water, Emergency, Pollution, Collaboration
    details = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)


class OperatorNote(Base):
    __tablename__ = "operator_notes"

    id = Column(Integer, primary_key=True, index=True)
    operator_name = Column(String, nullable=False)
    role = Column(String, default="user")
    zone = Column(String, default="All Zones")
    note = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

