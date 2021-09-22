import { memoizedCourseProgressPromise as memoizedOpenCourseCourseProgressPromise } from 'pages/open-course/common/data/courseProgress';
import CourseProgress from 'pages/open-course/common/models/courseProgress';
import memoize from 'js/lib/memoize';

const fullCourseProgressPromise = function (courseSlug) {
  const promise = memoizedOpenCourseCourseProgressPromise(courseSlug).then(function (progressData) {
    return new CourseProgress(progressData);
  });
  promise.done();
  return promise;
};

export default fullCourseProgressPromise;
export const memoizedCourseProgressPromise = memoize(fullCourseProgressPromise);
