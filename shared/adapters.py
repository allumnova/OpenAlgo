from abc import ABC, abstractmethod
import httpx
import os
from typing import Dict, Any, List

class BrokerAdapter(ABC):
    @abstractmethod
    async def get_positions(self) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    async def place_order(self, symbol: str, quantity: int, side: str, order_type: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    async def get_pnl(self) -> float:
        pass

class DhanAdapter(BrokerAdapter):
    def __init__(self, client_id: str = None, access_token: str = None):
        self.client_id = client_id or os.getenv("DHAN_CLIENT_ID")
        self.access_token = access_token or os.getenv("DHAN_ACCESS_TOKEN")
        self.base_url = "https://api.dhan.co"
        self.headers = {
            "access-token": self.access_token,
            "client-id": self.client_id,
            "Content-Type": "application/json"
        }

    async def get_positions(self) -> List[Dict[str, Any]]:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/positions", headers=self.headers)
            response.raise_for_status()
            return response.json()

    async def place_order(self, symbol: str, quantity: int, side: str, order_type: str) -> Dict[str, Any]:
        # Implementation details for Dhan order placement
        payload = {
            "dhanClientId": self.client_id,
            "correlationId": "openalgo_order",
            "transactionType": side.upper(), # BUY/SELL
            "exchangeSegment": "NSE_EQ", 
            "productType": "INTRA",
            "orderType": order_type.upper(), # LIMIT/MARKET
            "validity": "DAY",
            "securityId": symbol,
            "quantity": quantity,
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{self.base_url}/orders", headers=self.headers, json=payload)
            response.raise_for_status()
            return response.json()

    async def get_pnl(self) -> float:
        positions = await self.get_positions()
        # Calculate total realized + unrealized PnL from positions
        total_pnl = sum([float(p.get('realizedProfit', 0)) + float(p.get('unrealizedProfit', 0)) for p in positions])
        return total_pnl

class ZerodhaAdapter(BrokerAdapter):
    def __init__(self, api_key: str = None, access_token: str = None):
        from kiteconnect import KiteConnect
        self.api_key = api_key or os.getenv("ZERODHA_API_KEY")
        self.access_token = access_token or os.getenv("ZERODHA_ACCESS_TOKEN")
        self.kite = KiteConnect(api_key=self.api_key)
        self.kite.set_access_token(self.access_token)

    async def get_positions(self) -> List[Dict[str, Any]]:
        # KiteConnect is synchronous, usually we'd wrap in run_in_executor
        # For simplicity in this MVP, we call directly (consider async wrappers for production)
        return self.kite.positions()["net"]

    async def place_order(self, symbol: str, quantity: int, side: str, order_type: str) -> Dict[str, Any]:
        return self.kite.place_order(
            variety=self.kite.VARIETY_REGULAR,
            exchange=self.kite.EXCHANGE_NSE,
            tradingsymbol=symbol,
            transaction_type=side.upper(),
            quantity=quantity,
            product=self.kite.PRODUCT_MIS,
            order_type=order_type.upper()
        )

    async def get_pnl(self) -> float:
        positions = await self.get_positions()
        total_pnl = sum([float(p.get('m2m', 0)) for p in positions])
        return total_pnl
