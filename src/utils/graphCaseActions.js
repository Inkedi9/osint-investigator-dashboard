import { loadCases, saveCases } from "./caseStorage";
import { mockCases } from "../data/mockCases";

export function addGraphEntityToFirstCase(entityId) {
  const allCases = loadCases(mockCases);

  if (!allCases.length) return null;

  const updatedCases = allCases.map((item, index) => {
    if (index === 0) {
      const alreadyExists = (item.entityIds || []).includes(entityId);

      return {
        ...item,
        entityIds: alreadyExists
          ? item.entityIds
          : [...(item.entityIds || []), entityId],
        activity: [
          ...(item.activity || []),
          {
            id: `activity_${Date.now()}`,
            action: `Graph entity added (${entityId})`,
            author: "You",
            date: new Date().toLocaleString(),
          },
        ],
      };
    }

    return item;
  });

  saveCases(updatedCases);
  return updatedCases[0];
}
