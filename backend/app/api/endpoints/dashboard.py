from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.models import Traffic, WasteBin, WaterUsage, WaterLeak, Emergency, Pollution
from app.schemas.schemas import DashboardSummary

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    zone: Optional[str] = Query(None, description="Filter dashboard summary by city zone"),
    db: Session = Depends(get_db)
):
    # 1. Traffic Summary
    traffic_query = db.query(Traffic)
    if zone and zone != "All Zones":
        traffic_query = traffic_query.filter(Traffic.city_zone == zone)
    traffic_roads = traffic_query.all()
    
    active_cameras = len([r for r in traffic_roads if r.camera_status == "Active"])
    congested_roads = len([r for r in traffic_roads if r.congestion_level in ["Moderate", "Heavy"]])
    avg_speed = round(sum([r.average_speed for r in traffic_roads]) / len(traffic_roads), 1) if traffic_roads else 0.0
    traffic_incidents = sum([r.incidents_count for r in traffic_roads])

    # 2. Waste Summary
    waste_query = db.query(WasteBin)
    if zone and zone != "All Zones":
        waste_query = waste_query.filter(WasteBin.city_zone == zone)
    waste_bins = waste_query.all()

    full_bins = len([b for b in waste_bins if b.status in ["Almost Full", "Full"]])
    total_waste_collected_tons = round(sum([(b.fill_level * b.capacity_liters * 0.0003) for b in waste_bins]), 1)
    efficiency = round(100 - ((full_bins / len(waste_bins) * 100) if waste_bins else 0), 1)

    # 3. Water Summary
    water_query = db.query(WaterUsage)
    if zone and zone != "All Zones":
        water_query = water_query.filter(WaterUsage.zone == zone)
    water_records = water_query.all()

    total_consumption_kl = round(sum([w.consumption_kl for w in water_records]), 1)
    avg_usage_pct = round(sum([w.usage_percentage for w in water_records]) / len(water_records), 1) if water_records else 0.0
    avg_reservoir_pct = round(sum([w.reservoir_level_pct for w in water_records]) / len(water_records), 1) if water_records else 0.0

    leak_query = db.query(WaterLeak)
    if zone and zone != "All Zones":
        leak_query = leak_query.filter(WaterLeak.zone == zone)
    active_leaks = leak_query.filter(WaterLeak.status.in_(["Detected", "Investigating"])).count()

    # 4. Emergency Summary
    emerg_query = db.query(Emergency)
    if zone and zone != "All Zones":
        emerg_query = emerg_query.filter(Emergency.zone == zone)
    emergencies = emerg_query.all()

    active_emergencies = len([e for e in emergencies if e.status != "Resolved"])
    critical_alerts = len([e for e in emergencies if e.severity == "Critical" and e.status != "Resolved"])
    resolved_incidents = len([e for e in emergencies if e.status == "Resolved"])

    # 5. Pollution Summary
    poll_query = db.query(Pollution)
    if zone and zone != "All Zones":
        poll_query = poll_query.filter(Pollution.zone == zone)
    stations = poll_query.all()

    avg_aqi = int(sum([p.aqi for p in stations]) / len(stations)) if stations else 0
    avg_pm25 = round(sum([p.pm25 for p in stations]) / len(stations), 1) if stations else 0.0
    avg_pm10 = round(sum([p.pm10 for p in stations]) / len(stations), 1) if stations else 0.0
    avg_co = round(sum([p.co for p in stations]) / len(stations), 2) if stations else 0.0

    if avg_aqi <= 50:
        aqi_status = "Good"
    elif avg_aqi <= 100:
        aqi_status = "Moderate"
    elif avg_aqi <= 150:
        aqi_status = "Unhealthy for Sensitive Groups"
    elif avg_aqi <= 200:
        aqi_status = "Unhealthy"
    else:
        aqi_status = "Hazardous"

    # Overall system health
    if critical_alerts > 2 or active_emergencies > 5 or avg_aqi > 200:
        system_status = "Critical"
    elif critical_alerts > 0 or congested_roads > 3 or avg_aqi > 100:
        system_status = "Warning"
    else:
        system_status = "Normal"

    return DashboardSummary(
        city_name="Hyderabad Smart Metropolitan",
        system_status=system_status,
        simulation_mode="Demo / Simulated Data",
        traffic={
            "active_cameras": active_cameras,
            "congested_roads": congested_roads,
            "average_speed": avg_speed,
            "incidents": traffic_incidents,
            "total_monitored_roads": len(traffic_roads)
        },
        waste={
            "total_bins": len(waste_bins),
            "full_bins": full_bins,
            "efficiency_percentage": efficiency,
            "waste_collected_tons": total_waste_collected_tons
        },
        water={
            "daily_consumption_kl": total_consumption_kl,
            "usage_percentage": avg_usage_pct,
            "reservoir_level_pct": avg_reservoir_pct,
            "active_leaks": active_leaks
        },
        emergency={
            "active_emergencies": active_emergencies,
            "critical_alerts": critical_alerts,
            "resolved_incidents": resolved_incidents,
            "avg_response_mins": 8.5
        },
        pollution={
            "aqi": avg_aqi,
            "aqi_status": aqi_status,
            "pm25": avg_pm25,
            "pm10": avg_pm10,
            "co": avg_co
        },
        last_updated=datetime.utcnow()
    )
