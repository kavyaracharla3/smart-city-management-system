from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.models import Pollution
from app.schemas.schemas import PollutionOut

router = APIRouter()


@router.get("", response_model=List[PollutionOut])
def get_pollution_stations(
    zone: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db)
):
    query = db.query(Pollution)
    if zone and zone != "All Zones":
        query = query.filter(Pollution.zone == zone)
    if status_filter and status_filter != "All":
        query = query.filter(Pollution.status == status_filter)
    return query.all()


@router.get("/analytics")
def get_pollution_analytics(db: Session = Depends(get_db)):
    stations = db.query(Pollution).all()
    
    if not stations:
        return {"avg_aqi": 0, "status": "Unknown", "zone_breakdown": []}

    avg_aqi = int(sum([p.aqi for p in stations]) / len(stations))
    avg_pm25 = round(sum([p.pm25 for p in stations]) / len(stations), 1)
    avg_pm10 = round(sum([p.pm10 for p in stations]) / len(stations), 1)
    avg_co = round(sum([p.co for p in stations]) / len(stations), 2)
    avg_no2 = round(sum([p.no2 for p in stations]) / len(stations), 1)
    avg_so2 = round(sum([p.so2 for p in stations]) / len(stations), 1)
    avg_o3 = round(sum([p.o3 for p in stations]) / len(stations), 1)

    zone_breakdown = [
        {"station": p.station_name, "zone": p.zone, "aqi": p.aqi, "status": p.status, "pm25": p.pm25, "pm10": p.pm10}
        for p in stations
    ]

    # Generate 24-hour historical AQI trend simulation
    historical_trends = [
        {"time": f"{h:02d}:00", "aqi": max(20, min(250, avg_aqi + int(15 * ((h - 12) / 12) ** 2 - 8)))}
        for h in range(0, 24, 2)
    ]

    return {
        "overall_avg_aqi": avg_aqi,
        "overall_pm25": avg_pm25,
        "overall_pm10": avg_pm10,
        "overall_co": avg_co,
        "overall_no2": avg_no2,
        "overall_so2": avg_so2,
        "overall_o3": avg_o3,
        "station_count": len(stations),
        "zone_breakdown": zone_breakdown,
        "historical_trends": historical_trends
    }
