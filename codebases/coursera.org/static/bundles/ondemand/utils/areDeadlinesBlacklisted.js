import epic from 'bundles/epic/client';

/**
 * Determines if the course with the given courseId should not have deadlines in On-Demand mode.
 * @param {string} courseId - when in a phoenix course, this param defaults to the current course's ID.
 * @returns {bool} True if the course is blacklisted for deadlines, false if not.
 */
export default (courseId) => {
  return epic.get('featureBlacklist', 'defaultDeadlines').indexOf(courseId) !== -1;
};
