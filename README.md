# Smart City Management & Operations Command Center

A modern, responsive, full-stack smart city management system built with **FastAPI**, **SQLite**, **React.js**, **Tailwind CSS**, **Recharts**, and **React Leaflet**.

Designed for central monitoring and intelligent operations of metropolitan infrastructure across 5 core IoT domain modules:
1. **Traffic Monitoring**: Vehicle speeds, road congestion heat levels, and incident telemetry.
2. **Smart Waste Management**: Bin fill-level monitoring with interactive collection truck dispatching.
3. **Water Usage Analytics**: 24-hour utility consumption, reservoir levels, and automated pipeline leak response.
4. **Emergency Incident Command**: Live alert stream, multi-agency dispatching, and priority radius mapping.
5. **Pollution & Air Quality**: Real-time AQI index, fine particulate particle analytics (PM2.5, PM10, CO, NO2, SO2, O3), and environmental stations.

---

## Pre-Seeded Evaluator Login Credentials

When launching the backend server for the first time, SQLite database tables are automatically initialized and pre-seeded with sample data for **Hyderabad Metropolitan Hubs** (Hyderabad Central, Madhapur, Gachibowli, Hitech City, Kukatpally, Secunderabad, Banjara Hills, Jubilee Hills).

| Role | Email Address | Password | Privileges |
| ---- | ------------- | -------- | ---------- |
| **Command Administrator** | `admin@smartcity.gov.in` | `admin123` | Full access, CRUD operations, system parameters |
| **City Operator** | `operator@smartcity.gov.in` | `user123` | Read access & field crew dispatch action rights |

---

## Technology Stack

### Backend
- **Framework**: Python FastAPI
- **Server**: Uvicorn
- **ORM / Database**: SQLAlchemy + SQLite (`smartcity.db`)
- **Security**: JWT Authentication + Passlib (Bcrypt hashing)
- **Validation**: Pydantic v2
- **IoT Simulator**: Async background task updating sensor telemetry every 15s (**Demo / Simulated Data**)

### Frontend
- **Framework**: React.js 18 + Vite
- **Styling**: Tailwind CSS + Futuristic Glassmorphic Dark Command Theme
- **Mapping**: Leaflet + React Leaflet with custom color-coded pins
- **Analytics Charts**: Recharts
- **Icons**: Lucide React Icons
- **Notifications**: React Hot Toast

---

## Instructions to Run in VS Code

### Prerequisites
- Node.js (v18 or higher)
- Python 3.10+

---

### Step 1: Launch Backend Server (FastAPI)

1. Open VS Code terminal and navigate to `backend`:
```bash
cd backend
```

2. Create and activate a Python virtual environment (optional but recommended):
```bash
# On Windows PowerShell:
python -m venv venv
.\venv\Scripts\Activate.ps1
```

3. Install backend dependencies:
```bash
pip install -r requirements.txt
```

4. Run the FastAPI dev server:
```bash
python -m uvicorn app.main:app --reload --port 8000
```
> The API will start at `http://127.0.0.1:8000`. Swagger API documentation is available at `http://127.0.0.1:8000/docs`.

---

### Step 2: Launch Frontend Application (React + Vite)

1. Open a new terminal window in VS Code and navigate to `frontend`:
```bash
cd frontend
```

2. Install npm packages:
```bash
npm install
```

3. Start the Vite development server:
```bash
npm run dev
```
> The web app will open at `http://localhost:5173`.

---

## Project Structure Overview

```
smart-city-management/
├── backend/
│   ├── app/
│   │   ├── api/             # REST endpoints (auth, dashboard, traffic, waste, water, emergency, pollution, reports)
│   │   ├── core/            # Config, JWT authentication & password hashing
│   │   ├── db/              # SQLAlchemy database setup & Hyderabad seed data
│   │   ├── models/          # Database ORM models
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── services/        # Background IoT telemetry simulator loop
│   │   └── main.py          # FastAPI app entrypoint
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/      # GlassCard, StatCard, CityMap (Leaflet), Navbar, Sidebar
│   │   ├── context/         # AuthContext (JWT state), CityContext (Zone filtering)
│   │   ├── layouts/         # DashboardLayout
│   │   ├── pages/           # LandingPage, Login, Register, Dashboard, Traffic, Waste, Water, Emergency, Pollution, Reports, Settings, Profile
│   │   ├── services/        # Axios API client
│   │   ├── App.jsx          # Route definitions & protection
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

---

## Future Enhancements
1. **MQTT Telemetry Ingestion**: Replace simulation loop with real hardware IoT MQTT broker integration.
2. **AI Congestion Prediction**: Integrate Machine Learning models (LSTM/Prophet) to predict road congestion 2 hours in advance.
3. **CCTV Traffic Video Stream**: Embed WebRTC live camera feeds into traffic monitoring popups.
