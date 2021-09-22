import Q from 'q';
import CourseMaterialsPromiseFactories from 'pages/open-course/common/data/courseMaterials';
import CourseMaterials from 'pages/open-course/common/models/courseMaterials';
import CoursePromise from 'pages/open-course/common/promises/course';
import Course from 'pages/open-course/common/models/course';
import memoize from 'js/lib/memoize';

const courseMaterialsPromiseFactory = (courseSlug) => {
  return Q.all([
    CourseMaterialsPromiseFactories.fromSlug(courseSlug),
    CoursePromise.fromSlug(courseSlug, { rawData: true }),
  ])
    .spread(function (courseMaterialsData, courseData) {
      const course = new Course(courseData, { parse: true });

      return {
        courseMaterials: new CourseMaterials(courseMaterialsData, {
          course,
          parse: true,
        }),
        rawCourseMaterials: { courseData, courseMaterialsData },
      };
    })
    .catch((err) => {
      console.error(err);
    });
};
export default courseMaterialsPromiseFactory;
export const memoizedCourseMaterialsPromiseFactory = memoize(courseMaterialsPromiseFactory);
