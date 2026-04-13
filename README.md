# 🕵️‍♂️ OSINT Investigator Dashboard

A modern OSINT investigation platform designed to simulate real-world cyber threat intelligence workflows.

> ⚠️ This project is a demo / portfolio application and is continuously evolving with new features and improvements.

---

## 🚀 Overview

The **OSINT Investigator Dashboard** is a full-featured front-end application that allows analysts to:

- Investigate domains, IPs, emails, and usernames
- Correlate entities through a visual graph
- Manage investigation cases
- Add analyst notes
- Track risk scoring
- Export investigation reports

---

## 🧠 Features

### 🔍 Search Engine

- Global search from topbar
- Query persistence via URL (`/search?q=...`)
- Entity filtering (domain, IP, email, username)

### 🧾 Entity Analysis

- Risk scoring visualization
- Metadata enrichment
- Timeline of events
- Related entities navigation

### 🧩 Graph Investigation

- Interactive relationship graph (React Flow)
- Node-based entity exploration
- Link analysis simulation

### 📁 Case Management

- Create investigation cases
- Add entities to cases
- Modify status (Open / In Review / Closed)
- Modify priority (Low / Medium / High)
- Persistent storage (localStorage)

### 📝 Analyst Notes

- Add notes directly inside cases
- Persistent across sessions
- Included in report exports

### 📊 Dashboard

- Dynamic metrics (cases, entities, risk)
- Status & priority charts
- Recent activity feed

### 📄 Report Export

- Generate investigation reports
- Clean HTML export
- Printable as PDF

---

## 🛠️ Tech Stack

- **React (Vite)**
- **Tailwind CSS**
- **React Router**
- **React Flow** (graph visualization)
- **Recharts** (dashboard charts)
- **LocalStorage** (data persistence)

---

## 📸 Screenshots (optional)

_Add screenshots here later (Dashboard, Graph, Case view, etc.)_

---

## ⚙️ Installation

```bash
git clone https://github.com/Inkedi9/osint-investigator-dashboard.git
cd osint-investigator-dashboard
npm install
npm run dev
```

---

## 🌐 Deployment

This project can be deployed easily using **Vercel**.

---

## 📌 Roadmap

- [ ] Real API integration (VirusTotal, Shodan, etc.)
- [ ] Authentication system
- [ ] Advanced graph interactions
- [ ] Case collaboration
- [ ] Export PDF generation (server-side)
- [ ] UI/UX improvements

---

## ⚠️ Disclaimer

This project is intended for educational and demonstration purposes only.

No real OSINT queries or external APIs are used.

---

## 👨‍💻 Author

Inkedi9
Cybersecurity Enthusiast

---

## ⭐ If you like this project

Feel free to star the repo and follow for updates.
