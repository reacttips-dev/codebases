import moment from 'moment';

import { GoalHistory, GoalProgressItemEntry } from 'bundles/goal-setting/types/LearnerGoal';
import { DAYS_OF_WEEK } from 'bundles/goal-setting/utils/constants';

import { formatDateTimeDisplay, SHORT_WEEKDAY } from 'js/utils/DateTimeUtils';

// Normalizes the weekday index Moment uses to that weeks start on Monday (0)
// and end on Sunday (6)
const normalizeDayIndex = (momentDay: number) => {
  if (momentDay === 0) {
    return 6;
  }

  return momentDay - 1;
};

export default (history: GoalHistory): string[] => {
  const completedDaysOfWeek: string[] = [];

  history.forEach((goalProgressItemEntry: GoalProgressItemEntry) => {
    const {
      definition: { updatedAt },
    } = goalProgressItemEntry;
    const updatedAtMoment = moment(updatedAt);
    const momentWeekday = formatDateTimeDisplay(moment(updatedAtMoment, SHORT_WEEKDAY), SHORT_WEEKDAY);
    const weekdayIndex = normalizeDayIndex(parseInt(momentWeekday, 10));
    const weekdayKeys = Object.keys(DAYS_OF_WEEK);

    if (weekdayIndex >= 0 && weekdayIndex < weekdayKeys.length) {
      completedDaysOfWeek.push(weekdayKeys[weekdayIndex]);
    }
  });

  return completedDaysOfWeek;
};
