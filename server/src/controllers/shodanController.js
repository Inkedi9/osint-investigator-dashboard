const {
  fetchShodanHostData,
  getMockShodanHostData,
} = require("../services/shodanService");

async function getHostIntel(req, res) {
  try {
    const { ip } = req.params;
    const data = await fetchShodanHostData(ip);

    res.json({
      success: true,
      mode: data.mode,
      source: "shodan",
      data,
    });
  } catch (error) {
    console.error("Shodan controller error:", error.message);

    res.status(500).json({
      success: false,
      error: "Failed to fetch host intelligence.",
      details: error.message,
    });
  }
}

async function getDemoHostIntel(req, res) {
  try {
    const { ip } = req.params;
    const data = getMockShodanHostData(ip);

    res.json({
      success: true,
      mode: "demo",
      source: "mock-shodan",
      data,
    });
  } catch (error) {
    console.error("Demo host intel error:", error.message);

    res.status(500).json({
      success: false,
      error: "Failed to fetch demo host intelligence.",
      details: error.message,
    });
  }
}

module.exports = {
  getHostIntel,
  getDemoHostIntel,
};
