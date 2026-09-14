import asyncio
import random
import logging
from datetime import datetime
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.models import Traffic, WasteBin, WaterUsage, Pollution, Emergency

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("simulator")


async def run_simulation_loop():
    """
    Background simulation service that simulates real-time IoT sensor telemetry feeds
    for traffic, waste bins, water usage, and pollution stations.
    """
    logger.info("Starting Smart City IoT Sensor Background Simulator...")
    while True:
        try:
            db: Session = SessionLocal()
            
            # 1. Simulate Traffic Sensors
            traffic_records = db.query(Traffic).all()
            for road in traffic_records:
                # Random vehicle count shift
                shift = random.randint(-15, 20)
                road.vehicle_count = max(50, road.vehicle_count + shift)
                
                # Speed fluctuation
                speed_shift = round(random.uniform(-2.5, 2.5), 1)
                new_speed = max(10.0, min(80.0, road.average_speed + speed_shift))
                road.average_speed = new_speed
                
                # Dynamic Congestion Status
                if new_speed < 22.0 or road.vehicle_count > 2500:
                    road.congestion_level = "Heavy"
                elif new_speed < 40.0 or road.vehicle_count > 1500:
                    road.congestion_level = "Moderate"
                else:
                    road.congestion_level = "Low"
                    
                road.timestamp = datetime.utcnow()

            # 2. Simulate Waste Bin Fill Levels
            waste_bins = db.query(WasteBin).all()
            for bin_item in waste_bins:
                if bin_item.status != "Full":
                    increase = round(random.uniform(0.1, 1.2), 1)
                    bin_item.fill_level = min(100.0, bin_item.fill_level + increase)
                    
                    if bin_item.fill_level >= 95.0:
                        bin_item.status = "Full"
                    elif bin_item.fill_level >= 85.0:
                        bin_item.status = "Almost Full"

            # 3. Simulate Water Usage
            water_zones = db.query(WaterUsage).all()
            for water in water_zones:
                consumption_shift = round(random.uniform(-10.0, 15.0), 1)
                water.consumption_kl = max(500.0, water.consumption_kl + consumption_shift)
                water.usage_percentage = round((water.consumption_kl / water.capacity_kl) * 100, 1)
                water.timestamp = datetime.utcnow()

            # 4. Simulate Air Quality Pollution Monitors
            pollution_stations = db.query(Pollution).all()
            for station in pollution_stations:
                aqi_shift = random.randint(-3, 3)
                new_aqi = max(15, min(400, station.aqi + aqi_shift))
                station.aqi = new_aqi
                station.pm25 = round(max(5.0, station.pm25 + (aqi_shift * 0.4)), 1)
                station.pm10 = round(max(10.0, station.pm10 + (aqi_shift * 0.8)), 1)
                
                if new_aqi <= 50:
                    station.status = "Good"
                elif new_aqi <= 100:
                    station.status = "Moderate"
                elif new_aqi <= 150:
                    station.status = "Unhealthy for Sensitive Groups"
                elif new_aqi <= 200:
                    station.status = "Unhealthy"
                elif new_aqi <= 300:
                    station.status = "Very Unhealthy"
                else:
                    station.status = "Hazardous"
                    
                station.timestamp = datetime.utcnow()

            db.commit()
            db.close()
        except Exception as e:
            logger.error(f"Error in simulation loop: {e}")
            
        # Run loop every 15 seconds
        await asyncio.sleep(15)
