import { LearnerCourseScheduleField } from 'bundles/course-sessions/types/LearnerCourseSchedule';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import * as LearnerCourseScheduleUtils from 'bundles/course-sessions/utils/LearnerCourseScheduleUtils';
import NaptimeResource from './NaptimeResource';

class learnerCourseSchedules extends NaptimeResource {
  static RESOURCE_NAME = 'learnerCourseSchedules.v1';

  startsAt!: number;

  endsAt!: number;

  static getByUserIdAndCourseId(
    userId: number,
    courseId: string,
    fields: Array<LearnerCourseScheduleField>,
    required = true
  ) {
    const id = tupleToStringKey([userId.toString(), courseId]);
    return this.get(id, {
      fields,
      required,
    });
  }

  static getSessionsV2Enabled(userId: number, courseId: string, required = true) {
    const id = tupleToStringKey([userId.toString(), courseId]);
    return this.get(
      id,
      {
        fields: ['id', 'scheduleTypeContent'],
        required,
      },
      (schedule) => LearnerCourseScheduleUtils.isSessionsV2Enabled(schedule)
    );
  }

  static getSessionsV2EnabledBySlug(courseSlug: string) {
    return this.finder(
      'findBySlug',
      {
        params: {
          slug: courseSlug,
        },
        fields: ['id', 'scheduleTypeContent'],
      },
      (schedules) => schedules.length !== 0 && LearnerCourseScheduleUtils.isSessionsV2Enabled(schedules[0])
    );
  }
}

export default learnerCourseSchedules;
