import _ from 'underscore';
import epic from 'bundles/epic/client';
import user from 'js/lib/user';
import constants from 'pages/open-course/common/constants';

const exported = {
  /**
   * Determines whether the given experiment defined in the constants file is enabled for the current course
   * and environment (development, staging, or production).
   * @param {String} experiment - The constants attribute that defines the list of enabled courses.
   * @param {?String} options - A map of options.
   *   - currentCourse: An identifier for the current course, such as the course ID. Defaults to the courseSlug.
   *   - requiresLogin: A boolean that specifies whether this experiment is only enabled for logged-in users.
   *     Defaults to false.
   * @return {boolean} - True if the course is enabled, or false otherwise.
   */
  isEnabled(experiment, options) {
    options = _({
      currentCourse: constants.courseSlug,
      requiresLogin: false,
    }).extend(options);

    if (options.requiresLogin && !user.isAuthenticatedUser()) {
      return false;
    }

    const allowedCourses = constants[experiment][constants.config.environment];
    return _(allowedCourses).contains(options.currentCourse);
  },

  /**
   * Determines whether the given experiment defined in EPIC is enabled for the current course
   * (identified by course slug) and environment (development, staging, or production).
   * @param {String} namespace - The namespace for the experiment in EPIC.
   * @param {String} experiment - The name of the attribute that defines the list of enabled courses.
   * @param {String} courseId - The id of the course in question.
   * @return {boolean} - True if the course is enabled, or false otherwise.
   */
  isEnabledInEpic(namespace, experiment, courseId) {
    const allowedCoursesConfig = epic.get(namespace, experiment);
    if (allowedCoursesConfig) {
      const allowedCourses = allowedCoursesConfig[constants.config.environment];
      if (allowedCourses) {
        return _(allowedCourses).contains(constants.courseSlug) || _(allowedCourses).contains(courseId);
      }
    }
    return false;
  },

  /**
   * Determines whether a feature is blacklisted in a course using an EPIC rollout experiment.
   * Works both for plain arrays of course IDs and objects of course IDs based on environment.
   * @param {string} courseId - The ID of the course to check.
   * @returns {boolean} - True if the feature has been blacklisted in this course.
   */
  isBlacklistedInEpic(namespace, parameter, courseId) {
    let blacklistedCourses = epic.get(namespace, parameter);
    if (!_(blacklistedCourses).isArray()) {
      blacklistedCourses = blacklistedCourses[constants.config.environment];
    }
    return !!(blacklistedCourses && _(blacklistedCourses).contains(courseId));
  },
};

export default exported;

export const { isEnabled, isEnabledInEpic, isBlacklistedInEpic } = exported;
