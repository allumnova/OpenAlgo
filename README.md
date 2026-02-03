# 🌌 OpenAlgo

**OpenAlgo** is a powerful, open-source algorithmic trading platform designed for retail traders who want professional-grade tools with zero recurring costs. High-frequency execution, remote control, and advanced risk management—all self-hosted on your own hardware.

---

## ✨ Key Features

- 🔌 **Multi-Broker Integration**: Support for **Dhan** and **Zerodha (Kite)** out of the box.
- 📱 **WhatsApp Remote Control**: Control your engine, check PnL, and trigger emergency stops via WhatsApp.
- 🛡️ **Hardened Risk Management**: Mandatory stop-losses, daily loss limits, and automated position liquidation.
- 💻 **Desktop Native Experience**: Built with Electron for a premium, low-latency desktop management interface.
- 📊 **Audit Logging**: Every trade and system event is logged to a local SQLite database for full transparency.
- 🧩 **Strategy Marketplace**: Define strategies using a simple, no-code JSON format.

---

## 🏗️ Architecture

OpenAlgo runs on a modular, micro-service architecture orchestrated via Docker:

- **FastAPI Backend**: The central communication hub.
- **Python Engine**: High-performance trading logic and adapter layer.
- **React Dashboard**: Premium glassmorphism UI for monitoring and configuration.
- **Node.js WhatsApp Agent**: Secure remote control gateway.
- **SQLite Database**: Persistent, local-first storage.

---

## 🚀 Quick Start

### Prerequisites
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/) (for local Desktop App)
- Broker API Keys (Dhan or Zerodha)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/OpenAlgo.git
   cd OpenAlgo
   ```

2. **Configure Environment**:
   Copy `.env.example` to `.env` and fill in your details:
   ```bash
   cp .env.example .env
   ```

3. **Launch the platform**:
   On Windows, simply run:
   ```batch
   start.bat
   ```

4. **Access the Dashboard**:
   Open [http://localhost:3000](http://localhost:3000) in your browser or choose `y` in the launcher to start the **Desktop App**.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.10+, FastAPI, SQLAlchemy, KiteConnect, DhanHQ
- **Frontend**: React 18, Vite, Vanilla CSS (Glassmorphism)
- **Desktop**: Electron
- **Bot**: Node.js, WhatsApp-Web.js
- **DevOps**: Docker, Docker Compose

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

> [!CAUTION]
> **Trading involves significant risk.** This software is provided "as is" without warranty of any kind. Always test your strategies in paper trading or with small amounts before going live.
