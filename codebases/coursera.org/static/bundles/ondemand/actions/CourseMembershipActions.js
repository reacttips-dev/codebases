import Q from 'q';
import user from 'js/lib/user';
import courseMembershipPromise from 'pages/open-course/common/promises/membership';

/* eslint-disable import/prefer-default-export */
export const loadMembership = (actionContext, courseId) => {
  if (actionContext.getStore('CourseMembershipStore').hasLoaded()) {
    return Q();
  }

  let computedCourseId = courseId;

  if (!courseId) {
    computedCourseId = actionContext.getStore('CourseStore').getCourseId();
  }

  return courseMembershipPromise(user.get().id, computedCourseId, true).then((rawMembership) => {
    actionContext.dispatch('LOAD_COURSE_MEMBERSHIP', rawMembership);
  });
};
