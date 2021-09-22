import store from 'js/lib/coursera.store';
import keysToConstants from 'js/lib/keysToConstants';

/**
 * This must be a function so constants.courseId is guaranteed to have been injected.
 * @returns {string} The local storage key for course mode overrides for the current course.
 */
const getLocalStorageKey = (courseId) => {
  return `CourseModeOverride.${courseId}`;
};

/**
 * @returns {string} The course mode, if an override is set. If no override is set, returns undefined.
 */
export const getCourseModeOverride = (courseId) => {
  return store.get(getLocalStorageKey(courseId));
};

export const setCourseModeOverride = (mode, courseId) => {
  store.set(getLocalStorageKey(courseId), mode);
};

export const removeCourseModeOverride = (courseId) => {
  store.remove(getLocalStorageKey(courseId));
};

export const courseModes = keysToConstants(['PRE_ENROLL', 'ON_DEMAND', 'SESSIONS']);
