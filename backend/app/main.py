import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import engine, Base, SessionLocal
from app.db.seed import seed_data
from app.services.simulator import run_simulation_loop

from app.api.endpoints import auth, dashboard, traffic, waste, water, emergency, pollution, reports, collaboration


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Initialize DB tables
    Base.metadata.create_all(bind=engine)

    # 2. Seed initial data
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()

    # 3. Launch background simulator task
    sim_task = asyncio.create_task(run_simulation_loop())

    yield

    # Cleanup background task on shutdown
    sim_task.cancel()
    try:
        await sim_task
    except asyncio.CancelledError:
        pass


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows local Vite frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["Dashboard"])
app.include_router(traffic.router, prefix=f"{settings.API_V1_STR}/traffic", tags=["Traffic Monitoring"])
app.include_router(waste.router, prefix=f"{settings.API_V1_STR}/waste", tags=["Waste Management"])
app.include_router(water.router, prefix=f"{settings.API_V1_STR}/water", tags=["Water Analytics"])
app.include_router(emergency.router, prefix=f"{settings.API_V1_STR}/emergencies", tags=["Emergency Alerts"])
app.include_router(pollution.router, prefix=f"{settings.API_V1_STR}/pollution", tags=["Pollution Monitoring"])
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}/reports", tags=["Reports & Analytics"])
app.include_router(collaboration.router, prefix=f"{settings.API_V1_STR}/collaboration", tags=["Collaboration & Operations"])



@app.get("/")
def root():
    return {
        "message": "Welcome to Smart City Management System API",
        "status": "Online",
        "simulation": "Demo / Simulated IoT Telemetry Active",
        "docs": "/docs"
    }
