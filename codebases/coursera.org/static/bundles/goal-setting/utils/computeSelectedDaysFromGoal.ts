import { GoalChoice } from '../types/GoalChoice';

import { DAYS_OF_WEEK, GOAL_TYPE_N_DAYS_A_WEEK } from './constants';

/**
 * Produces the default week days to be selected based on the
 * GOAL_TYPE_N_DAYS_A_WEEK goal choice that has been selected
 */
export default (goalChoice: GoalChoice) => {
  const {
    goalType: {
      typeName,
      definition: { n },
    },
  } = goalChoice;

  const dayKeys = Object.keys(DAYS_OF_WEEK);

  if (typeName === GOAL_TYPE_N_DAYS_A_WEEK) {
    switch (n) {
      case 2:
        return [dayKeys[1], dayKeys[3]];
      case 3:
        return [dayKeys[0], dayKeys[2], dayKeys[4]];
      case 5:
        return dayKeys.slice(0, 5);
      default:
        return [];
    }
  }

  return [];
};
