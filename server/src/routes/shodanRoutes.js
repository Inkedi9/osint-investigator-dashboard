const express = require("express");
const router = express.Router();
const {
  getHostIntel,
  getDemoHostIntel,
} = require("../controllers/shodanController");

router.get("/host/:ip", getHostIntel);
router.get("/demo/host/:ip", getDemoHostIntel);

module.exports = router;
