/* Returns a promise for the course data object from the course data API. */

import Q from 'q';

import user from 'js/lib/user';
import api from 'pages/open-course/common/api';
import memoize from 'js/lib/memoize';

const courseProgressPromise = function (courseSlug) {
  if (!user.get().id) {
    return Q.fcall(function () {
      return {
        modules: {},
        lessons: {},
        items: {},
      };
    });
  } else {
    return Q(api.get('user/' + user.get().id + '/course/' + courseSlug));
  }
};

export default courseProgressPromise;
export const memoizedCourseProgressPromise = memoize(courseProgressPromise);
