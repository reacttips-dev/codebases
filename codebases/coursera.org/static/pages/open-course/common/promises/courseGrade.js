import courseGradeDataPromise from 'pages/open-course/common/data/courseGrade';
import CourseGrade from 'pages/open-course/common/models/courseGrade';
import memoize from 'js/lib/memoize';

const courseGradePromise = (courseId) =>
  courseGradeDataPromise(courseId).then((courseGradeData) => courseGradeData && new CourseGrade(courseGradeData));

export default courseGradePromise;
export const memoizedCourseGradePromise = memoize(courseGradePromise);
