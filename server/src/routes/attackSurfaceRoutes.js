const express = require("express");
const router = express.Router();
const { scanAttackSurface } = require("../controllers/attackSurfaceController");

router.get("/scan/:domain", scanAttackSurface);

module.exports = router;
