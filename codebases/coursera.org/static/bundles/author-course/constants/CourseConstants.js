/**
 * Constants representing server and view actions for Course authoring.
 */
import _t from 'i18n!nls/author-course';

const exported = {
  Actions: {
    // Server Actions
    RECEIVE_COURSE: 'receiveCourse',
    SAVED_COURSE: 'savedCourse',
    PUBLISHED_COURSE: 'publishedCourse',
    CREATED_ITEM: 'createdItem',
    RECEIVE_CONFLICT_ERROR: 'receiveConflictError',
    RECEIVE_SAVE_ERROR: 'receiveSaveCourseError',
    RECEIVE_INSTRUCTORS: 'receiveCourseInstructors',
    RECEIVE_TEACHING_ASSISTANTS: 'receiveTeachingAssistants',
    RECEIVE_COURSE_ASSISTANTS: 'receiveCourseAssistants',
    RECEIVE_PARTNER_INSTRUCTORS: 'receivePartnerInstructors',
    RECEIVE_PARTNER_TEACHING_ASSISTANTS: 'receivePartnerTeachingAssistants',

    // View Actions
    REVERT_COURSE: 'revertCourse',
    CREATE_MODULE: 'createModule',
    REORDER_MODULE: 'reorderModule',
    UPDATE_MODULE_NAME: 'updateModuleName',
    UPDATE_MODULE_DESC: 'updateModuleDescription',
    UPDATE_MODULE_LEARNING_OBJECTIVES: 'updateModuleLearningObjectives',
    DELETE_MODULE: 'deleteModule',

    CREATE_LESSON: 'createLesson',
    UPDATE_LESSON_NAME: 'updateLessonName',
    DELETE_LESSON: 'deleteLesson',

    CONVERT_LESSON_TO_PASSABLE_ITEM_GROUP_CHOICE: 'convertLessonToPassableItemGroupChoice',

    CREATE_ITEM: 'createItem',
    DELETE_ITEM: 'deleteItem',

    UPDATE_COURSE_MATERIAL: 'updateCourseMaterial',

    UPDATE_MODULE_LESSONS: 'updateModuleLessons',
    UPDATE_ITEM_CONTAINER_ITEMS: 'updateItemContainerItems',

    UPDATE_COURSE_INFO: 'updateCourseInfo',
    UPDATE_COURSE_METADATA: 'updateCourseMetadata',
    UPDATE_COURSE_SESSIONS_ENABLED_AT: 'updateCourseSessionsEnabledAt',

    DELETE_SESSION_SCHEDULE: 'deleteSessionSchedule',
    UPDATE_SESSION_SCHEDULE: 'updateSessionSchedule',

    ADD_INSTRUCTORS: 'addInstructors',
    REMOVE_INSTRUCTOR: 'removeInstructor',
    UPDATE_INSTRUCTOR: 'updateInstructor',

    ADD_TEACHING_ASSISTANTS: 'addTeachingAssistants',
    REMOVE_TEACHING_ASSISTANT: 'removeTeachingAssistant',

    ADD_COURSE_ASSISTANTS: 'addCourseAssistants',
    REMOVE_COURSE_ASSISTANT: 'removeCourseAssistant',

    // Save State
    UPDATE_SAVE_STATE: 'updateAuthoringState',
  },
};

export default exported;

export const { Actions } = exported;
