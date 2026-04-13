import { loadCases, saveCases } from "./caseStorage";
import { mockCases } from "../data/mockCases";

export function updateCaseFields(caseId, updates) {
  const allCases = loadCases(mockCases);

  const updatedCases = allCases.map((item) => {
    if (item.id === caseId) {
      return {
        ...item,
        ...updates,
      };
    }

    return item;
  });

  saveCases(updatedCases);
  return updatedCases;
}
