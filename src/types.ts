type License = {
  name: string;
  url: string;
};

type Phonetic = {
  text: string;
  audio?: string;
  license?: License;
  sourceUrl?: string;
};

type Definition = {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
};

type Meaning = {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
};

export type WordEntry = {
  word: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license?: License;
  sourceUrls: string[];
};
