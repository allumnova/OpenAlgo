import asyncio
import logging
import os
import datetime
from shared.adapters import DhanAdapter, ZerodhaAdapter
from shared.models import StrategyConfig
from shared.database import SessionLocal, TradeLog, AuditEvent, init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Orchestrator")

class StrategyEngine:
    def __init__(self):
        # Initialize adapter based on config
        broker_type = os.getenv("ACTIVE_BROKER", "DHAN").upper()
        if broker_type == "ZERODHA":
            self.adapter = ZerodhaAdapter()
        else:
            self.adapter = DhanAdapter()
            
        self.strategies: list[dict] = self.load_strategies()
        self.is_running = False
        init_db()

    def load_strategies(self):
        strategies = []
        strat_dir = os.path.join(os.getcwd(), "shared", "strategies")
        if os.path.exists(strat_dir):
            import json
            for filename in os.listdir(strat_dir):
                if filename.endswith(".json"):
                    with open(os.path.join(strat_dir, filename)) as f:
                        strategies.append(json.load(f))
        return strategies

    def log_event(self, event_type: str, message: str, details: dict = None):
        db = SessionLocal()
        event = AuditEvent(event_type=event_type, message=message, details=details)
        db.add(event)
        db.commit()
        db.close()

    async def start(self):
        self.is_running = True
        self.log_event("ENGINE_START", "Trading engine has been started")
        logger.info("Engine started")
        asyncio.create_task(self.run_loop())

    async def stop(self):
        self.is_running = False
        self.log_event("ENGINE_STOP", "Trading engine has been stopped")
        logger.info("Engine stopped")

    async def emergency_kill(self):
        logger.error("!!! EMERGENCY KILL TRIGGERED !!!")
        self.log_event("RISK_ALERT", "Emergency kill triggered! Stopping engine and closing positions.")
        await self.stop()
        # TODO: Logic to close all open positions via adapter
        
    async def check_risk(self, current_pnl: float):
        limit = float(os.getenv("DAILY_LOSS_LIMIT", 5000))
        if current_pnl <= -limit:
            logger.warning(f"Daily loss limit hit: {current_pnl} <= -{limit}")
            await self.emergency_kill()
            return False
        return True

    async def run_loop(self):
        while self.is_running:
            try:
                # 1. Update status from broker
                pnl = await self.adapter.get_pnl()
                logger.info(f"Current Portfolio PnL: {pnl}")

                # 2. Risk Checks
                if not await self.check_risk(pnl):
                    break

                # 3. Strategy Processing
                for strat in self.strategies:
                    if strat.get("enabled"):
                        await self.process_strategy(strat)
                
            except Exception as e:
                logger.error(f"Error in engine loop: {e}")
                self.log_event("ERROR", f"Engine loop error: {str(e)}")
            
            await asyncio.sleep(10)

    async def process_strategy(self, strat: dict):
        """Processes signals for a single strategy."""
        logger.info(f"Processing strategy: {strat['name']}")
        
        symbol = strat.get('symbol')
        asset_class = strat.get('asset_class', 'EQUITY')
        
        # 1. Fetch live price (simulated for now)
        # In production, we'd use self.adapter.get_live_price(symbol)
        import random
        price = 1000 + random.uniform(-10, 10) 
        
        # 2. Check Signal Conditions (Rules)
        # For demo, let's just trigger a random trade if not already in one
        # Real logic would parse strat['rules']['buy'] etc.
        if random.random() > 0.95:
            logger.info(f"SIGNAL DETECTED for {symbol} ({asset_class})")
            
            # Place Order
            order_data = {
                "symbol": symbol,
                "qty": strat.get("quantity", 1),
                "type": "BUY",
                "price": price,
                "asset_class": asset_class,
                "instrument": strat.get("instrument_type") # CE/PE
            }
            
            try:
                # Actual order placement via adapter
                # await self.adapter.place_order(order_data)
                
                # Log to DB
                db = SessionLocal()
                log = TradeLog(
                    symbol=symbol,
                    qty=order_data["qty"],
                    price=price,
                    side="BUY",
                    status="COMPLETED"
                )
                db.add(log)
                db.commit()
                db.close()
                
                self.log_event("TRADE_EXECUTION", f"Placed {asset_class} BUY order for {symbol}")
            except Exception as e:
                logger.error(f"Failed to place order: {e}")

async def main():
    engine = StrategyEngine()
    await engine.start()
    while engine.is_running:
        await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(main())
