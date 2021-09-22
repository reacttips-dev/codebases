import { LearnerGoal } from 'bundles/goal-setting/types/LearnerGoal';

import {
  GoalNDaysAWeek,
  StreakLevels,
  FirstAssignmentLevels,
  FinishNVideosLevels,
  GoalProgressLevels,
} from 'bundles/goal-setting/types/GoalProgressLevels';

import {
  GOAL_TYPE_COMPLETE_N_ASSIGNMENTS,
  GOAL_TYPE_N_DAY_STREAK,
  GOAL_TYPE_N_DAYS_A_WEEK,
  GOAL_TYPE_COMPLETE_N_VIDEOS,
} from './constants';

type ComputationConfig = {
  learnerGoal: LearnerGoal;
  isPullBased?: boolean;
};

export const computeFinishNVideosProgressLevel = ({
  learnerGoal,
  isPullBased,
}: ComputationConfig): FinishNVideosLevels => {
  const {
    goalType: {
      definition: { n },
    },
  } = learnerGoal;

  const progress = learnerGoal.progress || {};
  const history = progress.history || [];
  const progressPercentage = (progress || {}).percentage;

  if (history.length >= n) {
    return 'goalComplete';
  }

  if (isPullBased) {
    if (progressPercentage <= 0.05) {
      return 'lowProgress';
    } else {
      return 'significantProgress';
    }
  }

  if (history.length === n - 1) {
    return 'oneVideoLeft';
  } else if (history.length >= n / 2) {
    return 'halfOfNVideos';
  } else if (history.length >= 2) {
    return 'afterTwoVideos';
  }

  return 'lowProgress';
};

export const computeFirstAssignmentProgressLevel = ({
  learnerGoal,
  isPullBased,
}: ComputationConfig): FirstAssignmentLevels => {
  const {
    goalType: {
      definition: { n },
    },
  } = learnerGoal;

  const progress = learnerGoal.progress || {};
  const history = progress.history || [];

  if (history.length >= n) {
    return 'goalComplete';
  }

  if (isPullBased) {
    return 'lowProgress';
  }

  if (history.length === 0) {
    return 'openAssignment';
  }

  return 'lowProgress';
};

export const computeStreakProgressLevel = ({ learnerGoal }: ComputationConfig): StreakLevels => {
  const {
    goalType: {
      definition: { n },
    },
  } = learnerGoal;

  const progress = learnerGoal.progress || {};
  const history = progress.history || [];

  if (history.length >= n) {
    return 'goalComplete';
  }

  if (history.length === 2) {
    return 'secondDay';
  } else if (history.length === 1) {
    return 'firstDay';
  }

  return 'streakBroken';
};

export const computeGoalNDaysAWeekProgressLevel = ({ learnerGoal }: ComputationConfig): GoalNDaysAWeek => {
  const {
    goalType: {
      definition: { n },
    },
  } = learnerGoal;

  const progress = learnerGoal.progress || {};
  const history = progress.history || [];

  if (history.length > n) {
    switch (history.length) {
      case 7:
        return 'goalExceeded7DayStreak';
      case 6:
        return n === 5 ? 'goalExceededByOneDay' : 'goalExceededNice';
      case 5:
        return 'goalExceededAwesome';
      case 4:
        return n === 3 ? 'goalExceededByOneDay' : 'goalExceededGreat';
      case 3:
        return 'goalExceededByOneDay';
      default:
        return 'oneDayComplete';
    }
  }

  if (history.length === n) {
    return 'goalComplete';
  }

  switch (history.length) {
    case 4:
      return 'goalAlmostComplete';
    case 3:
      return 'threeDaysComplete';
    case 2:
      return n === 3 ? 'goalAlmostComplete' : 'twoDaysComplete';
    case 1:
      return 'oneDayComplete';
    default:
      return 'oneDayComplete';
  }
};

export default ({ learnerGoal, isPullBased }: ComputationConfig): GoalProgressLevels | null => {
  const { typeName } = (learnerGoal || {}).goalType || {};

  switch (typeName) {
    case GOAL_TYPE_COMPLETE_N_VIDEOS:
      return computeFinishNVideosProgressLevel({ learnerGoal, isPullBased });

    case GOAL_TYPE_COMPLETE_N_ASSIGNMENTS:
      return computeFirstAssignmentProgressLevel({ learnerGoal, isPullBased });

    case GOAL_TYPE_N_DAY_STREAK:
      return computeStreakProgressLevel({ learnerGoal, isPullBased });

    case GOAL_TYPE_N_DAYS_A_WEEK:
      return computeGoalNDaysAWeekProgressLevel({ learnerGoal });

    default:
      return null;
  }
};
