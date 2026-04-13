const STORAGE_KEY = "osint-investigator-cases";

export function loadCases(defaultCases = []) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return defaultCases;

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : defaultCases;
  } catch (error) {
    console.error("Failed to load cases from localStorage:", error);
    return defaultCases;
  }
}

export function saveCases(cases) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  } catch (error) {
    console.error("Failed to save cases to localStorage:", error);
  }
}

export function clearCasesStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear cases storage:", error);
  }
}
