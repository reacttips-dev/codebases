import _ from 'lodash';
import type { LearnerCourseSchedule } from 'bundles/course-sessions/types/LearnerCourseSchedule';
import { KEY_FLEXIBLE, KEY_FLEXIBLE_CAMEL_CASE } from 'bundles/course-sessions/Constants';
import moment from 'moment';

export function isSessionsV2Enabled(schedule?: Partial<LearnerCourseSchedule>) {
  return (
    schedule &&
    schedule.scheduleTypeContent &&
    [KEY_FLEXIBLE, KEY_FLEXIBLE_CAMEL_CASE].some((key) => _.has(schedule.scheduleTypeContent, key))
  );
}

export function formatTimelineMessage(startDate?: number, endDate?: number): string {
  if (!startDate || !endDate) {
    return '';
  }

  const scheduleStartDate = moment(startDate);
  const scheduleEndDate = moment(endDate);

  return scheduleStartDate.format('LL') + ' - ' + scheduleEndDate.format('LL');
}

export function computeShiftedDates(
  startDate: number,
  endDate: number,
  shiftDuration: moment.DurationInputObject
): {
  startDate: number;
  endDate: number;
} {
  const shiftedStartDate = moment(startDate).add(shiftDuration).valueOf();
  const shiftedEndDate = moment(endDate).add(shiftDuration).valueOf();

  return {
    startDate: shiftedStartDate,
    endDate: shiftedEndDate,
  };
}

export function getSessionsV2CourseTimelineMessage(schedule?: Partial<LearnerCourseSchedule>) {
  let message = '';
  if (schedule && schedule.startsAt && schedule.endsAt) {
    message = formatTimelineMessage(schedule.startsAt, schedule.endsAt);
  }

  return message;
}
