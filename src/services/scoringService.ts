import { 
  RW_HARD_CURVE, 
  RW_EASY_CURVE, 
  MATH_HARD_CURVE, 
  MATH_EASY_CURVE, 
  calculatePercentile 
} from '../data/satScoringTable';
import { SATQuestion } from '../types/sat';

export interface ModulePerformance {
  correct: number;
  total: number;
  path: 'Easy' | 'Hard';
}

export interface SectionScoreResult {
  score: number; // 200 - 800
  module1Correct: number;
  module1Total: number;
  module2Difficulty: 'Easy' | 'Hard';
  module2Correct: number;
  module2Total: number;
  totalCorrect: number;
  totalQuestions: number;
}

export interface FullTestScoreResult {
  totalScore: number; // 400 - 1600
  rw: SectionScoreResult;
  math: SectionScoreResult;
  percentile: number;
}

export function determineNextModuleDifficulty(
  section: 'Reading and Writing' | 'Math',
  module1Correct: number,
  module1Total: number
): 'Easy' | 'Hard' {
  const percentage = module1Correct / module1Total;
  // Authentic Digital SAT MST threshold: ~60-65%
  if (section === 'Reading and Writing') {
    return module1Correct >= 17 ? 'Hard' : 'Easy';
  } else {
    return module1Correct >= 13 ? 'Hard' : 'Easy';
  }
}

export function calculateSectionScore(
  section: 'Reading and Writing' | 'Math',
  module1Correct: number,
  module1Total: number,
  module2Correct: number,
  module2Total: number,
  module2Difficulty: 'Easy' | 'Hard'
): SectionScoreResult {
  const totalCorrect = module1Correct + module2Correct;
  const totalQuestions = module1Total + module2Total;
  let score = 200;

  if (section === 'Reading and Writing') {
    if (module2Difficulty === 'Hard') {
      score = RW_HARD_CURVE[totalCorrect] ?? Math.min(800, Math.max(480, 480 + (totalCorrect - 20) * 10));
    } else {
      score = RW_EASY_CURVE[totalCorrect] ?? Math.min(630, Math.max(200, 200 + totalCorrect * 11));
    }
  } else {
    // Math
    if (module2Difficulty === 'Hard') {
      score = MATH_HARD_CURVE[totalCorrect] ?? Math.min(800, Math.max(480, 480 + (totalCorrect - 12) * 10));
    } else {
      score = MATH_EASY_CURVE[totalCorrect] ?? Math.min(610, Math.max(200, 200 + totalCorrect * 12));
    }
  }

  // Ensure score ends in 0 and is between 200 and 800
  score = Math.round(score / 10) * 10;
  score = Math.max(200, Math.min(800, score));

  return {
    score,
    module1Correct,
    module1Total,
    module2Difficulty,
    module2Correct,
    module2Total,
    totalCorrect,
    totalQuestions
  };
}

export function calculateFullTestScore(
  rwResult: SectionScoreResult,
  mathResult: SectionScoreResult
): FullTestScoreResult {
  const totalScore = rwResult.score + mathResult.score;
  const percentile = calculatePercentile(totalScore);

  return {
    totalScore,
    rw: rwResult,
    math: mathResult,
    percentile
  };
}
