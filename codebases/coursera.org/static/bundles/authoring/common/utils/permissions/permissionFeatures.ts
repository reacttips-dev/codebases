import type { InputFeatures } from 'bundles/teach-course/utils/types';

export const FEATURE = {
  COURSE: 'authoringCourse',
  COURSE_ANALYTICS: 'authoringCourseAnalytics',
  COURSE_ANNOUNCEMENTS: 'authoringCourseAnnouncements',
  COURSE_ASSIGNMENT_SCHEDULE: 'authoringCourseAssignmentSchedule',
  COURSE_AUTHOR_DISCUSSIONS: 'authoringCourseForumActivity',
  COURSE_AUTHOR_STAFF: 'authoringCourseStaffs',
  COURSE_CONTENT: 'authoringCourseContent',
  COURSE_EVENTS: 'authoringCourseEvents',
  COURSE_FEEDBACK: 'authoringCourseFeedback',
  COURSE_GRADES: 'authoringCourseGrades',
  COURSE_GRADE_CHANGE_LOG: 'authoringCourseGradeChangeLog',
  COURSE_GRADEBOOK: 'authoringCourseGradebookManager',
  COURSE_GRADING_POLICY: 'authoringCourseGradingPolicy',
  COURSE_GRADING_FORMULA: 'authoringCourseGradingFormula',
  COURSE_GROUPS_SESSIONS: 'authoringCourseSessions',
  COURSE_INVITATIONS: 'authoringCourseInvitations',
  COURSE_LEARNER_TEAMS: 'authoringCourseLearnerTeams',
  COURSE_LEARN_VIEW_AS_LEARNER: 'learnCourseViewAsLearner',
  COURSE_LEARN_VIEW_AS_LEARNER_GROUP_SWITCHER: 'learnCourseViewAsLearnerSwitchGroup',
  COURSE_LEARN_ACT_AS_LEARNER: 'learnCourseActAsLearnerMode',
  COURSE_MESSAGES: 'authoringCourseMessages',
  COURSE_ROSTER: 'authoringCourseRosters',
  COURSE_SCHEDULE: 'authoringCourseSchedule',
  COURSE_SESSION_SCHEDULE: 'authoringCourseSessionSchedule',
  COURSE_SUPPORT_DASHBOARD: 'authoringCourseSupportDashboard',
  COURSE_SETTINGS: 'authoringCourseSettings',
  COURSE_CERTIFICATE_SETTINGS: 'authoringCourseCertificateSettings',
  COURSE_TEACH_VIEW_AS_LEARNER: 'authoringCourseViewAsLearner',
  COURSE_TEAMS: 'authoringCourseLearnerTeams',
  COURSE_TEAM_WORKSPACE: 'authoringCourseTeamwork',
  COURSE_VERSIONS: 'authoringCourseVersions',
  /* /groups features */
  GROUP_ADMIN: 'groupAdmin',
  /* /teach-program features */
  PROGRAM_ANALYTICS: 'programAnalytics',
  PROGRAM_ANALYTICS_RECRUITMENT: 'programAnalyticsRecruitmentDashboard',
  PROGRAM_ANALYTICS_STUDENT_SUCCESS: 'programAnalyticsStudentSuccessDashboard',
  PROGRAM_SCHEDULES: 'programSchedules',
  PROGRAM_SCHEDULES_TERMS: 'programSchedulesTerms',
  PROGRAM_SETTINGS: 'programSettings',
  PROGRAM_STAFF_MANAGEMENT: 'programStaffManagement',
  PROGRAM_LEARNERS: 'programLearners',
  PROGRAM_LEARNERS_ONBOARDING_ROSTER: 'programLearnersOnboardingRoster',
  /* /admin */
  ADMIN_GROUP: 'adminGroup',
  ADMIN_COURSE: 'adminCourse',
  ADMIN_S12N: 'adminS12n',
  ADMIN_INSTITUTION: 'adminInstitution',
  ADMIN_DEGREE: 'adminDegree',
};

export const VERB = {
  READ: 'read',
  UPDATE: 'update',
  CREATE: 'create',
  DELETE: 'delete',
  EXPORT: 'export',
  OVERRIDE_GRADE: 'overrideGrade',
  RELEASE_GRADE: 'releaseGrade',
  PLAGIARISM: 'plagiarism',
  MANAGE: 'manage',
  GRADE: 'grade',
  PUBLISH: 'publish',
  CUSTOM: 'customVerb~',
};

export function getPermissionFeatures(instanceId: string, name: string, verbs: Array<string>) {
  return [
    {
      instanceId,
      features: [
        {
          name,
          verbs,
        },
      ],
    },
  ];
}

export function getProgramAdminFeatures(programId: string): InputFeatures {
  return [
    {
      instanceId: programId,
      features: [
        {
          name: FEATURE.PROGRAM_ANALYTICS,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.PROGRAM_ANALYTICS_RECRUITMENT,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.PROGRAM_ANALYTICS_STUDENT_SUCCESS,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.PROGRAM_SCHEDULES,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.PROGRAM_SCHEDULES_TERMS,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.PROGRAM_SETTINGS,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.PROGRAM_STAFF_MANAGEMENT,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.PROGRAM_LEARNERS,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.PROGRAM_LEARNERS_ONBOARDING_ROSTER,
          verbs: [VERB.READ],
        },
      ],
    },
  ];
}
