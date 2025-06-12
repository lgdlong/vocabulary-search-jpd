// Script to convert kanji to hiragana using wanakana
const fs = require('fs');
const path = require('path');
const wanakana = require('wanakana');

// Read the existing vocabulary file
const vocabPath = path.join(__dirname, 'src', 'data', 'vocabularies.json');
const vocabularies = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));

// Function to convert kanji to hiragana
const processVocabularies = (vocabularies) => {
  return vocabularies.map(vocab => {
    // Check if hiragana field is empty and kanji exists
    if ((!vocab.hiragana || vocab.hiragana === "") && vocab.kanji) {
      try {
        // Convert kanji to hiragana
        vocab.hiragana = wanakana.toHiragana(vocab.kanji);
      } catch (error) {
        console.error(`Error processing: ${vocab.kanji}`, error);
        vocab.hiragana = ""; // Set empty if conversion fails
      }
    }
    return vocab;
  });
};

// Process the vocabularies
const processedVocabularies = processVocabularies(vocabularies);

// Write the updated vocabulary back to the file
fs.writeFileSync(vocabPath, JSON.stringify(processedVocabularies, null, 2), 'utf8');

console.log('Conversion completed successfully! Hiragana fields have been added.');
