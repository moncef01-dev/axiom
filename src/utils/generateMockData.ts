// =====================================================================
// AXIOM Sports — Dynamic Mock Data Generator
// Generates realistic, slightly varied data on each call so the
// platform feels alive without being absurdly volatile.
// =====================================================================

/** Seeded random — deterministic within a session, varies per day */
function seededRandom(seed: number): number {
  const x = Math.sin(seed + Date.now() / 86400000) * 10000;
  return x - Math.floor(x);
}

/** Clamp a value between min and max */
const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

/** Jitter a base value by ±range */
const jitter = (base: number, range: number, seed = Math.random()) =>
  clamp(base + (seed * 2 - 1) * range, 0, 1000);

// ─── Weekly Performance Trends ───────────────────────────────────────

export interface WeeklyTrendPoint {
  day: string;
  speed: number;
  acceleration: number;
  agility: number;
  endurance: number;
  power: number;
  load: number;
}

export function generateWeeklyTrends(): WeeklyTrendPoint[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const bases = { speed: 32.2, acceleration: 4.4, agility: 83, endurance: 78, power: 435, load: 640 };

  return days.map((day, i) => {
    const isSunday = i === 6;
    const isRestDay = i === 5;
    if (isRestDay) return { day, speed: 0, acceleration: 0, agility: 0, endurance: 0, power: 0, load: 0 };
    const s = seededRandom(i * 7 + Date.now() % 100);
    return {
      day,
      speed:        isSunday ? clamp(jitter(bases.speed - 0.5, 1.2, s), 28, 36) : clamp(jitter(bases.speed, 2, s), 28, 36),
      acceleration: clamp(jitter(bases.acceleration, 0.5, s), 3, 6),
      agility:      clamp(jitter(bases.agility, 5, s), 65, 98),
      endurance:    clamp(jitter(bases.endurance, 6, s), 60, 98),
      power:        clamp(jitter(bases.power, 40, s), 300, 580),
      load:         clamp(jitter(bases.load, 100, s), 200, 920),
    };
  });
}

// ─── Recovery Trends ─────────────────────────────────────────────────

export interface RecoveryTrendPoint {
  day: string;
  hrv: number;
  sleep: number;
  hydration: number;
  fatigue: number;
  recovery: number;
}

export function generateRecoveryTrends(): RecoveryTrendPoint[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // HRV follows a realistic dip mid-week pattern
  const hrvBase   = [64, 58, 61, 55, 59, 68, 62];
  const sleepBase = [8.1, 7.4, 7.9, 7.2, 7.6, 8.4, 7.8];
  return days.map((day, i) => {
    const s = seededRandom(i * 13 + Date.now() % 200);
    const hrv        = clamp(jitter(hrvBase[i], 5, s), 38, 85);
    const sleep      = parseFloat(clamp(jitter(sleepBase[i], 0.8, s), 5.5, 10).toFixed(1));
    const hydration  = clamp(jitter(82, 10, s), 55, 100);
    const fatigue    = clamp(jitter(100 - hrv, 8, s), 5, 65);
    const recovery   = clamp(Math.round((hrv / 85) * 100 * 0.6 + (sleep / 10) * 100 * 0.4), 30, 100);
    return { day, hrv, sleep, hydration, fatigue, recovery };
  });
}

// ─── Training Load Trends ────────────────────────────────────────────

export interface LoadTrendPoint {
  day: string;
  actual: number;
  target: number;
  acuteChronicRatio: number;
}

export function generateTrainingLoadTrends(): LoadTrendPoint[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const targets = [500, 680, 550, 820, 640, 0, 400];
  return days.map((day, i) => {
    const s = seededRandom(i * 11 + Date.now() % 150);
    const target = targets[i];
    const actual = target === 0 ? 0 : clamp(jitter(target, 80, s), 0, 1000);
    const acuteChronicRatio = target === 0 ? 0 : parseFloat((1.0 + s * 0.4).toFixed(2));
    return { day, actual, target, acuteChronicRatio };
  });
}

// ─── Match Statistics ────────────────────────────────────────────────

export interface MatchStats {
  totalDistance: number;
  highSpeedRuns: number;
  sprintDistance: number;
  maxSpeed: number;
  accelerations: number;
  decelerations: number;
  playerLoad: number;
  energyExpended: number;
}

export function generateMatchStats(): MatchStats {
  const s = seededRandom(Date.now() % 1000);
  return {
    totalDistance:  Math.round(clamp(jitter(11840, 800, s), 9000, 13500)),
    highSpeedRuns:  Math.round(clamp(jitter(892, 150, s), 400, 1400)),
    sprintDistance: Math.round(clamp(jitter(248, 60, s), 80, 420)),
    maxSpeed:       parseFloat(clamp(jitter(34.2, 2, s), 28, 39).toFixed(1)),
    accelerations:  Math.round(clamp(jitter(47, 12, s), 20, 80)),
    decelerations:  Math.round(clamp(jitter(41, 10, s), 15, 70)),
    playerLoad:     parseFloat(clamp(jitter(8.4, 1.5, s), 5, 12).toFixed(1)),
    energyExpended: Math.round(clamp(jitter(1320, 200, s), 800, 1800)),
  };
}

// ─── Athlete Progression ─────────────────────────────────────────────

export interface ProgressionPoint {
  week: string;
  performanceScore: number;
  readinessScore: number;
  recoveryScore: number;
  trainingLoad: number;
}

export function generateAthleteProgression(weeks = 8): ProgressionPoint[] {
  const result: ProgressionPoint[] = [];
  let perf = 78, read = 74, rec = 70, load = 2600;
  for (let i = 0; i < weeks; i++) {
    const s = seededRandom(i * 31 + Date.now() % 500);
    perf  = clamp(perf  + (s - 0.35) * 4,  60, 98);
    read  = clamp(read  + (s - 0.4)  * 3,  58, 98);
    rec   = clamp(rec   + (s - 0.45) * 3,  55, 98);
    load  = clamp(load  + (s - 0.35) * 400, 1800, 5200);
    result.push({
      week: `W${i + 1}`,
      performanceScore: Math.round(perf),
      readinessScore:   Math.round(read),
      recoveryScore:    Math.round(rec),
      trainingLoad:     Math.round(load),
    });
  }
  return result;
}

// ─── AI Insights ─────────────────────────────────────────────────────

type InsightCategory = 'Performance' | 'Recovery' | 'Fatigue' | 'Injury Risk' | 'Training Load' | 'Biomechanics';
type InsightSeverity = 'success' | 'warning' | 'info' | 'alert';

export interface AIInsight {
  id: string;
  category: InsightCategory;
  severity: InsightSeverity;
  text: string;
  timestamp: string;
}

const insightPool: Record<InsightCategory, { severity: InsightSeverity; text: string }[]> = {
  'Performance': [
    { severity: 'success', text: 'Sprint performance improved by 6.2% over the past 7 days.' },
    { severity: 'info',    text: 'High-speed running distance exceeded weekly target by 14%.' },
    { severity: 'success', text: 'Peak sprint velocity of 34.2 km/h achieved — personal record.' },
    { severity: 'info',    text: 'Acceleration profile trending upward — positive adaptation response.' },
    { severity: 'success', text: 'Ball-related performance metrics above 85th percentile this week.' },
  ],
  'Recovery': [
    { severity: 'warning', text: 'Recovery score below optimal threshold — reduced training load recommended.' },
    { severity: 'warning', text: 'HRV trending downward over 3 consecutive days — monitor closely.' },
    { severity: 'alert',   text: 'Sleep quality dropped to 6.2h average — below the 7.5h target.' },
    { severity: 'warning', text: 'Hydration score below optimal range — fluid intake protocol required.' },
    { severity: 'success', text: 'Post-match recovery showing positive trajectory — cleared for full session.' },
  ],
  'Fatigue': [
    { severity: 'alert',   text: 'Potential overtraining risk detected — fatigue index at 68%.' },
    { severity: 'warning', text: 'Elevated fatigue markers detected following high-intensity block.' },
    { severity: 'warning', text: 'Neuromuscular fatigue score elevated — plyometric load reduction advised.' },
    { severity: 'info',    text: 'Perceived exertion trending upward — cumulative load monitoring required.' },
    { severity: 'alert',   text: 'Central fatigue indicators detected — rest day insertion recommended.' },
  ],
  'Injury Risk': [
    { severity: 'alert',   text: 'Hamstring injury risk elevated — 18% above baseline.' },
    { severity: 'warning', text: 'Asymmetry index detected in single-leg jump assessment.' },
    { severity: 'info',    text: 'Ankle stability score declined — proprioceptive training recommended.' },
    { severity: 'warning', text: 'Groin loading pattern flagged — sports medicine review suggested.' },
    { severity: 'info',    text: 'Knee valgus tendency detected — corrective strength programme initiated.' },
  ],
  'Training Load': [
    { severity: 'info',    text: 'Training load increased by 18% — within progressive overload parameters.' },
    { severity: 'alert',   text: 'Acute-to-chronic workload ratio at 1.42 — elevated zone, monitor closely.' },
    { severity: 'warning', text: 'Weekly volume 12% above planned prescription — adjust next microcycle.' },
    { severity: 'success', text: 'High-intensity interval density optimal — positive performance adaptation expected.' },
    { severity: 'info',    text: 'Session RPE averaging 7.8/10 — intensity management required.' },
  ],
  'Biomechanics': [
    { severity: 'success', text: 'Movement symmetry score improved to 88% — rehabilitation progressing well.' },
    { severity: 'success', text: 'Running mechanics efficiency index at 91 — elite benchmark exceeded.' },
    { severity: 'warning', text: 'Jump technique asymmetry detected — left-right differential at 9%.' },
    { severity: 'info',    text: 'Hip mobility restriction flagged — soft tissue work recommended.' },
    { severity: 'success', text: 'Ground contact time optimised — stride efficiency at season best.' },
  ],
};

const categoryHours: Record<InsightCategory, number[]> = {
  'Performance':   [9, 14, 16],
  'Recovery':      [7, 8, 20],
  'Fatigue':       [10, 15, 19],
  'Injury Risk':   [8, 13, 17],
  'Training Load': [9, 12, 16],
  'Biomechanics':  [11, 15, 18],
};

export function generateAIInsights(count = 8): AIInsight[] {
  const categories = Object.keys(insightPool) as InsightCategory[];
  const selected: AIInsight[] = [];
  const usedKeys = new Set<string>();

  let attempts = 0;
  while (selected.length < count && attempts < 100) {
    attempts++;
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const pool = insightPool[cat];
    const item = pool[Math.floor(Math.random() * pool.length)];
    const key = `${cat}-${item.text.substring(0, 20)}`;
    if (usedKeys.has(key)) continue;
    usedKeys.add(key);
    const hours = categoryHours[cat];
    const hour = hours[Math.floor(Math.random() * hours.length)];
    const now = new Date();
    now.setHours(hour, Math.floor(Math.random() * 60), 0);
    selected.push({
      id: `insight-${selected.length + 1}`,
      category: cat,
      severity: item.severity,
      text: item.text,
      timestamp: now.toISOString(),
    });
  }

  return selected.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
