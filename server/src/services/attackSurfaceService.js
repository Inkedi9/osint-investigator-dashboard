function performAttackSurfaceScan(domain) {
  const subdomains = [
    `app.${domain}`,
    `api.${domain}`,
    `dev.${domain}`,
    `mail.${domain}`,
  ];

  const assets = subdomains.map((sub, index) => ({
    domain: sub,
    ip: `192.168.1.${index + 10}`,
    ports: [80, 443, index % 2 === 0 ? 22 : 8080],
  }));

  const findings = [
    "Multiple subdomains exposed",
    "Development environment potentially accessible",
    "Services exposed on common ports",
  ];

  const score = calculateAttackSurfaceScore(assets);

  return {
    domain,
    subdomains,
    assets,
    findings,
    score,
  };
}

function calculateAttackSurfaceScore(assets) {
  let score = 0;

  assets.forEach((asset) => {
    if (asset.ports.includes(22)) score += 10;
    if (asset.ports.includes(8080)) score += 10;
    if (asset.ports.length > 2) score += 10;
  });

  return Math.min(score, 100);
}

module.exports = {
  performAttackSurfaceScan,
};
