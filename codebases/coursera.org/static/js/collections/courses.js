import Backbone from 'backbone';
import _ from 'underscore';
import language from 'js/lib/language';
import Course from 'js/models/course';

/**
 * Returns whether or not the browser locale is set to a Chinese language.
 */
const isChinese = function () {
  return language.getLanguageCode() === 'zh';
};

const ONEYEAR = 1000 * 60 * 60 * 24 * 365 * 7;

const Courses = Backbone.Collection.extend({
  model: Course,
});

Courses.toArray = function (courses) {
  return courses instanceof Backbone.Collection ? courses.toArray() : courses;
};

/**
 * If the user is visiting from China, then sort the Chinese sessions first. If
 * not, then put the Chinese sessions last.
 */
Courses.byExperimentalChineseTranslatedCoursesOrder = function (courses) {
  if (isChinese()) {
    return _(Courses.toArray(courses)).sortBy(function (course) {
      return course.isChineseOnly() ? 'a' : 'b';
    });
  } else {
    return _(Courses.toArray(courses)).sortBy(function (course) {
      return course.isChineseOnly() ? 'b' : 'a';
    });
  }
};

Courses.byTime = function (courses) {
  return _(Courses.toArray(courses)).sortBy(function (course) {
    // If the course doesn't have a startTime, we treat is as if the starttime occurs December 2099.
    const startTime = course.getStartTime() || 4100745600000;

    // If the course is in the past, we add to its startTime, to make sure current courses show before
    // past courses.
    return course.getStartStatus() === 'past' ? startTime + ONEYEAR * 100 : startTime;
  });
};

Courses.byTimeDescending = function (courses) {
  return Courses.byTime(courses).reverse();
};

Courses.byTimeFromNow = function (courses) {
  return _(Courses.toArray(courses)).sortBy(function (course) {
    return Math.abs(course.getStartTime() - new Date().getTime());
  });
};

Courses.byPrimaryButtonRelevance = function (courses) {
  return _(Courses.toArray(courses)).sortBy(function (course) {
    return course.getCourseButtonState().priority;
  });
};

Courses.forId = function (courses, id) {
  return _(Courses.toArray(courses)).find(function (course) {
    if (course.get('id') == id) {
      return course;
    }
  });
};

Courses.openCourses = function (courses) {
  return _(Courses.toArray(courses)).filter(function (course) {
    return course.isOpen();
  });
};

Courses.haveActiveSignatureTrack = function (courses) {
  return _(Courses.openCourses(courses)).filter(function (course) {
    return course.isSignatureTrackOpen();
  });
};

export default Courses;
