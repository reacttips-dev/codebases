import Q from 'q';
import API from 'js/lib/api';
import URI from 'jsuri';

import { tupleToStringKey } from 'js/lib/stringKeyTuple';

const learnerCourseSchedulesAPI = API('/api/learnerCourseSchedules.v1/', { type: 'rest' });

const LearnerCourseSchedulesAPIUtils = {
  getByUserIdAndCourseId(userId: $TSFixMe, courseId: $TSFixMe) {
    const id = tupleToStringKey([userId, courseId]);
    const uri = new URI(id);
    return Q(learnerCourseSchedulesAPI.get(uri.toString())).then((response) => {
      return response.elements && response.elements[0];
    });
  },

  adjustSchedule(userId: $TSFixMe, courseId: $TSFixMe, days: $TSFixMe) {
    const id = tupleToStringKey([userId, courseId]);
    const uri = new URI().addQueryParam('action', 'adjust').addQueryParam('id', id);

    const data = {
      'org.coursera.ondemand.schedule.ShiftDeadlinesRequest': {
        days,
      },
    };

    return Q(learnerCourseSchedulesAPI.post(uri.toString(), { data }));
  },
};

export default LearnerCourseSchedulesAPIUtils;

export const { getByUserIdAndCourseId, adjustSchedule } = LearnerCourseSchedulesAPIUtils;
