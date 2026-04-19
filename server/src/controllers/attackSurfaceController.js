const {
  performAttackSurfaceScan,
} = require("../services/attackSurfaceService");

async function scanAttackSurface(req, res) {
  try {
    const { domain } = req.params;

    const data = await performAttackSurfaceScan(domain);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Attack surface error:", error.message);

    res.status(500).json({
      success: false,
      error: "Attack surface scan failed",
    });
  }
}

module.exports = {
  scanAttackSurface,
};
