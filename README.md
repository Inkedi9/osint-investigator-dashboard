# 🧠 OSINT Investigator — Advanced Cyber Investigation Platform

Démo : https://osint-investigator-dashboard.vercel.app/

## 🚀 Overview

**OSINT Investigator** is an advanced cybersecurity web application designed to simulate real-world investigation workflows across OSINT, SOC, and Purple Team operations.

The platform provides a **unified investigation environment** where analysts can:

- explore attack surfaces
- pivot across entities
- correlate intelligence
- simulate alerts
- triage threats
- generate investigation reports

This project focuses on **realistic analyst experience**, **interactive graph intelligence**, and **modern cyber UI/UX**.

---

## 🧩 Core Features

### 🔍 Attack Surface Scanner

- Domain-based reconnaissance simulation
- Asset discovery (IP, services, infra)
- Risk scoring & findings
- Direct pivot into Graph View

---

### 🌐 Live Host Intelligence (V2)

- Tactical host-level analysis (IP-based)
- Simulated scan pipeline (realistic UX)
- Service fingerprinting (ports, versions)
- Analyst findings with severity
- Risk scoring engine
- Auto-generated analyst summary

✅ Actions:

- Open host in Graph
- Create Investigation Case

---

### 🧠 Graph Intelligence Engine

- Interactive entity relationship graph
- Node expansion & pivoting
- Investigation trail tracking
- Case-scoped graph mode
- Attack Surface & Host graph injection

---

### 🤖 AI Analyst Panel

- Simulated AI insights
- Investigation summaries
- Context-aware analysis
- Risk interpretation

---

### 🔗 Correlation Engine

- Automated pattern detection across entities
- Correlation findings generation
- Confidence scoring
- Case contextual analysis

---

### 🚨 Alert Simulation Engine

- Generate realistic alerts from correlations
- Severity classification (Low / Medium / High)
- Analyst triage system (True Positive / False Positive / Suspicious)
- Push alerts directly into case activity

---

### 📊 Threat Scoring System

- Global threat score based on:
  - nodes
  - correlations
  - alerts
  - findings

- Visual scoring card in Graph View

---

### 📁 Investigation Case Management

- Create & manage investigation cases
- Add entities, notes, comments
- Activity timeline tracking
- Case priority & status management

---

### 📄 PDF Report Generation (V2 Premium)

- Server-side PDF generation (Node.js)
- Includes:
  - Threat score
  - Correlations
  - Alerts + triage
  - Investigation trail
  - Graph snapshot

- Analyst-ready reporting format

---

### 📊 Dashboard V2 (Executive View)

- Global investigation metrics
- Threat score distribution
- Alert severity breakdown
- Correlation insights
- Case status & priority charts
- Recent activity tracking

---

## 🧱 Tech Stack

### Frontend

- React (Vite)
- TailwindCSS
- Recharts (data visualization)
- Lucide Icons

### Backend

- Node.js
- Express
- Puppeteer (PDF generation)

### Data Layer

- Mock API (simulated intelligence)
- LocalStorage (case persistence)

---

## 🎯 Design Philosophy

- **Realistic simulation over static UI**
- **Analyst-first workflows**
- **Dark cyber UI (black / cyan / red)**
- **Modular architecture**
- **No external API dependency required**

---

## 📁 Project Structure (Simplified)

```
src/
├── components/
│   ├── graph/
│   ├── correlation/
│   ├── investigations/
│   ├── dashboard/
│   └── osint/
├── pages/
├── utils/
├── services/
├── lib/
└── data/
```

---

## ⚙️ Getting Started

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

---

## 🧪 Demo Capabilities

- Full investigation lifecycle simulation
- Graph-based pivoting
- Alert triage workflows
- Report generation
- Executive dashboard insights

---

## 🗺️ Roadmap V3 (Next Evolution)

### 🔥 Intelligence Layer Upgrade

- Real OSINT integrations (Shodan, VirusTotal, Whois)
- External API connectors
- Data normalization engine

---

### 🧠 AI / Automation

- Real LLM integration (OpenAI / local models)
- Auto-case summarization
- Smart correlation suggestions
- Investigation assistant (copilot mode)

---

### 🧬 Graph Intelligence V3

- Automatic clustering
- Path analysis (attack paths)
- Entity scoring propagation
- Temporal graph evolution

---

### ⚡ SOAR Capabilities

- Playbooks (auto-response simulation)
- Alert automation pipelines
- Investigation workflows orchestration

---

### 👥 Collaboration

- Multi-user system
- Role-based access
- Shared investigations
- Comments & mentions

---

### ☁️ Infrastructure

- Backend deployment (API hosted)
- Database (PostgreSQL / MongoDB)
- Authentication system
- Persistent storage (no localStorage)

---

### 📊 Advanced Dashboard

- Real-time metrics
- Investigation timelines
- Analyst performance tracking
- Threat heatmaps

---

## 🏁 Final Notes

This project is designed as a **portfolio-grade cybersecurity platform**, showcasing:

- frontend engineering
- UX/UI design
- cyber domain knowledge
- system architecture thinking

---

## 👨‍💻 Author

Inkedi9 — Cybersecurity Enthusiast
Specialized in OSINT, SOC, and Threat Investigation

---
