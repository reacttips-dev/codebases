import moment from 'moment';

import _t from 'i18n!nls/goal-setting';

export const GOAL_TYPE_COMPLETE_N_VIDEOS = 'GoalCompleteNVideos';
export const GOAL_TYPE_COMPLETE_N_ASSIGNMENTS = 'GoalCompleteNAssignments';
export const GOAL_TYPE_N_DAY_STREAK = 'GoalNDayStreak';
export const GOAL_TYPE_N_DAYS_A_WEEK = 'GoalNDaysAWeek';
export const GOAL_CREATION_PUSH_KEY = 'GoalSettingCreationPushKey';

const goalSettingStates = ['editing', 'creating', 'default'];

export const GOAL_SETTING_STATE: { [key: string]: typeof goalSettingStates[number] } = Object.freeze({
  EDITING: 'editing',
  CREATING: 'creating',
  DEFAULT: 'default',
});

export type GoalSettingState = typeof goalSettingStates[number];

const momentDaysOfWeek = moment.weekdaysMin();

// Because Moment starts its weeks on Sunday but we start ours on Monday,
// We need to restructure the array to place Sunday last
const rearrangedDaysOfWeek = momentDaysOfWeek.slice(1).concat(momentDaysOfWeek[0]);
const dayKeys = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];

// Create a map mapping API day-of-week codes to their localized strings from Moment
export const DAYS_OF_WEEK: { [key in typeof dayKeys[number]]: string } = dayKeys.reduce(
  (acc, v, idx) => ({ ...acc, [v]: rearrangedDaysOfWeek[idx] }),
  {}
);

export const DAYS_OF_WEEK_LABELS: { [key in typeof dayKeys[number]]: string } = {
  mo: _t('Monday'),
  tu: _t('Tuesday'),
  we: _t('Wednesday'),
  th: _t('Thursday'),
  fr: _t('Friday'),
  sa: _t('Saturday'),
  su: _t('Sunday'),
};

export type DayOfWeek = keyof typeof DAYS_OF_WEEK;
