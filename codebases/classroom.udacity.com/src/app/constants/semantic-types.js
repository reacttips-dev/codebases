const SemanticTypes = {
    NANODEGREE: 'Degree',
    POPULARND: 'Popular Degree',
    COURSE: 'Course',
    PART: 'Part',
    PROJECT: 'Project',
    MODULE: 'Module',
    LAB: 'Lab',
    LESSON: 'Lesson',
    CONCEPT: 'Concept',
    IMAGE_ATOM: 'ImageAtom',
    TEXT_ATOM: 'TextAtom',
    QUIZ_ATOM: 'QuizAtom',
    CHECKBOX_QUIZ_ATOM: 'CheckboxQuizAtom',
    MATCHING_QUIZ_ATOM: 'MatchingQuizAtom',
    RADIO_QUIZ_ATOM: 'RadioQuizAtom',
    VIDEO_ATOM: 'VideoAtom',
    WORKSPACE_ATOM: 'WorkspaceAtom',
    TASKLIST_ATOM: 'TaskListAtom',
    EMBEDDED_FRAME_ATOM: 'EmbeddedFrameAtom',
    VALIDATED_QUIZ_ATOM: 'ValidatedQuizAtom',
    REFLECT_ATOM: 'ReflectAtom',

    isNanodegree(node) {
        return _.get(node, 'semantic_type') === SemanticTypes.NANODEGREE;
    },

    isPopularND(node) {
        return _.get(node, 'semantic_type') === SemanticTypes.POPULARND;
    },

    isCourse(node) {
        return _.get(node, 'semantic_type') === SemanticTypes.COURSE;
    },

    isPart(node) {
        return _.get(node, 'semantic_type') === SemanticTypes.PART;
    },

    isModule(node) {
        return _.get(node, 'semantic_type') === SemanticTypes.MODULE;
    },

    isLesson(node) {
        return _.get(node, 'semantic_type') === SemanticTypes.LESSON;
    },

    isConcept(node) {
        return _.get(node, 'semantic_type') === SemanticTypes.CONCEPT;
    },

    isProject(node) {
        return _.get(node, 'semantic_type') === SemanticTypes.PROJECT;
    },

    isLab(node) {
        return _.get(node, 'semantic_type') === SemanticTypes.LAB;
    },

    isTextAtom(node) {
        return _.get(node, 'semantic_type') === SemanticTypes.TEXT_ATOM;
    },

    isVideoAtom(node) {
        return _.get(node, 'semantic_type') === SemanticTypes.VIDEO_ATOM;
    },

    isQuizAtom(node) {
        return _.get(node, 'semantic_type') === SemanticTypes.QUIZ_ATOM;
    },

    isWorkspaceAtom(node) {
        return _.get(node, 'semantic_type') === SemanticTypes.WORKSPACE_ATOM;
    },

    isOneOf(node, types) {
        return _.some(
            types,
            (typeToCheck) => _.get(node, 'semantic_type') === typeToCheck
        );
    },
};

export default SemanticTypes;