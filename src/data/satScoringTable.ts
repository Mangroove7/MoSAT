/**
 * Digital SAT Adaptive Scoring Tables & Conversion Matrix
 * Multi-Stage Adaptive Testing (MST) curve simulation
 */

export interface ScoreMatrixEntry {
  rawCorrect: number; // total correct in Module 1 + Module 2
  scaledScore: number;
}

export const RW_HARD_CURVE: Record<number, number> = {
  54: 800, 53: 790, 52: 780, 51: 770, 50: 760,
  49: 750, 48: 740, 47: 730, 46: 720, 45: 710,
  44: 700, 43: 690, 42: 680, 41: 670, 40: 660,
  39: 650, 38: 640, 37: 630, 36: 620, 35: 610,
  34: 600, 33: 590, 32: 580, 31: 570, 30: 560,
  29: 550, 28: 540, 27: 530, 26: 520, 25: 510,
  24: 500, 23: 490, 22: 480, 21: 470, 20: 460
};

export const RW_EASY_CURVE: Record<number, number> = {
  38: 630, 37: 620, 36: 610, 35: 600, 34: 590,
  33: 580, 32: 570, 31: 560, 30: 550, 29: 540,
  28: 530, 27: 520, 26: 510, 25: 500, 24: 490,
  23: 480, 22: 470, 21: 460, 20: 450, 19: 440,
  18: 430, 17: 420, 16: 410, 15: 400, 14: 390,
  13: 380, 12: 370, 11: 360, 10: 350, 9: 340,
  8: 330, 7: 320, 6: 310, 5: 300, 4: 280, 3: 260, 2: 240, 1: 220, 0: 200
};

export const MATH_HARD_CURVE: Record<number, number> = {
  44: 800, 43: 790, 42: 780, 41: 770, 40: 760,
  39: 750, 38: 740, 37: 730, 36: 720, 35: 710,
  34: 700, 33: 690, 32: 680, 31: 670, 30: 660,
  29: 650, 28: 640, 27: 630, 26: 620, 25: 610,
  24: 600, 23: 590, 22: 580, 21: 570, 20: 560,
  19: 550, 18: 540, 17: 530, 16: 520, 15: 510,
  14: 500, 13: 490, 12: 480
};

export const MATH_EASY_CURVE: Record<number, number> = {
  32: 610, 31: 600, 30: 590, 29: 580, 28: 570,
  27: 560, 26: 550, 25: 540, 24: 530, 23: 520,
  22: 510, 21: 500, 20: 490, 19: 480, 18: 470,
  17: 460, 16: 450, 15: 440, 14: 430, 13: 420,
  12: 410, 11: 400, 10: 390, 9: 380, 8: 370,
  7: 360, 6: 350, 5: 340, 4: 320, 3: 300, 2: 270, 1: 240, 0: 200
};

export function calculatePercentile(totalScore: number): number {
  if (totalScore >= 1580) return 99.9;
  if (totalScore >= 1550) return 99;
  if (totalScore >= 1500) return 98;
  if (totalScore >= 1450) return 96;
  if (totalScore >= 1400) return 93;
  if (totalScore >= 1350) return 89;
  if (totalScore >= 1300) return 84;
  if (totalScore >= 1200) return 73;
  if (totalScore >= 1100) return 59;
  if (totalScore >= 1000) return 43;
  return Math.max(1, Math.round(totalScore / 16));
}
