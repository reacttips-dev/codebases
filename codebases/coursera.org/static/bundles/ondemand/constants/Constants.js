import _t from 'i18n!nls/ondemand';

const exported = {
  Actions: {
    TOGGLE_MOBILE_MENU: 'toggleMobileMenu',
  },

  Sources: {
    SERVER: 'server',
    VIEW: 'view',
  },

  mainNavItems: {
    HOME: 'home',
    ASSIGNMENTS: 'assignments',
    COURSE: 'course',
    DISCUSSIONS: 'discussions',
    COURSE_INBOX: 'course-inbox',
    TEAMWORK: 'teamwork',
    CLASSMATES: 'classmates',
    INFO: 'info',
    REFERENCES: 'references',
    OFFICE_HOURS: 'office-hours',
    COURSE_MANAGER: 'course-manager',
  },

  LoadingStates: {
    LOADING: 'LOADING',
    DONE: 'DONE',
    ERROR: 'ERROR',
  },

  CoursePassingForecast: {
    PASSING: 'willPass',
    NOT_PASSING: 'willNotPass',
  },

  s12nCourseProgressStatus: () => ({
    DONE: {
      progress: _t('DONE'),
      status: _t('Your credit transfers'),
    },
    PARTIAL: {
      progress: _t('PARTIAL'),
      status: _t('Your progress transfers'),
    },
    NEW: {
      progress: _t('NEW'),
      status: _t('Not started'),
    },
  }),

  s12nUpgradeAction: () => ({
    STAY: {
      action: 'stay',
      label: _t('Finish Current Version'),
    },
    UPGRADE: {
      action: 'upgrade',
      label: _t('Switch to New Version'),
    },
  }),

  // map policy to equivalent backend resource name
  GradePolicy: {
    MASTERY: 'org.coursera.ondemand.coursematerial.MasteryGradePolicy',
    CUMULATIVE: 'org.coursera.ondemand.coursematerial.CumulativeGradePolicy',
  },

  onDemandSessionsApi: '/api/onDemandSessions.v1',
  onDemandSessionMembershipsApi: '/api/onDemandSessionMemberships.v1',
  onDemandTutorialViewsApi: '/api/onDemandTutorialViews.v1',
};

export default exported;

export const {
  Actions,
  Sources,
  mainNavItems,
  LoadingStates,
  CoursePassingForecast,
  s12nCourseProgressStatus,
  s12nUpgradeAction,
  GradePolicy,
  onDemandSessionsApi,
  onDemandSessionMembershipsApi,
  onDemandTutorialViewsApi,
} = exported;
