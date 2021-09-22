import { s12nCourseProgressStatus } from 'bundles/ondemand/constants/Constants';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import moment from 'moment';
import _t from 'i18n!nls/ondemand';

function getDefaultConfigTranslated(notification) {
  const { name } = notification;

  return {
    actionLabel: _t('Learn More'),
    htmlMessage: _t("An updated version of '#{name}' is now available. {actionLabel}", { name }),
    type: 'info', // default type is info
  };
}

const exported = {
  /**
   * getS12nUpgradeId - returns a valid string key, given a user id and s12n id
   *
   * @param  {object} ids          ids for creating the upgrade id
   * @param  {string} ids.userId   user id eligible for upgrade
   * @return {string} ids.s12nId   s12nId eligible for upgrade
   */
  getS12nUpgradeId({ userId, s12nId }) {
    return tupleToStringKey([userId, s12nId]);
  },

  /**
   * getCoursesStatusById - given a list of courses progress,
   * returns the progress status by course id.
   *
   * @param  {array} coursesProgress   list of courses progress
   * @param  {array} currentCourseIds  list of current courses ids
   * @param  {array} newCourseIds      list of new courses ids
   * @return {object} learner status object by course id
   */
  getCoursesStatusById(coursesProgress, currentCourseIds, newCourseIds = []) {
    const courseStatusById = {};

    // assign a progress status for current courses
    coursesProgress.forEach((progress, idx) => {
      const courseId = progress.courseId;
      courseStatusById[courseId] = this.getStatus(progress);
    });

    // assign a new status for a new course in the new version
    const { NEW } = s12nCourseProgressStatus();
    newCourseIds.forEach((courseId) => {
      if (this.isNewCourse(courseId, currentCourseIds)) {
        courseStatusById[courseId] = NEW;
      }
    });

    return courseStatusById;
  },

  /**
   * getStatus - given a course progress, returns the progress status based on
   * the learner's `overallGrade` and `isOverallPassed`.
   *
   * @param  {object} progress course progress
   * @return {object} progress status
   */
  getStatus(progress) {
    const { NEW, DONE, PARTIAL } = s12nCourseProgressStatus();
    if (progress.overallGrade === 0) {
      return {
        status: NEW.status,
      };
    } else if (progress.isOverallPassed) {
      return DONE;
    } else {
      return PARTIAL;
    }
  },

  /**
   * getNumIncompleteCourses - given a list of courses progress,
   * returns the number of incomplete courses
   *
   * @param  {array} coursesProgress list of courses progress
   * @return {number} num of incomplete courses
   */
  getNumIncompleteCourses(coursesProgress) {
    const incompleteCourses = coursesProgress.filter((progress) => {
      // any course without a DONE progress is considered incomplete
      return this.getStatus(progress).progress !== s12nCourseProgressStatus().DONE.progress;
    });

    return incompleteCourses.length;
  },

  /**
   * isNewCourse - whether it is a new course.
   *
   * @param  {string} newCourseId     course id for a new course
   * @param  {array} currentCourseIds array of current course ids
   * @return {boolean}
   */
  isNewCourse(newCourseId, currentCourseIds) {
    return currentCourseIds.indexOf(newCourseId) === -1;
  },

  /**
   * getNotificationConfig - returns the html message and type of notification,
   * based on how close it is to expiring:
   *  -  2 months from expiring -> Warning type
   *  -  1 month from expiring -> Warning type
   *  -  expired -> Error type
   *  -  otherwise -> Info type
   *
   * @param  {object} notification notification object
   * @return {object} notification config such as message and type
   */
  getNotificationConfig(notification) {
    const config = getDefaultConfigTranslated(notification);

    if (notification.expiresAt) {
      const expiresAt = moment(notification.expiresAt).format('MMMM Do, YYYY');

      // has expired
      if (moment(notification.expiresAt).isBefore(moment())) {
        config.type = 'danger';
      } else if (moment(notification.expiresAt).isBefore(moment().add(2, 'M'))) {
        // 2 or less months from expiring
        config.type = 'warning';
        config.htmlMessage = _t(`'${notification.name}' is ending on ${expiresAt}. {actionLabel}`);
      }
    }

    return config;
  },

  /**
   * getUpgradePreferenceMap - returns the preference map
   *
   * @param  {object} upgradePreferences UserPreferences object
   * @return {object} preference map, if exists
   */
  getUpgradePreferenceMap(upgradePreferences) {
    if (!upgradePreferences || !upgradePreferences.preference) {
      return null;
    }

    return upgradePreferences.preference.definition.upgradePreferenceMap;
  },

  /**
   * getUserPreference - returns a value from the user preference map, given
   * an s12n id key.
   *
   * @param  {object} userPreferences UserPreferences object
   * @param  {string} s12nId          s12nId to get preference for
   * @param  {string} field           field name to get
   * @return value of the preference field
   */
  getUserPreference(userPreferences, s12nId, field) {
    if (!userPreferences.preference) {
      return null;
    }

    const map = userPreferences.preference.definition.upgradePreferenceMap;

    return map && map[s12nId] && map[s12nId][field];
  },
};

export default exported;

export const {
  getS12nUpgradeId,
  getCoursesStatusById,
  getStatus,
  getNumIncompleteCourses,
  isNewCourse,
  getNotificationConfig,
  getUpgradePreferenceMap,
  getUserPreference,
} = exported;
