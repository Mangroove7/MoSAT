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

/**
 * Validates user answer against correct answer, supporting exact MCQ matches
 * and numerical/fractional equivalence for Student-Produced Response (SPR) grid-in questions.
 */
export function isAnswerCorrect(userAns: string | null | undefined, correctAns: string | null | undefined): boolean {
  if (!userAns || !correctAns) return false;
  const u = userAns.trim().toLowerCase();
  const c = correctAns.trim().toLowerCase();
  if (u === c) return true;

  // Numerical equivalence for SPR (e.g. 7/25 vs 0.28, .75 vs 0.75, 3/4 vs 0.75)
  const parseVal = (str: string): number | null => {
    if (str.includes('/')) {
      const parts = str.split('/');
      if (parts.length === 2) {
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (!isNaN(num) && !isNaN(den) && den !== 0) return num / den;
      }
    }
    const val = parseFloat(str);
    return isNaN(val) ? null : val;
  };

  const uVal = parseVal(u);
  const cVal = parseVal(c);
  if (uVal !== null && cVal !== null) {
    return Math.abs(uVal - cVal) < 1e-6;
  }

  return false;
}
