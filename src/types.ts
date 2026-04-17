export interface HSKItem {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  example: string;
  examplePinyin: string;
}

export interface CardState {
  id: string;
  nextReview: number; // timestamp
  interval: number; // in days
  stability: number; // for simpler spaced repetition
}

export type ViewMode = 'flashcard' | 'quiz' | 'stats';
