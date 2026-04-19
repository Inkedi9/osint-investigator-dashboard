const express = require("express");
const router = express.Router();
const { generateCasePdfReport } = require("../controllers/reportController");

router.post("/case/:id/pdf", generateCasePdfReport);

module.exports = router;
