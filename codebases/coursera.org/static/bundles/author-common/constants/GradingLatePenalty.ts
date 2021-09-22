export type {
  LatePenaltyMinScoreThreshold,
  LatePenaltyScoreCap,
  LatePenaltyIncrement,
  GradingLatePenalty as LatePenalty,
  GradingLatePenaltyFixedGradingLatePenalty as FixedLatePenalty,
  GradingLatePenaltyIncrementalGradingLatePenalty as IncrementalLatePenalty,
  GradingLatePenaltyCompoundLatePenalty as CompoundLatePenalty,
} from 'bundles/naptimejs/resources/__generated__/OnDemandCourseMaterialItemsV1';

export const FIXED = 'fixedGradingLatePenalty';

export const INCREMENTAL = 'incrementalGradingLatePenalty';

export const COMPOUND = 'compoundLatePenalty';

export const MIN_PENALTY = 0;
export const MAX_PENALTY = 100;

export const LATE_PENALTY_TYPE = {
  FIXED,
  INCREMENTAL,
  COMPOUND,
} as const;

export const PENALTY_INCREMENT_MODE = {
  FRACTION: 'APPLY_PENALTY_FRACTION_ON_AWARDED_SCORE',
  POINTS: 'DECREASE_PENALTY_POINTS_ON_AWARDED_SCORE',
} as const;

export type PenaltyIncrementMode = typeof PENALTY_INCREMENT_MODE[keyof typeof PENALTY_INCREMENT_MODE];

export const PERIOD_TYPES = {
  ZERO: 'ZERO',
  MINUTE: 'MINUTE',
  HOUR: 'HOUR',
  DAY: 'DAY',
  WEEK: 'WEEK',
  MONTH: 'MONTH',
  INFINITY: 'INFINITY',
} as const;

export type PeriodType = typeof PERIOD_TYPES[keyof typeof PERIOD_TYPES];
