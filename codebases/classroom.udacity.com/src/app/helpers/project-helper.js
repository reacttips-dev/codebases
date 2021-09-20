import DateHelper from 'helpers/date-helper';
import {
    IconWarning
} from '@udacity/veritas-icons';
import SubmissionStatus from 'constants/submission-status';
import {
    __
} from 'services/localization-service';
import moment from 'moment';

// project results (separate from status)
const INCOMPLETE = 'INCOMPLETE';
const PASSED = 'PASSED';
const DISTINCTION = 'DISTINCTION';
const CANCELED = 'CANCELED';
const UNGRADEABLE = 'UNGRADEABLE';

// link/href types for rendering button in _project/_footer.jsx
const LINKS = {
    CHECKOUT: 'checkoutLink',
    REVIEW: 'reviewsLink',
    TERMINAL: 'terminalLaunchForm',
};

// ungradeable tags
const PLAGIARISM = 'plagiarism';

const PROJECT_RESULT_LABELS = {
    get [INCOMPLETE]() {
        return __('Did not meet specifications');
    },
    get [PASSED]() {
        return __('Met specifications');
    },
    get [DISTINCTION]() {
        return __('Exceeded specifications');
    },
};

const PROJECT_LINKS = {
    get ERRED() {
        return {
            status: ( <
                span >
                <
                IconWarning color = "red" / >
                &
                nbsp; {
                    __(
                        'An error occurred while trying to submit your project. Please try again.'
                    )
                } <
                /span>
            ),
            links: [{
                text: __('Resubmit'),
                type: LINKS.REVIEW,
                state: SubmissionStatus.FAILED,
            }, ],
            isError: true,
        };
    },
    get CANCELED() {
        return {
            status: __('You canceled your last submission.'),
            links: [{
                text: __('Resubmit'),
                type: LINKS.REVIEW,
                state: SubmissionStatus.CANCELED,
            }, ],
        };
    },
    get IN_REVIEW() {
        return {
            status: '',
            links: [{
                text: __('View Submission'),
                type: LINKS.REVIEW,
                state: SubmissionStatus.IN_REVIEW,
            }, ],
        };
    },
    get FAILED_CLASSIC() {
        return {
            status: __('Keep it up! View the feedback and iterate on your work'),
            links: [{
                text: __('View and Resubmit'),
                type: LINKS.REVIEW,
                state: SubmissionStatus.FAILED,
            }, ],
        };
    },
    get FAILED() {
        return {
            status: __('Keep it up!'),
            links: [{
                    text: __('View Feedback'),
                    type: LINKS.REVIEW,
                },
                {
                    text: __('Continue Project'),
                    type: LINKS.TERMINAL,
                    state: SubmissionStatus.FAILED,
                },
            ],
        };
    },
    get PASSED() {
        return {
            status: ( <
                span >
                <
                span className = "glyphicon glyphicon-ok" / >
                &
                nbsp; {
                    __("Congratulations! You've completed this project")
                } <
                /span>
            ),
            links: [{
                text: __('View Submission'),
                type: LINKS.REVIEW,
                state: SubmissionStatus.PASSED,
            }, ],
        };
    },
    get UNSUBMITTED_CLASSIC() {
        return {
            status: __('You have not submitted the project yet'),
            links: [{
                text: __('Submit Project'),
                type: LINKS.REVIEW,
                state: SubmissionStatus.UNSUBMITTED,
            }, ],
        };
    },
    get UNSUBMITTED() {
        return {
            status: '',
            links: [{
                text: __('Begin Project'),
                type: LINKS.TERMINAL,
                state: SubmissionStatus.UNSUBMITTED,
            }, ],
        };
    },
    get CAREER_SERVICE() {
        return {
            status: '',
            links: [{
                text: __('Submit Project'),
                type: LINKS.REVIEW,
                state: SubmissionStatus.UNSUBMITTED,
            }, ],
        };
    },
    get COMPLETED_FREE_TRIAL() {
        return {
            status: '',
            links: [{
                text: __('Purchase'),
                type: LINKS.CHECKOUT,
                state: SubmissionStatus.PASSED,
            }, ],
        };
    },
};

const TERMINAL_URL =
    'https://www.udacityterminal.com/udacity/api/terminal/link';

const ProjectHelper = {
    getCurrentSubmission(project) {
        const projectState = _.get(project, 'project_state', {});
        if (_.isEmpty(projectState) || _.isEmpty(projectState.submissions)) {
            return null;
        }

        return _.first(
            _.sortBy(
                projectState.submissions,
                (s) => -new Date(s.created_at).getTime()
            )
        );
    },

    isProjectStateLoaded(project) {
        return _.has(project, 'project_state');
    },

    getStatus(project) {
        const submission = ProjectHelper.getCurrentSubmission(project);
        return submission ?
            submission.status :
            _.get(project, 'project.state', 'unsubmitted');
    },

    getResult(project) {
        const submission = ProjectHelper.getCurrentSubmission(project);
        return submission && submission.result;
    },

    getResultLabel(project) {
        return PROJECT_RESULT_LABELS[ProjectHelper.getResult(project)];
    },

    getStatusLabel(project) {
        if (!ProjectHelper.isSubmitted(project)) {
            return __('Not Started');
        }

        return ProjectHelper.getResultLabel(project) || 'Awaiting Review';
    },

    getSubmitProjectUrl(project) {
        // EXP-244: Projects should pin the rubric ID for their current
        // rubric, but backcompat will be supported. (Projects URLs with no
        // rubric set will redirect to the earliest-created rubric for the
        // project.)
        if (project.rubric_id) {
            return `${CONFIG.reviewsUrl}/#!/rubrics/${project.rubric_id}/start`;
        } else {
            return `${CONFIG.reviewsUrl}/#!/projects/${project.progress_key}`;
        }
    },

    getCurrentSubmissionUrl(project) {
        const submission = ProjectHelper.getCurrentSubmission(project);
        return submission && submission.url;
    },

    isUnsubmitted(project) {
        return ProjectHelper.getStatus(project) === SubmissionStatus.UNSUBMITTED;
    },

    isSubmitted(project) {
        const submission = ProjectHelper.getCurrentSubmission(project);
        if (ProjectHelper.isLegacySubmission(submission)) {
            return true;
        } else {
            return !!ProjectHelper.getCurrentSubmissionUrl(project);
        }
    },

    isInReview(project) {
        return _.includes(
            [
                SubmissionStatus.IN_REVIEW,
                SubmissionStatus.DELAYING_REVIEW,
                SubmissionStatus.PROCESSING,
                SubmissionStatus.ESCALATED,
            ],
            ProjectHelper.getStatus(project)
        );
    },

    isEscalated(project) {
        return ProjectHelper.getStatus(project) === SubmissionStatus.ESCALATED;
    },

    isCompleted(project) {
        return _.includes([PASSED, DISTINCTION], ProjectHelper.getResult(project));
    },

    isCanceled(project) {
        return (
            ProjectHelper.getResult(project) === CANCELED ||
            ProjectHelper.getStatus(project) === SubmissionStatus.CANCELED
        );
    },

    isLegacySubmission(submission) {
        return submission && submission.is_legacy;
    },

    isErred(project) {
        return ProjectHelper.getStatus(project) === SubmissionStatus.ERRED;
    },

    isFailed(project) {
        // Escalated projects should be considerd as "In review", even if they
        // have an "Ungradeable" result.
        // for all projects apart from career services, incomplete and ungradeable
        // are still treated the same way.
        return (!ProjectHelper.isEscalated(project) &&
            _.includes([INCOMPLETE, UNGRADEABLE], ProjectHelper.getResult(project))
        );
    },

    isExceeded(project) {
        return ProjectHelper.getResult(project) === DISTINCTION;
    },

    isPastDue(project) {
        const dueAt = _.get(project, 'due_at', '');
        return (
            moment().isAfter(moment(dueAt)) &&
            (ProjectHelper.isUnsubmitted(project) ||
                ProjectHelper.isCanceled(project))
        );
    },

    isUngradeable(project) {
        return ProjectHelper.getResult(project) === UNGRADEABLE;
    },

    isFlaggedForPlagiarism(project) {
        const submission = ProjectHelper.getCurrentSubmission(project);
        return _.get(submission, 'ungradeable_tag') === PLAGIARISM;
    },

    isUngradeableCareerService(project, isCareerService) {
        // an ungradeable career service must be handled differently from an incomplete career service:
        // ungradeable means the user can resubmit without repurchasing. incomplete is considered feedback,
        // and the user must repurchase in order to get another review.
        // the UNGRADEABLE value has been added to the result field for gae_submissions
        return isCareerService && ProjectHelper.getResult(project) === UNGRADEABLE;
    },

    isCompletedCareerService(project, isCareerService) {
        return (
            isCareerService &&
            _.includes([PASSED, INCOMPLETE], ProjectHelper.getResult(project))
        );
    },

    isReviewedOrReviewing(project) {
        const isReviewActive = _.includes(
            [
                SubmissionStatus.IN_REVIEW,
                SubmissionStatus.PROCESSING,
                SubmissionStatus.ESCALATED,
            ],
            ProjectHelper.getStatus(project)
        );
        return (
            isReviewActive ||
            ProjectHelper.isCompleted(project) ||
            ProjectHelper.isFailed(project)
        );
    },

    getSubmittedAtDate(project) {
        const submission = ProjectHelper.getCurrentSubmission(project);
        return _.get(submission, 'created_at', '');
    },

    getReviewedOrCanceledAtDate(project) {
        const submission = ProjectHelper.getCurrentSubmission(project);
        return _.get(submission, 'updated_at', '');
    },

    canCancel(project) {
        return (
            ProjectHelper.isSubmitted(project) &&
            !ProjectHelper.isReviewedOrReviewing(project) &&
            !ProjectHelper.isErred(project) &&
            !ProjectHelper.isCanceled(project)
        );
    },

    getReviewsUrl(project, isCareerService) {
        if (ProjectHelper.isCompletedCareerService(project, isCareerService)) {
            return ProjectHelper.getSubmitProjectUrl(project);
        } else if (ProjectHelper.isErred(project)) {
            return ProjectHelper.getSubmitProjectUrl(project);
        } else {
            return ProjectHelper.isSubmitted(project) &&
                !ProjectHelper.isCanceled(project) ?
                ProjectHelper.getCurrentSubmissionUrl(project) :
                ProjectHelper.getSubmitProjectUrl(project);
        }
    },

    getProjectLinks(project, isCareerService, isCompletedFreeTrial) {
        let links;

        if (ProjectHelper.isCompletedCareerService(project, isCareerService)) {
            links = PROJECT_LINKS.CAREER_SERVICE;
        } else if (isCompletedFreeTrial) {
            links = PROJECT_LINKS.COMPLETED_FREE_TRIAL;
        } else if (
            ProjectHelper.isUngradeableCareerService(project, isCareerService)
        ) {
            links = PROJECT_LINKS.IN_REVIEW;
        } else if (ProjectHelper.isCanceled(project)) {
            links = PROJECT_LINKS.CANCELED;
        } else if (ProjectHelper.isErred(project)) {
            links = PROJECT_LINKS.ERRED;
        } else if (ProjectHelper.isInReview(project)) {
            links = PROJECT_LINKS.IN_REVIEW;
        } else if (ProjectHelper.isFailed(project)) {
            if (!project.terminal_project_id) {
                links = PROJECT_LINKS.FAILED_CLASSIC;
            } else {
                links = PROJECT_LINKS.FAILED;
            }
        } else if (ProjectHelper.isSubmitted(project)) {
            links = PROJECT_LINKS.PASSED;
        } else {
            if (!project.terminal_project_id) {
                links = PROJECT_LINKS.UNSUBMITTED_CLASSIC;
            } else {
                links = PROJECT_LINKS.UNSUBMITTED;
            }
        }

        return links;
    },

    getTerminalUrl() {
        return TERMINAL_URL;
    },

    getFirstUnsubmittedProject(projects) {
        return _.find(projects, (project) => !ProjectHelper.isSubmitted(project));
    },

    getFirstFailedProject(projects) {
        return _.find(projects, (project) => ProjectHelper.isFailed(project));
    },

    getProjectDueAt(nanodegree, progressKey) {
        return _.chain(nanodegree)
            .get('project_deadlines')
            .find({
                progress_key: progressKey
            })
            .get('due_at')
            .value();
    },

    pluralizeprojectCount: (projectCount) => {
        switch (projectCount) {
            case 0:
                return null;
            case 1:
                return '1 Project';
            default:
                return `${projectCount} Projects`;
        }
    },

    areAllCompleted(projects) {
        return _.every(projects, (p) => ProjectHelper.isCompleted(p));
    },

    areAllSubmitted(projects) {
        return _.every(projects, (p) => ProjectHelper.isSubmitted(p));
    },

    getAllProjects(parts) {
        return _.chain(parts)
            .flatMap('modules')
            .flatMap('lessons')
            .filter((lesson) => lesson.is_project_lesson)
            .map((lesson) => {
                return _.assign({}, lesson.project, {
                    key: lesson.key
                });
            })
            .value();
    },

    getFirstProject(parts) {
        const projects = ProjectHelper.getAllProjects(parts);
        return _.first(projects);
    },

    isProjectCompletedInLastNumDays(project, numDays) {
        const dateReviewed = ProjectHelper.getReviewedOrCanceledAtDate(project);
        const daysSinceReview = DateHelper.getDaysSince(dateReviewed);
        return ProjectHelper.isCompleted(project) && daysSinceReview <= numDays;
    },

    isFirstProjectCompletedInLastNumDays(nanodegree, numDays) {
        const firstProject = ProjectHelper.getFirstProject(nanodegree.parts);
        return (
            firstProject &&
            ProjectHelper.isProjectCompletedInLastNumDays(firstProject, numDays)
        );
    },
};

export default ProjectHelper;