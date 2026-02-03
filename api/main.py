from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="OpenAlgo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "OpenAlgo API is running", "version": "0.1.0"}

@app.get("/status")
async def get_status():
    # Placeholder for engine status
    return {
        "engine_status": "disconnected", 
        "broker": "Dhan", 
        "active_strategies": 0,
        "pnl": 0.0
    }

@app.post("/engine/start")
async def start_engine():
    # Placeholder for engine control
    return {"message": "Engine start request received"}

@app.post("/engine/stop")
async def stop_engine():
    # Placeholder for engine control
    return {"message": "Engine stop request received"}

@app.get("/logs/trades")
async def get_trade_logs():
    from shared.database import SessionLocal, TradeLog
    db = SessionLocal()
    logs = db.query(TradeLog).order_by(TradeLog.timestamp.desc()).limit(50).all()
    db.close()
    return logs

@app.get("/strategies")
async def list_strategies():
    strat_dir = os.path.join(os.getcwd(), "..", "shared", "strategies")
    strategies = []
    if os.path.exists(strat_dir):
        import json
        for filename in os.listdir(strat_dir):
            if filename.endswith(".json"):
                with open(os.path.join(strat_dir, filename)) as f:
                    strategies.append(json.load(f))
    return strategies

@app.post("/strategies")
async def save_strategy(strategy: dict):
    strat_dir = os.path.join(os.getcwd(), "..", "shared", "strategies")
    os.makedirs(strat_dir, exist_ok=True)
    filename = f"{strategy['name'].lower().replace(' ', '_')}.json"
    import json
    with open(os.path.join(strat_dir, filename), "w") as f:
        json.dump(strategy, f, indent=2)
    return {"message": "Strategy saved"}

@app.get("/logs/audit")
async def get_audit_logs():
    from shared.database import SessionLocal, AuditEvent
    db = SessionLocal()
    logs = db.query(AuditEvent).order_by(AuditEvent.timestamp.desc()).limit(50).all()
    db.close()
    return logs
