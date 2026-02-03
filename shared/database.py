from sqlalchemy import create_all, create_engine, Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime
import os

DB_PATH = os.path.join(os.getcwd(), "data", "openalgo.db")
engine = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class TradeLog(Base):
    __tablename__ = "trade_logs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    strategy_name = Column(String)
    symbol = Column(String)
    side = Column(String) # BUY/SELL
    quantity = Column(Integer)
    price = Column(Float)
    status = Column(String) # COMPLETED/FAILED
    message = Column(String)

class AuditEvent(Base):
    __tablename__ = "audit_events"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    event_type = Column(String) # RISK_ALERT, ENGINE_START, CONFIG_CHANGE
    message = Column(String)
    details = Column(JSON, nullable=True)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
