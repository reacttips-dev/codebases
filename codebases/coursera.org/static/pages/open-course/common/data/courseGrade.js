/**
 * Returns a promise for the course grade object from the onDemandCourseGrades.v1 API.
 */

import Q from 'q';

import path from 'js/lib/path';
import api from 'pages/open-course/common/naptimeApi';
import memoize from 'js/lib/memoize';

const courseGradeDataPromise = function (courseId) {
  return Q(api.get(path.join('onDemandCourseGrades.v1', courseId))).then(function (response) {
    return response.elements[0];
  });
};

export default courseGradeDataPromise;
export const memoizedCourseGradeDataPromise = memoize(courseGradeDataPromise);
