export function createPivotEntry({ action, entity, sourceEntity = null }) {
  return {
    id: crypto.randomUUID(),
    action,
    entity,
    sourceEntity,
    timestamp: new Date().toISOString(),
  };
}
