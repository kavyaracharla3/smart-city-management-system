from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.models import User, Traffic, WasteBin, WaterUsage, WaterLeak, Emergency, Pollution
from app.core.security import get_password_hash


def seed_data(db: Session):
    # 1. Users
    if not db.query(User).filter(User.email == "admin@smartcity.gov.in").first():
        admin_user = User(
            name="Command Center Admin",
            email="admin@smartcity.gov.in",
            password_hash=get_password_hash("admin123"),
            role="admin",
        )
        db.add(admin_user)

    if not db.query(User).filter(User.email == "operator@smartcity.gov.in").first():
        operator_user = User(
            name="City Operator",
            email="operator@smartcity.gov.in",
            password_hash=get_password_hash("user123"),
            role="user",
        )
        db.add(operator_user)

    # 2. Traffic Roads (10 roads)
    if db.query(Traffic).count() == 0:
        traffic_data = [
            {"road_name": "Outer Ring Road (ORR) - Gachibowli Stretch", "location": "Gachibowli Junction", "city_zone": "Gachibowli", "vehicle_count": 1420, "average_speed": 62.5, "congestion_level": "Low", "incidents_count": 0, "camera_status": "Active", "lat": 17.4401, "lng": 78.3489},
            {"road_name": "Cyber Towers Flyover", "location": "Hitech City", "city_zone": "Hitech City", "vehicle_count": 2890, "average_speed": 18.2, "congestion_level": "Heavy", "incidents_count": 1, "camera_status": "Active", "lat": 17.4504, "lng": 78.3808},
            {"road_name": "Road No. 36 Jubilee Hills", "location": "Jubilee Hills Checkpost", "city_zone": "Jubilee Hills", "vehicle_count": 2100, "average_speed": 28.0, "congestion_level": "Moderate", "incidents_count": 0, "camera_status": "Active", "lat": 17.4319, "lng": 78.4073},
            {"road_name": "Banjara Hills Main Road (Road No. 1)", "location": "City Center Mall Intersection", "city_zone": "Banjara Hills", "vehicle_count": 2450, "average_speed": 22.4, "congestion_level": "Heavy", "incidents_count": 0, "camera_status": "Active", "lat": 17.4156, "lng": 78.4487},
            {"road_name": "Kukatpally Housing Board (KPHB) Main Rd", "location": "KPHB Metro Station", "city_zone": "Kukatpally", "vehicle_count": 3100, "average_speed": 15.0, "congestion_level": "Heavy", "incidents_count": 2, "camera_status": "Active", "lat": 17.4937, "lng": 78.3984},
            {"road_name": "Inorbit Mall Road", "location": "Madhapur", "city_zone": "Madhapur", "vehicle_count": 1650, "average_speed": 34.5, "congestion_level": "Moderate", "incidents_count": 0, "camera_status": "Active", "lat": 17.4375, "lng": 78.3847},
            {"road_name": "Paradise Circle & MG Road", "location": "Secunderabad", "city_zone": "Secunderabad", "vehicle_count": 1980, "average_speed": 31.0, "congestion_level": "Moderate", "incidents_count": 0, "camera_status": "Active", "lat": 17.4416, "lng": 78.4983},
            {"road_name": "Tank Bund Promenade Rd", "location": "Hussain Sagar Lakefront", "city_zone": "Hyderabad Central", "vehicle_count": 1120, "average_speed": 45.0, "congestion_level": "Low", "incidents_count": 0, "camera_status": "Active", "lat": 17.4239, "lng": 78.4738},
            {"road_name": "Mehdipatnam PVNR Expressway", "location": "Pillar 42 Crossing", "city_zone": "Hyderabad Central", "vehicle_count": 2700, "average_speed": 24.5, "congestion_level": "Heavy", "incidents_count": 1, "camera_status": "Active", "lat": 17.3949, "lng": 78.4445},
            {"road_name": "Financial District Blvd", "location": "Nanakramguda", "city_zone": "Gachibowli", "vehicle_count": 890, "average_speed": 55.0, "congestion_level": "Low", "incidents_count": 0, "camera_status": "Active", "lat": 17.4140, "lng": 78.3398},
        ]
        for t in traffic_data:
            db.add(Traffic(**t))

    # 3. Waste Bins (15 bins)
    if db.query(WasteBin).count() == 0:
        waste_data = [
            {"bin_code": "BIN-HYD-101", "location": "Central Market Square", "city_zone": "Hyderabad Central", "fill_level": 89.0, "capacity_liters": 1100, "status": "Almost Full", "lat": 17.4245, "lng": 78.4725},
            {"bin_code": "BIN-HYD-102", "location": "Cyber Towers Gate 2", "city_zone": "Hitech City", "fill_level": 96.5, "capacity_liters": 1100, "status": "Full", "lat": 17.4510, "lng": 78.3812},
            {"bin_code": "BIN-HYD-103", "location": "Inorbit Mall Parking Lot B", "city_zone": "Madhapur", "fill_level": 42.0, "capacity_liters": 1500, "status": "Normal", "lat": 17.4380, "lng": 78.3852},
            {"bin_code": "BIN-HYD-104", "location": "Jubilee Hills Club Entrance", "city_zone": "Jubilee Hills", "fill_level": 25.0, "capacity_liters": 1100, "status": "Normal", "lat": 17.4325, "lng": 78.4080},
            {"bin_code": "BIN-HYD-105", "location": "Banjara Hills Road 12 Market", "city_zone": "Banjara Hills", "fill_level": 91.0, "capacity_liters": 1100, "status": "Almost Full", "lat": 17.4162, "lng": 78.4492},
            {"bin_code": "BIN-HYD-106", "location": "KPHB Phase 1 Bus Stop", "city_zone": "Kukatpally", "fill_level": 98.0, "capacity_liters": 2000, "status": "Full", "lat": 17.4942, "lng": 78.3990},
            {"bin_code": "BIN-HYD-107", "location": "Secunderabad Railway Station North Plaza", "city_zone": "Secunderabad", "fill_level": 94.0, "capacity_liters": 2000, "status": "Full", "lat": 17.4422, "lng": 78.4988},
            {"bin_code": "BIN-HYD-108", "location": "DLF Cyber City Food Court", "city_zone": "Gachibowli", "fill_level": 68.0, "capacity_liters": 1100, "status": "Normal", "lat": 17.4485, "lng": 78.3562},
            {"bin_code": "BIN-HYD-109", "location": "Mindspace IT Park Gate 3", "city_zone": "Madhapur", "fill_level": 35.0, "capacity_liters": 1100, "status": "Normal", "lat": 17.4402, "lng": 78.3801},
            {"bin_code": "BIN-HYD-110", "location": "NTR Gardens Main Entrance", "city_zone": "Hyderabad Central", "fill_level": 55.0, "capacity_liters": 1100, "status": "Normal", "lat": 17.4120, "lng": 78.4680},
            {"bin_code": "BIN-HYD-111", "location": "Prasad's IMAX Plaza", "city_zone": "Hyderabad Central", "fill_level": 78.0, "capacity_liters": 1100, "status": "Normal", "lat": 17.4145, "lng": 78.4670},
            {"bin_code": "BIN-HYD-112", "location": "Forum Sujana Mall East Wing", "city_zone": "Kukatpally", "fill_level": 92.5, "capacity_liters": 1500, "status": "Almost Full", "lat": 17.4840, "lng": 78.3880},
            {"bin_code": "BIN-HYD-113", "location": "Botanical Garden Gate 1", "city_zone": "Gachibowli", "fill_level": 15.0, "capacity_liters": 1100, "status": "Normal", "lat": 17.4560, "lng": 78.3620},
            {"bin_code": "BIN-HYD-114", "location": "Clock Tower Park", "city_zone": "Secunderabad", "fill_level": 82.0, "capacity_liters": 1100, "status": "Normal", "lat": 17.4450, "lng": 78.5020},
            {"bin_code": "BIN-HYD-115", "location": "Film Nagar Cultural Center", "city_zone": "Jubilee Hills", "fill_level": 48.0, "capacity_liters": 1100, "status": "Normal", "lat": 17.4200, "lng": 78.4120},
        ]
        for w in waste_data:
            db.add(WasteBin(**w))

    # 4. Water Usage (8 zones)
    if db.query(WaterUsage).count() == 0:
        water_data = [
            {"zone": "Hyderabad Central", "consumption_kl": 4250.0, "capacity_kl": 6000.0, "usage_percentage": 70.8, "reservoir_level_pct": 82.0, "active_leaks_count": 2},
            {"zone": "Hitech City", "consumption_kl": 6800.0, "capacity_kl": 8000.0, "usage_percentage": 85.0, "reservoir_level_pct": 78.5, "active_leaks_count": 1},
            {"zone": "Madhapur", "consumption_kl": 3900.0, "capacity_kl": 5000.0, "usage_percentage": 78.0, "reservoir_level_pct": 80.0, "active_leaks_count": 1},
            {"zone": "Gachibowli", "consumption_kl": 5100.0, "capacity_kl": 7000.0, "usage_percentage": 72.8, "reservoir_level_pct": 88.0, "active_leaks_count": 0},
            {"zone": "Kukatpally", "consumption_kl": 7200.0, "capacity_kl": 8500.0, "usage_percentage": 84.7, "reservoir_level_pct": 74.0, "active_leaks_count": 2},
            {"zone": "Secunderabad", "consumption_kl": 4800.0, "capacity_kl": 6500.0, "usage_percentage": 73.8, "reservoir_level_pct": 81.0, "active_leaks_count": 0},
            {"zone": "Banjara Hills", "consumption_kl": 3400.0, "capacity_kl": 4500.0, "usage_percentage": 75.5, "reservoir_level_pct": 86.5, "active_leaks_count": 0},
            {"zone": "Jubilee Hills", "consumption_kl": 3100.0, "capacity_kl": 4000.0, "usage_percentage": 77.5, "reservoir_level_pct": 89.0, "active_leaks_count": 0},
        ]
        for wt in water_data:
            db.add(WaterUsage(**wt))

    # 5. Water Leaks (6 leaks)
    if db.query(WaterLeak).count() == 0:
        leak_data = [
            {"leak_code": "LEAK-HYD-301", "location": "Nizamia Observatory Rd", "zone": "Hyderabad Central", "estimated_loss_lph": 1200.0, "severity": "High", "status": "Detected", "lat": 17.4080, "lng": 78.4620},
            {"leak_code": "LEAK-HYD-302", "location": "Cyber Tower Flyover Base", "zone": "Hitech City", "estimated_loss_lph": 2400.0, "severity": "Critical", "status": "Investigating", "lat": 17.4515, "lng": 78.3815},
            {"leak_code": "LEAK-HYD-303", "location": "Kukatpally JNTU Metro Pillar 38", "zone": "Kukatpally", "estimated_loss_lph": 850.0, "severity": "Medium", "status": "Detected", "lat": 17.4970, "lng": 78.3910},
            {"leak_code": "LEAK-HYD-304", "location": "Madhapur Police Station Rd", "zone": "Madhapur", "estimated_loss_lph": 450.0, "severity": "Low", "status": "Resolved", "lat": 17.4420, "lng": 78.3900},
            {"leak_code": "LEAK-HYD-305", "location": "Kukatpally Phase 3 Pipeline", "zone": "Kukatpally", "estimated_loss_lph": 1800.0, "severity": "High", "status": "Investigating", "lat": 17.4890, "lng": 78.4020},
            {"leak_code": "LEAK-HYD-306", "location": "Lakdikapul Main Junction", "zone": "Hyderabad Central", "estimated_loss_lph": 320.0, "severity": "Low", "status": "Resolved", "lat": 17.4040, "lng": 78.4660},
        ]
        for lk in leak_data:
            db.add(WaterLeak(**lk))

    # 6. Emergencies (10 alerts)
    if db.query(Emergency).count() == 0:
        emergencies_data = [
            {"emergency_type": "Accident", "location": "Cyber Towers Underpass", "zone": "Hitech City", "severity": "Critical", "description": "Multi-vehicle collision near Cyber Towers underpass blocking 2 lanes.", "status": "Active", "assigned_team": "Traffic Response Alpha", "lat": 17.4508, "lng": 78.3810},
            {"emergency_type": "Fire", "location": "Commercial Complex, Road No. 1", "zone": "Banjara Hills", "severity": "Critical", "description": "Electrical transformer fire reported on the ground floor of commercial building.", "status": "Investigating", "assigned_team": "Fire Rescue Squad 4", "lat": 17.4160, "lng": 78.4480},
            {"emergency_type": "Water Mains Burst", "location": "Kukatpally Metro Pillar 42", "zone": "Kukatpally", "severity": "High", "description": "High-pressure water main burst causing localized road flooding and traffic diversion.", "status": "Active", "assigned_team": "Water Works Rapid Crew", "lat": 17.4940, "lng": 78.3980},
            {"emergency_type": "Medical Emergency", "location": "Secunderabad Station Platform 1", "zone": "Secunderabad", "severity": "High", "description": "Passenger collapsed with cardiac distress. Ambulance dispatched.", "status": "Investigating", "assigned_team": "EMRI 108 Ambulance Unit", "lat": 17.4420, "lng": 78.4985},
            {"emergency_type": "Infrastructure Failure", "location": "Gachibowli ORR Slip Road", "zone": "Gachibowli", "severity": "Medium", "description": "Streetlight grid power outage affecting 1.5 km stretch.", "status": "Active", "assigned_team": "Electrical Maintenance 2", "lat": 17.4410, "lng": 78.3495},
            {"emergency_type": "Crime", "location": "Madhapur Metro Station Gate 1", "zone": "Madhapur", "severity": "Medium", "description": "Reported robbery incident. Local patrol unit dispatched.", "status": "Investigating", "assigned_team": "Madhapur Police Patrol", "lat": 17.4385, "lng": 78.3855},
            {"emergency_type": "Accident", "location": "Jubilee Hills Checkpost Flyover", "zone": "Jubilee Hills", "severity": "High", "description": "Overturned cargo truck spilling minor oil on road.", "status": "Resolved", "assigned_team": "Hazmat & Towing Crew", "lat": 17.4320, "lng": 78.4075},
            {"emergency_type": "Flood", "location": "Begumpet Flyover Underpass", "zone": "Secunderabad", "severity": "High", "description": "Monsoon waterlogging water level at 1.2 feet.", "status": "Resolved", "assigned_team": "Stormwater Drainage Team", "lat": 17.4440, "lng": 78.4680},
            {"emergency_type": "Fire", "location": "Scrap Yard, Balanagar", "zone": "Kukatpally", "severity": "Low", "description": "Minor garbage fire contained by local security.", "status": "Resolved", "assigned_team": "Station 12 Engine", "lat": 17.4720, "lng": 78.4410},
            {"emergency_type": "Infrastructure Failure", "location": "Tank Bund Smart Pole #14", "zone": "Hyderabad Central", "severity": "Low", "description": "Telemetry sensor offline due to solar backup battery fault.", "status": "Resolved", "assigned_team": "IoT Field Technicians", "lat": 17.4240, "lng": 78.4730},
        ]
        for e in emergencies_data:
            db.add(Emergency(**e))

    # 7. Pollution Monitoring Stations (8 stations)
    if db.query(Pollution).count() == 0:
        pollution_data = [
            {"station_code": "AQI-HYD-01", "station_name": "Sanathnagar Industrial Monitor", "location": "Sanathnagar", "zone": "Kukatpally", "aqi": 164, "pm25": 78.4, "pm10": 142.0, "co": 2.1, "no2": 44.5, "so2": 18.2, "o3": 38.0, "status": "Unhealthy", "lat": 17.4580, "lng": 78.4440},
            {"station_code": "AQI-HYD-02", "station_name": "Hitech City Smart Sensor Pole", "location": "Cyber Towers", "zone": "Hitech City", "aqi": 82, "pm25": 28.5, "pm10": 58.0, "co": 0.8, "no2": 22.0, "so2": 8.5, "o3": 32.0, "status": "Moderate", "lat": 17.4500, "lng": 78.3800},
            {"station_code": "AQI-HYD-03", "station_name": "Botanical Garden Eco Monitor", "location": "Gachibowli Eco Park", "zone": "Gachibowli", "aqi": 42, "pm25": 12.0, "pm10": 26.0, "co": 0.3, "no2": 12.0, "so2": 4.1, "o3": 25.0, "status": "Good", "lat": 17.4550, "lng": 78.3610},
            {"station_code": "AQI-HYD-04", "station_name": "Punjagutta Junction Monitor", "location": "Punjagutta Checkpost", "zone": "Hyderabad Central", "aqi": 138, "pm25": 54.0, "pm10": 115.0, "co": 1.6, "no2": 38.0, "so2": 14.0, "o3": 35.0, "status": "Unhealthy for Sensitive Groups", "lat": 17.4260, "lng": 78.4530},
            {"station_code": "AQI-HYD-05", "station_name": "Secunderabad Station Yard", "location": "Secunderabad Junction", "zone": "Secunderabad", "aqi": 118, "pm25": 46.2, "pm10": 98.0, "co": 1.3, "no2": 31.0, "so2": 11.5, "o3": 29.0, "status": "Unhealthy for Sensitive Groups", "lat": 17.4410, "lng": 78.4980},
            {"station_code": "AQI-HYD-06", "station_name": "Jubilee Hills Park Observatory", "location": "KBR National Park", "zone": "Jubilee Hills", "aqi": 38, "pm25": 9.5, "pm10": 22.0, "co": 0.2, "no2": 10.0, "so2": 3.8, "o3": 28.0, "status": "Good", "lat": 17.4220, "lng": 78.4180},
            {"station_code": "AQI-HYD-07", "station_name": "Banjara Hills Rd 1 Monitor", "location": "Care Hospital Crossing", "zone": "Banjara Hills", "aqi": 76, "pm25": 24.0, "pm10": 52.0, "co": 0.7, "no2": 19.5, "so2": 7.2, "o3": 31.0, "status": "Moderate", "lat": 17.4140, "lng": 78.4470},
            {"station_code": "AQI-HYD-08", "station_name": "Madhapur Image Hospital Rd", "location": "Madhapur Hub", "zone": "Madhapur", "aqi": 88, "pm25": 31.0, "pm10": 64.0, "co": 0.9, "no2": 24.0, "so2": 9.0, "o3": 34.0, "status": "Moderate", "lat": 17.4390, "lng": 78.3880},
        ]
        for p in pollution_data:
            db.add(Pollution(**p))

    db.commit()
