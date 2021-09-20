import {
    LESSON_TYPES
} from 'constants/lesson';
import LabHelper from 'helpers/lab-helper';
import NodeHelper from 'helpers/node-helper';
import ProjectHelper from 'helpers/project-helper';
import SemanticTypes from 'constants/semantic-types';

const LessonHelper = {
    getFirstConceptKey(lesson) {
        return (lesson._concepts_keys || [])[0];
    },

    getConceptsCount(lesson) {
        return (lesson._concepts_keys || []).length;
    },

    getConceptPosition(lesson, concept) {
        return _.indexOf(lesson._concepts_keys || [], concept.key);
    },

    getLessonType(lesson) {
        return (
            (lesson.project && LESSON_TYPES.PROJECT) ||
            (lesson.lab && LESSON_TYPES.LAB) ||
            LESSON_TYPES.DEFAULT
        );
    },

    isAssessmentLesson(lesson) {
        return !_.isEmpty(lesson.project) || !_.isEmpty(lesson.lab);
    },

    getProjectsFromLessons(lessons) {
        return _.chain(lessons).map('project').compact().value();
    },

    getLabsFromLessons(lessons) {
        return _.chain(lessons).map('lab').compact().value();
    },

    getAssessmentsFromLessons(lessons) {
        return _.chain(lessons)
            .map((lesson) => lesson.lab || lesson.project)
            .compact()
            .value();
    },

    isCompleted(lesson) {
        if (lesson.project) {
            return ProjectHelper.isCompleted(lesson.project);
        } else if (lesson.lab) {
            return LabHelper.reviewCompleted(lesson.lab);
        } else if (lesson.semantic_type === SemanticTypes.PROJECT) {
            return _.isEqual(lesson.state, 'completed');
        }
        return NodeHelper.isCompleted(lesson);
    },

    isDisplayWorkspaceProjectOnly(lesson) {
        return Boolean(lesson && lesson.display_workspace_project_only);
    },
};

export default LessonHelper;