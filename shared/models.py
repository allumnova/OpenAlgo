from pydantic import BaseModel
from typing import List, Optional

class StrategyConfig(BaseModel):
    name: str
    symbol: str
    quantity: int
    enabled: bool = False
    parameters: dict = {}

class AccountStatus(BaseModel):
    broker: str
    pnl: float
    active_strategies: int
    engine_running: bool
