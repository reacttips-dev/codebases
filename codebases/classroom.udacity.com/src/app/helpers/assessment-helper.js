import DateHelper from 'helpers/date-helper';
import LabHelper from 'helpers/lab-helper';
import LessonHelper from 'helpers/lesson-helper';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import PartHelper from 'helpers/part-helper';
import ProjectHelper from 'helpers/project-helper';
import SemanticTypes from 'constants/semantic-types';
import _ from 'lodash';
import invariant from 'invariant';
import moment from 'moment';

export const ASSESSMENT_STATUS = {
    DONE: 'DONE',
    IN_REVIEW: 'IN_REVIEW',
    PAST_DUE: 'PAST_DUE',
    FEEDBACK_AVAILABLE: 'FEEDBACK_AVAILABLE',
    ON_TRACK: 'ON_TRACK',
    ERRED: 'ERRED',
};

export default {
    validateAssessmentType(assessment) {
        invariant(
            assessment.semantic_type === SemanticTypes.PROJECT ||
            assessment.semantic_type === SemanticTypes.LAB,
            'Not a valid assessment type'
        );
    },

    isSubmitted(assessment) {
        this.validateAssessmentType(assessment);
        if (assessment.semantic_type === SemanticTypes.PROJECT) {
            return ProjectHelper.isSubmitted(assessment);
        } else if (assessment.semantic_type === SemanticTypes.LAB) {
            return LabHelper.reviewCompleted(assessment);
        }
    },

    getDisplayNumberForAssessments(originalAssessments) {
        const {
            assessments
        } = _.reduce(
            originalAssessments,
            ({
                assessments,
                projectDisplayNumber,
                labDisplayNumber
            }, assessment) => {
                if (SemanticTypes.isProject(assessment)) {
                    return {
                        assessments: [
                            ...assessments,
                            {
                                ...assessment,
                                displayNumber: projectDisplayNumber,
                            },
                        ],
                        projectDisplayNumber: projectDisplayNumber + 1,
                        labDisplayNumber,
                    };
                } else {
                    return {
                        assessments: [
                            ...assessments,
                            {
                                ...assessment,
                                displayNumber: labDisplayNumber,
                            },
                        ],
                        projectDisplayNumber,
                        labDisplayNumber: labDisplayNumber + 1,
                    };
                }
            }, {
                assessments: [],
                projectDisplayNumber: 1,
                labDisplayNumber: 1,
            }
        );

        return assessments;
    },

    getAssessmentsForCurrentCohort(nanodegree) {
        return _.chain(nanodegree.parts)
            .filter((part) => {
                return PartHelper.isCore(part);
            })
            .map(PartHelper.getLessons)
            .flatten()
            .compact()
            .filter(LessonHelper.isAssessmentLesson)
            .value();
    },

    getAssessmentStatus(assessment) {
        switch (true) {
            case ProjectHelper.isErred(assessment):
                return ASSESSMENT_STATUS.ERRED;
            case ProjectHelper.isCompleted(assessment) ||
            LabHelper.isPassed(assessment):
                return ASSESSMENT_STATUS.DONE;
            case ProjectHelper.isFailed(assessment):
                return ASSESSMENT_STATUS.FEEDBACK_AVAILABLE;
            case ProjectHelper.isInReview(assessment):
                return ASSESSMENT_STATUS.IN_REVIEW;
            case DateHelper.pastToday(assessment.due_at):
                return ASSESSMENT_STATUS.PAST_DUE;
            default:
                return ASSESSMENT_STATUS.ON_TRACK;
        }
    },

    calculateLastAssessmentDeadline(assessments, nanodegree) {
        const finalAssessment = _.last(assessments);
        return this.getDueAt(finalAssessment, nanodegree);
    },

    getDueAt(assessment, nanodegree, offset = {
        weeks: 0
    }) {
        const deadline = NanodegreeHelper.isOMACv2(nanodegree) ?
            this.getOmacV2LabDeadline(assessment, nanodegree) :
            _.get(assessment, 'due_at');

        if (!deadline) {
            return deadline;
        }

        const offsetDeadline = moment(deadline).add(offset.weeks || 0, 'w');
        return DateHelper.formatSuperShort(offsetDeadline);
    },

    getOmacV2LabDeadline(assessment, nanodegree) {
        const enrollmentStartDate = NanodegreeHelper.getEnrollmentStartDate(
            nanodegree
        );
        return DateHelper.getOmacLabDueDate(enrollmentStartDate, assessment);
    },
};