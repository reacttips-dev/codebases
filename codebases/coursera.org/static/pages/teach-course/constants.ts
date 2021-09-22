// [fe-tech-debt]: Move this to bundles/teach-course/Routes.js
const constants = {
  // [ IMPORTANT ]: when adding a new page to /teach make sure to add the scope of the page to bundles/authoring/common/constants/pageScopes.js
  RouteNames: {
    /* Base Paths */
    TEACH: 'teach',
    DEFAULT_TEACH: 'defaultTeach',

    /* Course Level Pages */
    TEACH_COURSE_LEVEL: 'teach_course_level',
    TEACH_COURSE_LEVEL_OVERVIEW: 'teach_course_level_overview',
    TEACH_COURSE_LEVEL_ANALYTICS: 'teach_course_level_analytics',
    TEACH_COURSE_LEVEL_ANNOUNCEMENTS: 'teach_course_level_announcements',
    TEACH_COURSE_LEVEL_SETTINGS: 'teach_course_level_settings',
    TEACH_COURSE_LEVEL_RATINGS: 'teach_course_level_ratings',
    COURSE_LEVEL_AUTHOR_STAFF: 'course_level_author_staff',
    COURSE_LEVEL_STAFF_SETTINGS: 'course_level_staff_settings',

    /* Getting Started */
    COURSE_ROADMAP: 'course_roadmap',

    /* Content */
    COURSE_AUTHOR: 'course_author',
    COURSE_AUTHOR_BRANCHES: 'course_author_branches',
    COURSE_AUTHOR_OUTLINE: 'course_author_outline',
    COURSE_AUTHOR_MODULE: 'course_author_module',
    COURSE_ASSET_ADMIN: 'course_asset_admin',
    ASSET_DETAIL_VIEW: 'asset_detail_view',
    WIDGET_MANAGER: 'widget_manager',
    WIDGET_DETAIL_VIEW: 'widget_detail_view',
    WORKSPACES: 'labs',
    COURSE_AUTHOR_RESOURCES: 'course_author_resources',
    COURSE_AUTHOR_RESOURCE_ITEM: 'course_author_resource',
    COURSE_AUTHOR_DISCUSSIONS: 'course_author_discussions',

    /* item authoring */
    STAFF_GRADED_AUTHOR: 'staff_graded_author',
    TEAMMATE_REVIEW_AUTHOR: 'teammate_review_author',
    QUIZ_AUTHOR: 'quiz_author',
    QUIZ_AUTHOR_QUESTION: 'quiz_author_question',
    PROGRAMMING_AUTHOR: 'programming_author',
    PEER_REVIEW_AUTHOR: 'peer_review_author',
    DISCUSSION_PROMPT_AUTHOR: 'discussion_prompt_author',
    GRADED_DISCUSSION_PROMPT_AUTHOR: 'graded_discussion_prompt_author',
    LTI_AUTHOR: 'lti_author',
    READING_AUTHOR: 'reading_author',
    LECTURE_AUTHOR: 'lecture_author',
    NOTEBOOK_AUTHOR: 'notebook_author',
    PLUGIN_AUTHOR: 'plugin_author',
    WORKSPACE_AUTHOR: 'workspace_author',
    UNGRADED_LAB_AUTHOR: 'ungraded_lab_author',
    WISEFLOW_AUTHOR: 'wiseflow_author',
    PLACEHOLDER_AUTHOR: 'placeholder_author',

    COURSE_LEARNING_OBJECTIVES: 'course_learning_objectives',
    QUESTION_BANKS: 'question_banks',
    EDIT_QUESTION_BANK: 'edit_question_bank',
    MODULE_LEARNING_OBJECTIVES: 'module_learning_objectives',
    EDIT_LEARNING_OBJECTIVE: 'edit_learning_objective',
    EDIT_MODULE_LEARNING_OBJECTIVES: 'edit_module_learning_objectives',
    COURSE_FEEDBACK: 'course_feedback',
    ITEM_DASHBOARD: 'item_dashboard',
    ITEM_FEEDBACK: 'item_feedback',
    ITEM_GRADES: 'item_grades',

    /* Grading */
    GRADING: 'grading',
    COURSE_AUTHOR_GRADES: 'course_author_grades',
    COURSE_AUTHOR_GRADEBOOK: 'course_author_gradebook',
    COURSE_AUTHOR_GRADE_OVERRIDE: 'course_author_grade_override',
    COURSE_AUTHOR_GRADE_OVERRIDE_ITEM: 'course_author_grade_override_item',
    COURSE_AUTHOR_GRADE_OVERRIDE_SESSION: 'course_author_grade_override_session',
    COURSE_PEER_ADMIN: 'course_peer_admin',
    COURSE_STAFF_GRADING: 'course_staff_grading',
    GROUP_PROJECT_SUBMISSION: 'group_project_submission',
    DISCUSSION_GRADING: 'discussion_grading',
    /* V2 Assignment Grading */
    ASSIGNMENT_GRADING: 'assignment_grading',
    ASSIGNMENT_GRADING_ITEM: 'assignment_grading_item',

    USER_SUBMISSION: {
      assignment_grading_item: 'assignment_grading_user_submission',
      rosters_learner_detailed_view_grades: 'rosters_user_submission',
      ssd_learner_detailed_view_grades: 'ssd_user_submission',
    },
    USER_EXCEPTION: {
      assignment_grading_item: 'assignment_grading_user_exception',
      rosters_learner_detailed_view_grades: 'rosters_user_exception',
      ssd_learner_detailed_view_grades: 'ssd_user_exception',
    },

    USER_CHANGE_LOG: {
      assignment_grading_item: 'assignment_grading_user_change_log',
      rosters_learner_detailed_view_grades: 'rosters_user_change_log',
      ssd_learner_detailed_view_grades: 'ssd_user_change_log',
    },

    /* Optimized Submission Assignment Grading View */
    GRADE_ITEM: 'grade_item',
    GRADE_ITEM_SUBMISSION_QUESTION: 'grade_item_submission_question',

    /* Gradebook */
    GRADEBOOK: 'gradebook',

    /* Analytics */
    MONITOR: 'monitor',
    OVERVIEW: 'overview',
    COURSE_PROGRESS_FUNNEL: 'course_progress_funnel',
    REACH: 'reach',
    ANALYTICS_ASSESSMENTS: 'analytics_assessments',
    COURSE_RATINGS: 'course_ratings',
    COURSE_USER_STORIES: 'course_user_stories',
    EXPORTS: 'exports',
    STUDENT_SUCCESS: 'student_success',

    /* Scheduling */
    SCHEDULING: 'scheduling',
    COURSE_AUTHOR_SCHEDULE: 'course_author_schedule',
    COURSE_AUTHOR_SESSIONS: 'course_author_sessions',
    COURSE_AUTHOR_SESSION_VIEW: 'course_author_session_view',
    LIVE_EVENTS: 'live_events',

    /* Settings */
    SETTINGS: 'settings',
    COURSE_AUTHOR_INFO: 'course_author_info',
    COURSE_AUTHOR_SETTINGS: 'course_author_settings',
    COURSE_AUTHOR_MARKETING_ASSETS_SETTINGS: 'course_author_marketing_assets_settings',
    COURSE_AUTHOR_CERTIFICATE: 'course_author_certificate',
    COURSE_AUTHOR_CUSTOM_LABELS: 'course_author_custom_labels',
    COURSE_AUTHOR_GROUP_STAFF: 'course_author_group_staff',
    COURSE_STAFF_TUNNEL_VIEW: 'course_staff_tunnel_view',
    COURSE_STAFF_SETTINGS_TUNNEL_VIEW: 'course_staff_setting_tunnel_view',
    COURSE_STAFF_SETTINGS: 'course_staff_setting',
    COURSE_AUTHOR_INTEGRATIONS: 'course_author_integrations',
    GROUP_SETTINGS: 'group_settings',
    COURSE_BRANCH_LMS_INTEGRATION: 'lms_integration',

    /* Messages */
    COMMUNICATION: 'communication',
    ANNOUNCEMENTS: 'announcements',
    TRIGGERED_EMAILS: 'triggered_emails',
    SCHEDULED_MESSAGES: 'scheduled_messages',
    NEW_SCHEDULED_MESSAGE: 'new_scheduled_message',
    SCHEDULED_MESSAGE: 'scheduled_message',
    SCHEDULED_MESSAGE_PREVIEW: 'scheduled_message_preview',

    /* Groups */
    GROUPS: 'groups',

    /* Learners */
    LEARNERS: 'learners',
    INVITATIONS: 'invitations',
    ROSTERS: 'rosters',

    LEARNER_DETAILED_VIEW: {
      rosters: 'rosters_learner_detailed_view',
      discussion_forums: 'forums_learner_detailed_view',
    },
    LEARNER_DETAILED_VIEW_GRADES: {
      rosters: 'rosters_learner_detailed_view_grades',
      discussion_forums: 'forums_learner_detailed_view_grades',
    },
    LEARNER_DETAILED_VIEW_FORUM: {
      rosters: 'rosters_learner_detailed_view_forum',
      discussion_forums: 'forums_learner_detailed_view_forum',
    },
    LEARNER_ITEM_DETAILED_VIEW: {
      rosters: 'rosters_learner_item_detailed_view',
    },

    TEAMS: 'teams',
    TEAMS_AUTHOR: 'teams_author',
    TEAMS_AUTHOR_ACTIVITY_SETS: 'teams_author_activity_sets',
    TEAMS_AUTHOR_SUBMISSIONS: 'teams_author_submissions',

    /* Team Workspace Page */
    TEAM_WORKSPACE: 'team_workspace',

    /* Superuser */
    SUPERUSER: 'superuser',
    COURSE_SUPERUSER_AUTHOR_SETTINGS: 'course_superuser_author_settings',
    COURSE_AUTHOR_MENTORS: 'course_author_mentors',
    COURSE_SUPERUSER_AUTHOR_SESSIONS: 'course_superuser_author_sessions',
    COURSE_AUTHOR_PRICES: 'course_author_prices',
    COURSE_EXPERT_MODE: 'course_expert_mode',
    COURSE_FORUMS_EDITOR: 'course_forums_editor',
    COURSE_EXPERIMENTS_EDITOR: 'course_experiments_editor',
  },
};

export default constants;

export const { RouteNames } = constants;
