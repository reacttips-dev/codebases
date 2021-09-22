import CourseDataPromiseFactories from 'pages/open-course/common/data/courseData';
import Course from 'pages/open-course/common/models/course';

const getCourse = (courseDataPromise, options = {}) =>
  courseDataPromise.then((courseData) => {
    const course = new Course(courseData, { parse: true });

    if (options.rawData) {
      return courseData;
    }

    return course;
  });

export const fromSlug = (courseSlug, options) => getCourse(CourseDataPromiseFactories.fromSlug(courseSlug), options);
export const fromId = (courseId) => getCourse(CourseDataPromiseFactories.fromId(courseId));

export default { fromSlug, fromId };
