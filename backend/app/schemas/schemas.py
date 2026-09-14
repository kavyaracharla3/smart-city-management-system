from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr


# Auth Schemas
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "user"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# Traffic Schemas
class TrafficBase(BaseModel):
    road_name: str
    location: str
    city_zone: str
    vehicle_count: int
    average_speed: float
    congestion_level: str
    incidents_count: int
    camera_status: str
    lat: float
    lng: float


class TrafficCreate(TrafficBase):
    pass


class TrafficUpdate(BaseModel):
    road_name: Optional[str] = None
    location: Optional[str] = None
    city_zone: Optional[str] = None
    vehicle_count: Optional[int] = None
    average_speed: Optional[float] = None
    congestion_level: Optional[str] = None
    incidents_count: Optional[int] = None
    camera_status: Optional[str] = None


class TrafficOut(TrafficBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True


# Waste Schemas
class WasteBinBase(BaseModel):
    bin_code: str
    location: str
    city_zone: str
    fill_level: float
    capacity_liters: int
    status: str
    lat: float
    lng: float


class WasteBinCreate(WasteBinBase):
    pass


class WasteBinUpdate(BaseModel):
    fill_level: Optional[float] = None
    status: Optional[str] = None
    last_collection: Optional[datetime] = None


class WasteBinOut(WasteBinBase):
    id: int
    last_collection: datetime

    class Config:
        from_attributes = True


# Water Schemas
class WaterUsageBase(BaseModel):
    zone: str
    consumption_kl: float
    capacity_kl: float
    usage_percentage: float
    reservoir_level_pct: float
    active_leaks_count: int


class WaterUsageOut(WaterUsageBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True


class WaterLeakBase(BaseModel):
    leak_code: str
    location: str
    zone: str
    estimated_loss_lph: float
    severity: str
    status: str
    lat: float
    lng: float


class WaterLeakUpdate(BaseModel):
    status: Optional[str] = None
    severity: Optional[str] = None
    estimated_loss_lph: Optional[float] = None


class WaterLeakOut(WaterLeakBase):
    id: int
    detection_time: datetime

    class Config:
        from_attributes = True


# Emergency Schemas
class EmergencyBase(BaseModel):
    emergency_type: str
    location: str
    zone: str
    severity: str
    description: str
    lat: float
    lng: float


class EmergencyCreate(EmergencyBase):
    pass


class EmergencyUpdate(BaseModel):
    status: Optional[str] = None
    severity: Optional[str] = None
    assigned_team: Optional[str] = None
    resolved_at: Optional[datetime] = None


class EmergencyOut(EmergencyBase):
    id: int
    status: str
    assigned_team: str
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Pollution Schemas
class PollutionBase(BaseModel):
    station_code: str
    station_name: str
    location: str
    zone: str
    aqi: int
    pm25: float
    pm10: float
    co: float
    no2: float
    so2: float
    o3: float
    status: str
    lat: float
    lng: float


class PollutionOut(PollutionBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True


# Dashboard Summary Schema
class DashboardSummary(BaseModel):
    city_name: str
    system_status: str
    simulation_mode: str
    traffic: dict
    waste: dict
    water: dict
    emergency: dict
    pollution: dict
    last_updated: datetime
