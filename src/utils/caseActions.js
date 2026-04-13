import { loadCases, saveCases } from "./caseStorage";
import { mockCases } from "../data/mockCases";

export function addNoteToCase(caseId, noteContent) {
  const allCases = loadCases(mockCases);

  const newNote = {
    id: `note_${Date.now()}`,
    content: noteContent.trim(),
    createdAt: new Date().toLocaleString(),
  };

  const updatedCases = allCases.map((item) => {
    if (item.id === caseId) {
      return {
        ...item,
        notes: [...(item.notes || []), newNote],
      };
    }

    return item;
  });

  saveCases(updatedCases);

  return {
    updatedCases,
    newNote,
  };
}
