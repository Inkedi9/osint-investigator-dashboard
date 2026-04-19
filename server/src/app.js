const express = require("express");
const cors = require("cors");
const shodanRoutes = require("./routes/shodanRoutes");
const attackSurfaceRoutes = require("./routes/attackSurfaceRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.get("/", (req, res) => {
  res.send("OSINT Investigator Backend is running 🚀");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "osint-investigator-backend",
  });
});

app.use("/api/shodan", shodanRoutes);
app.use("/api/attack-surface", attackSurfaceRoutes);
app.use("/api/reports", reportRoutes);

module.exports = app;
