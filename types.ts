
export interface Country {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
  capital?: string[];
  currencies?: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  cca3: string;
  region: string;
  population: number;
}

export enum GameView {
  HOME = 'home',
  QUIZ = 'quiz',
  LEARN = 'learn',
  RESULT = 'result'
}

export enum QuestionType {
  NAME = 'name',
  CAPITAL = 'capital',
  CURRENCY = 'currency'
}

export interface QuizQuestion {
  country: Country;
  options: string[];
  correctAnswer: string;
  type: QuestionType;
}

export interface GameStats {
  score: number;
  total: number;
  history: {
    country: string;
    correct: boolean;
  }[];
}
