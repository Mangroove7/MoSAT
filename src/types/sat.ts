export type SATSection = 'Reading and Writing' | 'Math';

export type SATDomainRW = 
  | 'Information and Ideas' 
  | 'Craft and Structure' 
  | 'Expression of Ideas' 
  | 'Standard English Conventions';

export type SATDomainMath = 
  | 'Algebra' 
  | 'Advanced Math' 
  | 'Problem-Solving and Data Analysis' 
  | 'Geometry and Trigonometry';

export type SATDomain = SATDomainRW | SATDomainMath;

export type SATDifficulty = 'Easy' | 'Medium' | 'Hard';

export type QuestionType = 'mcq' | 'spr'; // Multiple Choice or Student Produced Response (grid-in)

export interface AnswerOption {
  id: string;
  letter: 'A' | 'B' | 'C' | 'D';
  content: string;
}

export interface SATQuestion {
  id: string; // e.g. "ac472881"
  externalId?: string;
  section: SATSection;
  domain: SATDomain;
  domainCode: string;
  skill: string;
  skillCode?: string;
  difficulty: SATDifficulty;
  scoreBand?: number; // 1-7
  type: QuestionType;
  stimulus?: string | null; // Passage / context
  stem: string; // Question text
  options?: AnswerOption[] | null;
  correctAnswer: string; // e.g. "A" or "14.5"
  correctAnswerKey?: string; // id matching option
  rationale: string; // Official explanation
  trapAnalysis?: string | null; // Why the distractor was tempting but wrong
  desmosTip?: string | null; // Calculator trick
}

export interface VocabularyItem {
  id: string;
  word: string;
  pronunciation?: string;
  partOfSpeech: string;
  simplifiedMeaning: string; // Simplified Indonesian meaning
  englishMeaning: string;
  synonyms: string[];
  antonyms: string[];
  sampleSentence: string;
  satQuestionSentence: string; // Contextual sentence from official SAT question
  satQuestionSource?: string; // Source context
  mastery: 'new' | 'learning' | 'mastered';
  lastReviewed?: string;
}

export type ErrorType = 'concept' | 'careless' | 'timing' | 'trap';

export interface UserMistakeRecord {
  id: string;
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  date: string;
  errorType: ErrorType;
  userNotes?: string;
  resolved: boolean;
}

export interface DrillSessionResult {
  id: string;
  date: string;
  domain?: SATDomain;
  skill?: string;
  difficulty?: SATDifficulty;
  totalQuestions: number;
  correctCount: number;
  totalTimeSeconds: number;
  questionIds: string[];
  answers: Record<string, { answer: string; isCorrect: boolean; timeSeconds: number }>;
}

export interface MockTestAttempt {
  id: string;
  date: string;
  totalScore: number; // 400 - 1600
  rwScore: number;    // 200 - 800
  mathScore: number;  // 200 - 800
  percentile: number;
  rwModule1Correct: number;
  rwModule1Total: number;
  rwModule2Difficulty: 'Easy' | 'Hard';
  rwModule2Correct: number;
  rwModule2Total: number;
  mathModule1Correct: number;
  mathModule1Total: number;
  mathModule2Difficulty: 'Easy' | 'Hard';
  mathModule2Correct: number;
  mathModule2Total: number;
  totalTimeSeconds: number;
  answers: Record<string, { answer: string; isCorrect: boolean; timeSeconds: number }>;
}

export interface UserProfile {
  name: string;
  targetScore: number;
  streak: number;
  lastActiveDate: string;
  dailyGoal: number; // questions per day
  todayAnsweredCount: number;
  totalAnswered: number;
  totalCorrect: number;
  favoriteQuestionIds: string[];
  activityHistory: Record<string, number>; // "YYYY-MM-DD": questionCount
}
