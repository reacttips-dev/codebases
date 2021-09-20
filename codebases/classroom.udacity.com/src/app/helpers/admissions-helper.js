import {
    __
} from 'services/localization-service';
import dateHelper from 'helpers/date-helper';
import moment from 'moment';

export const ApplicationStatuses = {
    PRE_SUBMIT: 'pre_submit',
    IN_REVIEW: 'in_review',
    EDIT_SUBMIT: 'edit_submit',
    ACCEPTED: 'accept',
    REJECTED: 'reject',
};

const AdmissionsHelper = {
    getCompletionString(application) {
        const responses = {
            get [ApplicationStatuses.PRE_SUBMIT]() {
                return __('In Progress');
            },
            get [ApplicationStatuses.IN_REVIEW]() {
                return __('In Review');
            },
            get [ApplicationStatuses.EDIT_SUBMIT]() {
                return __('Complete');
            },
            get [ApplicationStatuses.ACCEPTED]() {
                return __('Accepted');
            },
            get [ApplicationStatuses.REJECTED]() {
                return __('Not Accepted');
            },
        };

        return responses[application.status] || '';
    },

    getButtonText(status) {
        const buttonOptions = {
            get [ApplicationStatuses.ACCEPTED]() {
                return __('Get Started');
            },
            get [ApplicationStatuses.PRE_SUBMIT]() {
                return __('Complete and Submit');
            },
            get [ApplicationStatuses.EDIT_SUBMIT]() {
                return __('View and Edit');
            },
            get [ApplicationStatuses.REJECTED]() {
                return __('More Info');
            },
        };

        return buttonOptions[status] || '';
    },

    getDueString(application) {
        const {
            cohort,
            status
        } = application;

        switch (status) {
            case ApplicationStatuses.IN_REVIEW:
                return ( <
                    p styleName = "due-text" > {
                        __(
                            'Application in review, acceptances announced by email on <%= date %>', {
                                date: moment(cohort.notify_at).format('MMMM Do')
                            }
                        )
                    } <
                    /p>
                );

            case ApplicationStatuses.ACCEPTED:
                return ( <
                    p styleName = "due-text" > {
                        __('Congratulations! Your application has been accepted!')
                    } <
                    /p>
                );

            case ApplicationStatuses.PRE_SUBMIT:
            case ApplicationStatuses.EDIT_SUBMIT:
                const dueStyle =
                    moment().diff(cohort.close_at, 'days') < 4 ?
                    'due-text' :
                    'due-warning';
                const daysLeft = dateHelper.getDaysLeftUntil(cohort.close_at);
                return daysLeft ? ( <
                    p styleName = {
                        dueStyle
                    } > {
                        __('Application due <%= days %>', {
                            days: daysLeft
                        })
                    } <
                    /p>
                ) : ( <
                    p styleName = {
                        dueStyle
                    } > {
                        __('Deadline passed')
                    } < /p>
                );

            case ApplicationStatuses.REJECTED:
            default:
                return null;
        }
    },

    getRedirectUrl(application) {
        const isAccepted = application.status === ApplicationStatuses.ACCEPTED;
        const isConnectCohort = _.get(application, 'cohort.type') === 'connect';
        const appUrl = _.get(application, 'cohort.url', application.degree_id);
        const applyUrl = `${CONFIG.admissionsUrl}/apply/${appUrl}`;
        if (isAccepted && !isConnectCohort) {
            return _.get(application, 'cohort.payment_url', applyUrl);
        }
        return applyUrl;
    },

    canViewApplication(application) {
        const {
            cohort,
            status
        } = application;
        const isBeforeDeadline = !!dateHelper.getDaysLeftUntil(cohort.close_at);
        const canViewStatuses = [
            ApplicationStatuses.EDIT_SUBMIT,
            ApplicationStatuses.PRE_SUBMIT,
        ];
        return canViewStatuses.includes(status) && isBeforeDeadline;
    },

    hasAdmissionsDecision(application) {
        const decisionStatuses = [
            ApplicationStatuses.ACCEPTED,
            ApplicationStatuses.REJECTED,
        ];

        return decisionStatuses.includes(application.status);
    },
};

export default AdmissionsHelper;