import _ from 'underscore';
import _t from 'i18n!nls/classmates';
import constants from 'pages/open-course/common/constants';

export const getProgressString = function (progressPercent: $TSFixMe, isComplete: $TSFixMe) {
  if (isComplete) {
    return _t('Completed course');
  } else if (progressPercent < 25) {
    return _t('Getting Started');
  } else if (progressPercent < 50) {
    return _t('Halfway through');
  } else {
    return _t('Almost completed');
  }
};

export const getCourseRoleString = function (courseRole: $TSFixMe) {
  switch (courseRole) {
    case 'INSTRUCTOR':
      return _t('Instructor');
    case 'TEACHING_STAFF':
      return _t('Teaching Staff');
    case 'UNIVERSITY_ADMIN':
      return _t('Teaching Staff');
    case 'COURSE_ASSISTANT':
      return _t('Mentor');
    case 'MENTOR':
      return _t('Mentor');
    case 'TOP_CONTRIBUTOR':
      return _t('Top Contributor');
    case 'LEARNER':
      return _t('Learner');
  }
};

export const hasModeratorAccess = function (courseRole: $TSFixMe) {
  return courseRole && _(constants.courseRolesWithModeratorAccess).contains(courseRole.toUpperCase());
};

export const getCourseRoleValue = function (courseRole: $TSFixMe, helperStatus: $TSFixMe) {
  // Top Contributor shouldn't override a more important role
  if (!hasModeratorAccess(courseRole) && helperStatus === 'TOP_CONTRIBUTOR') {
    return 'TOP_CONTRIBUTOR';
  } else {
    return courseRole;
  }
};

export const isTopContributor = function (courseRole: $TSFixMe) {
  return courseRole === 'TOP_CONTRIBUTOR';
};
