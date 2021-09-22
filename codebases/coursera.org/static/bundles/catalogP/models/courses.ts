import moment from 'moment';
import _ from 'underscore';
import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
import Course from 'bundles/catalogP/models/course';

const CourseCollection = CatalogCollection.extend({
  model: Course,
  resourceName: 'courses.v1',

  RECENT_COURSE_CUTOFF: 7,

  sortCourses() {
    const recentCutoff = moment().subtract(this.RECENT_COURSE_CUTOFF, 'days');

    const onDemandCourses = this.filter(function (course: $TSFixMe) {
      return course.isOnDemand();
    });

    const upcomingCourses = this.chain()
      .filter(function (course: $TSFixMe) {
        return course.getStartDate() && course.getStartDate().isAfter(recentCutoff);
      })
      .sortBy(function (course: $TSFixMe) {
        return course.getStartDate();
      })
      .value();

    const pastCourses = this.chain()
      .filter(function (course: $TSFixMe) {
        return course.getStartDate() && course.getStartDate().isBefore(recentCutoff);
      })
      .sortBy(function (course: $TSFixMe) {
        return -1 * course.getStartDate();
      })
      .value();

    const coursesWithoutStartDate = this.filter(function (course: $TSFixMe) {
      return course.getStartDate() === undefined;
    });

    const sortedCourses = _.union(onDemandCourses, upcomingCourses, pastCourses, coursesWithoutStartDate);

    return new CourseCollection(sortedCourses);
  },
});

export default CourseCollection;
