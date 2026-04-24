export function getIncidentParams() {
  const params = new URLSearchParams(window.location.search);

  return {
    incidentId: params.get("incident"),
    user: params.get("user"),
    ip: params.get("ip"),
    domain: params.get("domain"),
    ioc: params.get("ioc"),
    technique: params.get("technique"),
    returnTo: params.get("returnTo"),
  };
}
