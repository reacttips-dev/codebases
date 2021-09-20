import {
    ASSESSMENT_STATUS
} from 'helpers/assessment-helper';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import _ from 'lodash';
import moment from 'moment';

export function getAdjustedDeadlines(assessments, deadlineAdjustment) {
    return assessments
        .filter(
            (a) =>
            ![ASSESSMENT_STATUS.DONE, ASSESSMENT_STATUS.IN_REVIEW].includes(
                a.status
            )
        )
        .map((a) => ({
            progress_key: a.progress_key,
            due_at: moment(a.due_at).add(deadlineAdjustment.weeks, 'w').toISOString(),
        }));
}

export function getAdjustableDeadlinesExperimentAttributes(nanodegree) {
    return {
        isCN: NanodegreeHelper.isCNDegree(nanodegree),
        isOMAC: NanodegreeHelper.isOMACv2(nanodegree),
        isMena: NanodegreeHelper.isMena(nanodegree),
        isEnterprise: NanodegreeHelper.isEnterprise(nanodegree),
        isScholarship: NanodegreeHelper.isScholarship(nanodegree),
        isConnect: NanodegreeHelper.isConnect(nanodegree),
    };
}

export function isEligibleForAdjustableDeadlinesExperiment(nanodegree) {
    return _.isEqual(getAdjustableDeadlinesExperimentAttributes(nanodegree), {
        isCN: false,
        isEnterprise: false,
        isMena: false,
        isOMAC: false,
        isScholarship: false,
        isConnect: false,
    });
}

export function getAssessmentSegmentProperties(assessment) {
    return {
        nodeKey: assessment.key,
        dueAt: assessment.due_at,
        pastDue: moment(assessment.due_at).isBefore(moment()),
        status: assessment.status,
        submissionCount: assessment.project_state.submissions.length,
    };
}