import CourseViewGrade from 'pages/open-course/common/models/courseViewGrade';
import courseViewGradeDataPromise from 'pages/open-course/common/data/courseViewGrade';
import memoize from 'js/lib/memoize';

const courseViewGradePromise = (id, rawData) => {
  return courseViewGradeDataPromise(id).then((courseViewGradeData) => {
    if (rawData) {
      return courseViewGradeData;
    }

    return courseViewGradeData && new CourseViewGrade(courseViewGradeData);
  });
};

export default courseViewGradePromise;
export const memoizedCourseViewGradePromise = memoize(courseViewGradePromise);
