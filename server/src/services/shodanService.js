const axios = require("axios");

function getMockShodanHostData(ip) {
  return {
    mode: "demo",
    ip,
    organization: "Demo Hosting Provider",
    asn: "AS14061",
    country: "Netherlands",
    operatingSystem: "Ubuntu Linux",
    ports: [22, 80, 443, 8080],
    hostnames: [`host-${ip.replace(/\./g, "-")}.demo.local`],
    tags: ["demo", "exposed-services"],
    vulns: ["CVE-2023-9999", "CVE-2024-12345"],
    services: [
      {
        port: 22,
        product: "OpenSSH",
        version: "8.9",
      },
      {
        port: 80,
        product: "Nginx",
        version: "1.22.0",
      },
      {
        port: 443,
        product: "Nginx",
        version: "1.22.0",
      },
      {
        port: 8080,
        product: "Jetty",
        version: "10.0",
      },
    ],
    riskScore: 72,
    findings: [
      "Multiple exposed services detected.",
      "Potential outdated service versions identified.",
      "Infrastructure appears externally reachable.",
    ],
  };
}

async function fetchShodanHostData(ip) {
  const apiKey = process.env.SHODAN_API_KEY;

  if (!apiKey) {
    return getMockShodanHostData(ip);
  }

  try {
    const response = await axios.get(
      `https://api.shodan.io/shodan/host/${ip}`,
      {
        params: {
          key: apiKey,
        },
        timeout: 10000,
      },
    );

    const host = response.data;

    return {
      mode: "live",
      ip: host.ip_str || ip,
      organization: host.org || "Unknown",
      asn: host.asn || "Unknown",
      country: host.country_name || "Unknown",
      operatingSystem: host.os || "Unknown",
      ports: host.ports || [],
      hostnames: host.hostnames || [],
      tags: host.tags || [],
      vulns: host.vulns ? Object.keys(host.vulns) : [],
      services: (host.data || []).map((service) => ({
        port: service.port,
        product: service.product || "Unknown",
        version: service.version || "Unknown",
      })),
      riskScore: calculateRiskScore(host),
      findings: buildFindings(host),
    };
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Shodan API error: ${error.response.status} ${error.response.statusText}`,
      );
    }

    throw new Error(`Network or request error: ${error.message}`);
  }
}

function calculateRiskScore(host) {
  let score = 0;

  const ports = host.ports || [];
  const vulns = host.vulns ? Object.keys(host.vulns) : [];
  const tags = host.tags || [];

  if (ports.length >= 3) score += 20;
  if (ports.includes(22)) score += 10;
  if (ports.includes(3389)) score += 20;
  if (ports.includes(8080)) score += 10;
  if (vulns.length > 0) score += 25;
  if (tags.length > 0) score += 5;

  return Math.min(score, 100);
}

function buildFindings(host) {
  const findings = [];
  const ports = host.ports || [];
  const vulns = host.vulns ? Object.keys(host.vulns) : [];

  if (ports.length > 0) {
    findings.push(`Exposed ports detected: ${ports.join(", ")}`);
  }

  if (vulns.length > 0) {
    findings.push(`Potential vulnerabilities detected: ${vulns.join(", ")}`);
  }

  if (host.org) {
    findings.push(`Infrastructure associated with organization: ${host.org}`);
  }

  if (findings.length === 0) {
    findings.push("No significant findings detected.");
  }

  return findings;
}

module.exports = {
  fetchShodanHostData,
  getMockShodanHostData,
};
