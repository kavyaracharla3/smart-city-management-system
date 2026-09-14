from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.models import Traffic, WasteBin, WaterUsage, WaterLeak, Emergency, Pollution

router = APIRouter()


@router.get("/traffic")
def get_traffic_report(zone: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Traffic)
    if zone and zone != "All Zones":
        query = query.filter(Traffic.city_zone == zone)
    roads = query.all()

    total_vehicles = sum([r.vehicle_count for r in roads])
    avg_speed = round(sum([r.average_speed for r in roads]) / len(roads), 1) if roads else 0.0
    heavy_congestion_cnt = len([r for r in roads if r.congestion_level == "Heavy"])
    total_incidents = sum([r.incidents_count for r in roads])

    return {
        "report_type": "Traffic Operations Analysis",
        "generated_at": datetime.utcnow().isoformat(),
        "total_monitored_roads": len(roads),
        "total_active_vehicles": total_vehicles,
        "average_speed_kmh": avg_speed,
        "heavy_congestion_hotspots": heavy_congestion_cnt,
        "reported_incidents": total_incidents,
        "data": [
            {
                "road": r.road_name,
                "location": r.location,
                "zone": r.city_zone,
                "vehicle_count": r.vehicle_count,
                "avg_speed": r.average_speed,
                "congestion": r.congestion_level,
                "incidents": r.incidents_count
            }
            for r in roads
        ]
    }


@router.get("/waste")
def get_waste_report(zone: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(WasteBin)
    if zone and zone != "All Zones":
        query = query.filter(WasteBin.city_zone == zone)
    bins = query.all()

    full_bins = len([b for b in bins if b.status in ["Almost Full", "Full"]])
    avg_fill = round(sum([b.fill_level for b in bins]) / len(bins), 1) if bins else 0.0

    return {
        "report_type": "Waste Management Efficiency Report",
        "generated_at": datetime.utcnow().isoformat(),
        "total_smart_bins": len(bins),
        "critical_fill_bins": full_bins,
        "average_fill_percentage": avg_fill,
        "collection_efficiency": round(100 - (full_bins / len(bins) * 100) if bins else 100, 1),
        "data": [
            {
                "bin_code": b.bin_code,
                "location": b.location,
                "zone": b.city_zone,
                "fill_level": b.fill_level,
                "status": b.status,
                "last_collection": b.last_collection.isoformat()
            }
            for b in bins
        ]
    }


@router.get("/water")
def get_water_report(zone: Optional[str] = Query(None), db: Session = Depends(get_db)):
    w_query = db.query(WaterUsage)
    l_query = db.query(WaterLeak)
    if zone and zone != "All Zones":
        w_query = w_query.filter(WaterUsage.zone == zone)
        l_query = l_query.filter(WaterLeak.zone == zone)
    
    usages = w_query.all()
    leaks = l_query.all()

    total_consumption = round(sum([u.consumption_kl for u in usages]), 1)
    active_leaks = [l for l in leaks if l.status != "Resolved"]
    estimated_loss = round(sum([l.estimated_loss_lph for l in active_leaks]), 1)

    return {
        "report_type": "Water Utility & Distribution Analytics",
        "generated_at": datetime.utcnow().isoformat(),
        "total_zones_monitored": len(usages),
        "total_consumption_kl": total_consumption,
        "active_leaks_count": len(active_leaks),
        "estimated_water_loss_lph": estimated_loss,
        "zones": [
            {
                "zone": u.zone,
                "consumption_kl": u.consumption_kl,
                "capacity_kl": u.capacity_kl,
                "usage_percentage": u.usage_percentage,
                "reservoir_level_pct": u.reservoir_level_pct
            }
            for u in usages
        ],
        "leaks": [
            {
                "leak_code": l.leak_code,
                "location": l.location,
                "zone": l.zone,
                "loss_lph": l.estimated_loss_lph,
                "severity": l.severity,
                "status": l.status
            }
            for l in leaks
        ]
    }


@router.get("/emergency")
def get_emergency_report(zone: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Emergency)
    if zone and zone != "All Zones":
        query = query.filter(Emergency.zone == zone)
    emergencies = query.all()

    active_cnt = len([e for e in emergencies if e.status != "Resolved"])
    critical_cnt = len([e for e in emergencies if e.severity == "Critical"])
    resolved_cnt = len([e for e in emergencies if e.status == "Resolved"])

    return {
        "report_type": "Emergency Incident Response Log",
        "generated_at": datetime.utcnow().isoformat(),
        "total_incidents": len(emergencies),
        "active_incidents": active_cnt,
        "critical_severity_incidents": critical_cnt,
        "resolved_incidents": resolved_cnt,
        "average_response_mins": 8.5,
        "data": [
            {
                "id": e.id,
                "type": e.emergency_type,
                "location": e.location,
                "zone": e.zone,
                "severity": e.severity,
                "status": e.status,
                "assigned_team": e.assigned_team,
                "created_at": e.created_at.isoformat()
            }
            for e in emergencies
        ]
    }


@router.get("/pollution")
def get_pollution_report(zone: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Pollution)
    if zone and zone != "All Zones":
        query = query.filter(Pollution.zone == zone)
    stations = query.all()

    avg_aqi = int(sum([p.aqi for p in stations]) / len(stations)) if stations else 0

    return {
        "report_type": "Environmental & Air Quality Assessment",
        "generated_at": datetime.utcnow().isoformat(),
        "total_stations": len(stations),
        "city_wide_avg_aqi": avg_aqi,
        "stations": [
            {
                "station_code": s.station_code,
                "station_name": s.station_name,
                "location": s.location,
                "zone": s.zone,
                "aqi": s.aqi,
                "pm25": s.pm25,
                "pm10": s.pm10,
                "status": s.status
            }
            for s in stations
        ]
    }
