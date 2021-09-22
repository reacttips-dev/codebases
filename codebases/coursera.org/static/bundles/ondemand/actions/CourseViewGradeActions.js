import Q from 'q';
import user from 'js/lib/user';
import courseViewGradePromise from 'pages/open-course/common/promises/courseViewGrade';

export const loadCourseViewGrade = (actionContext, { courseId }) => {
  if (actionContext.getStore('CourseViewGradeStore').hasLoaded()) {
    return Q();
  }

  return courseViewGradePromise(`${user.get().id}~${courseId}`, true)
    .then((rawCourseViewGrade) => {
      actionContext.dispatch('LOAD_COURSE_VIEW_GRADE', rawCourseViewGrade);
    })
    .fail((e) => {
      actionContext.dispatch('LOAD_COURSE_VIEW_GRADE', null);
    });
};

export const refreshCourseViewGrade = (actionContext, { courseId }) => {
  return courseViewGradePromise(`${user.get().id}~${courseId}`, true).then((courseViewGrade) => {
    actionContext.dispatch('LOAD_COURSE_VIEW_GRADE', courseViewGrade);
  });
};
