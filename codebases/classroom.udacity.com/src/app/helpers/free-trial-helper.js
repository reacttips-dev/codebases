import PaymentsHelper from 'helpers/payments-helper';
import StateHelper from 'helpers/state-helper';
import SubmissionStatus from 'constants/submission-status';
import moment from 'moment';

const canResubmitStatuses = [
    SubmissionStatus.UNSUBMITTED,
    SubmissionStatus.UNGRADEABLE,
    SubmissionStatus.FAILED,
    SubmissionStatus.ERRED,
    SubmissionStatus.CANCELED,
];

export const FREE_TRIAL_SUBMISSION_LIMIT = 3;

const FreeTrialHelper = {
    State: {
        isFreeTrial: (state, ndKey, today = moment()) => {
            const orderHistory = PaymentsHelper.State.getOrderHistory(state);
            const mostRecentOrder = PaymentsHelper.getMostRecentOrderForNdKey(
                orderHistory,
                ndKey
            );
            const orderEndDate = _.get(mostRecentOrder, 'period_end_date', today);
            return (
                _.get(mostRecentOrder, 'status') === 'trialing' &&
                today.isBefore(orderEndDate)
            );
        },

        numCompletedProjectsWhileTrialing: (state, ndKey, projectKey) => {
            const nanodegree = StateHelper.getNanodegree(state, ndKey);
            const nanodegreeProjects = Object.values(
                _.get(nanodegree, 'projects', {})
            );
            // Hydrate the full project from state, only a subset of project
            // properties are available in `nanodegree.projects`.
            const projects = nanodegreeProjects.map((project) =>
                StateHelper.getProject(state, project.key)
            );

            return projects.reduce((acc, p) => {
                if (
                    p.key === projectKey ?
                    canResubmitStatuses.includes(p.state) :
                    p.state === SubmissionStatus.UNSUBMITTED
                ) {
                    return acc;
                }
                return acc + 1;
            }, 0);
        },

        canSubmitProjectWhileTrialing: (state, ndKey, projectKey) => {
            const numCompletedProjects = FreeTrialHelper.State.numCompletedProjectsWhileTrialing(
                state,
                ndKey,
                projectKey
            );

            const projectsinND = state.projects;

            if (Object.keys(projectsinND).length === numCompletedProjects) {
                return false;
            }

            return numCompletedProjects < FREE_TRIAL_SUBMISSION_LIMIT;
        },

        numRemainingProjectsWhileTrialing: (state, ndKey, projectKey) => {
            const numCompletedProjects = FreeTrialHelper.State.numCompletedProjectsWhileTrialing(
                state,
                ndKey,
                projectKey
            );

            return FREE_TRIAL_SUBMISSION_LIMIT - numCompletedProjects;
        },

        getNextPaymentUrl: (state, ndKey) => {
            const orderHistory = PaymentsHelper.State.getOrderHistory(state);
            const mostRecentOrder = PaymentsHelper.getMostRecentOrderForNdKey(
                orderHistory,
                ndKey
            );
            return _.get(mostRecentOrder, 'next_payment.payment_url');
        },
    },
};

export default FreeTrialHelper;