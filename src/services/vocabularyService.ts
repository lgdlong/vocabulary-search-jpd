import originalVocabularies from "../data/vocabularies.json";
import type { JapaneseVocabulary } from "../types";

// Get vocabularies from localStorage or use the default from JSON file
const getStoredVocabularies = (): JapaneseVocabulary[] => {
  const storedData = localStorage.getItem("vocabularies");
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (e) {
      console.error("Failed to parse stored vocabularies:", e);
    }
  }
  return [...originalVocabularies];
};

// Current in-memory vocabularies
let vocabs: JapaneseVocabulary[] = getStoredVocabularies();

// Get all vocabularies
export const getVocabularies = (): JapaneseVocabulary[] => {
  return vocabs;
};

// Add vocabulary
export const addVocabulary = (vocabulary: JapaneseVocabulary): void => {
  vocabs = [...vocabs, vocabulary];
  localStorage.setItem("vocabularies", JSON.stringify(vocabs));
};

// Update vocabulary
export const updateVocabulary = (
  index: number,
  vocabulary: JapaneseVocabulary
): void => {
  const newVocabs = [...vocabs];
  newVocabs[index] = vocabulary;
  vocabs = newVocabs;
  localStorage.setItem("vocabularies", JSON.stringify(vocabs));
};

// Remove vocabulary
export const removeVocabulary = (index: number): void => {
  vocabs = vocabs.filter((_, i) => i !== index);
  localStorage.setItem("vocabularies", JSON.stringify(vocabs));
};

// Export vocabularies as JSON file
export const exportVocabulariesAsJSON = (): void => {
  const dataStr = JSON.stringify(vocabs, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportFileDefaultName = "vocabularies.json";

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
};

// Fix data structure - don't reset data
export const fixDataStructure = (): void => {
  // Check if any vocabulary is missing properties
  const fixedVocabs = vocabs.map((vocab) => {
    return {
      kanji: vocab.kanji || "",
      hiragana: vocab.hiragana || "",
      romaji: vocab.romaji || "",
      vietnamese: vocab.vietnamese || "",
    };
  });

  vocabs = fixedVocabs;
  localStorage.setItem("vocabularies", JSON.stringify(vocabs));
};
