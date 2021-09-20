import {
    ENROLLMENT_STATES,
    PRODUCT_VARIANT
} from 'constants/nanodegree';
import FunctionHelper from 'helpers/function-helper';
import LessonHelper from 'helpers/lesson-helper';
import NodeHelper from 'helpers/node-helper';
import PartHelper from 'helpers/part-helper';
import StateHelper from 'helpers/state-helper';
import VersionPickerHelper from 'helpers/version-picker-helper';
import {
    i18n
} from 'services/localization-service';
import moment from 'moment';

const NanodegreeHelper = {
    State: {
        getLastViewedPart: FunctionHelper.requireAllArgs(function(
            state,
            nanodegree
        ) {
            return StateHelper.getPart(
                state,
                NodeHelper.getLastViewedChildKey(nanodegree)
            );
        }),

        getLastViewedModule: FunctionHelper.requireAllArgs(function(
                state,
                nanodegree
            ) {
                var lastViewedPart = NanodegreeHelper.State.getLastViewedPart(
                    state,
                    nanodegree
                );

                if (lastViewedPart) {
                    return StateHelper.getModule(
                        state,
                        NodeHelper.getLastViewedChildKey(lastViewedPart)
                    );
                }
            },
            2),

        getLastViewedLesson: FunctionHelper.requireAllArgs(function(
            state,
            nanodegree
        ) {
            var lastViewedModule = NanodegreeHelper.State.getLastViewedModule(
                state,
                nanodegree
            );

            if (lastViewedModule) {
                return StateHelper.getLesson(
                    state,
                    NodeHelper.getLastViewedChildKey(lastViewedModule)
                );
            } else {
                return null;
            }
        }),

        getLastViewedModuleForPart: FunctionHelper.requireAllArgs(function(
            state,
            part
        ) {
            return StateHelper.getModule(
                state,
                NodeHelper.getLastViewedChildKey(part)
            );
        }),

        getLastViewedLessonForModule: FunctionHelper.requireAllArgs(function(
            state,
            module
        ) {
            return StateHelper.getLesson(
                state,
                NodeHelper.getLastViewedChildKey(module)
            );
        }),

        getLastViewedLessonForPart: FunctionHelper.requireAllArgs(function(
            state,
            part
        ) {
            const lastViewedModule = NanodegreeHelper.State.getLastViewedModuleForPart(
                state,
                part
            );

            if (lastViewedModule) {
                return StateHelper.getLesson(
                    state,
                    NodeHelper.getLastViewedChildKey(lastViewedModule)
                );
            } else {
                return null;
            }
        }),

        getCompletedCorePartsIndices: FunctionHelper.requireAllArgs(function(
            state,
            nanodegree
        ) {
            var parts = StateHelper.getPartsByNanodegreeKey(state, nanodegree.key);
            var coreParts = PartHelper.getCoreParts(nanodegree, parts);
            var completedPartsIndices = [];

            _.forEach(coreParts, (part, index) => {
                const lessons = StateHelper.getLessonsByPartKey(state, part.key);
                const projects = LessonHelper.getProjectsFromLessons(lessons);

                if (PartHelper.metRequirements({
                        part,
                        projects
                    })) {
                    completedPartsIndices.push(index);
                }
            });
            return completedPartsIndices;
        }),

        getCoreParts: FunctionHelper.requireAllArgs(function(state, nanodegree) {
            var parts = StateHelper.getPartsByNanodegreeKey(state, nanodegree.key);
            return _.filter(parts, (part) => PartHelper.isCore(part));
        }),

        getCorePartsCount: FunctionHelper.requireAllArgs(function(
            state,
            nanodegree
        ) {
            var coreParts = NanodegreeHelper.State.getCoreParts(state, nanodegree);
            return coreParts.length;
        }),

        getCorePartPosition: FunctionHelper.requireAllArgs(function(
            state,
            nanodegree,
            part
        ) {
            var coreParts = NanodegreeHelper.State.getCoreParts(state, nanodegree);
            return _.indexOf(coreParts, part);
        }),

        getLaunchedCloudResource: (state, ndKey) =>
            _.get(state, ['nanodegrees', ndKey, 'launchedCloudResource']),

        isLaunchingCloudResource: (state, ndKey) =>
            !!_.get(state, ['nanodegrees', ndKey, 'isLaunchingCloudResource']),

        getCloudResourcesServiceId: (state, ndKey) =>
            _.get(
                state, ['nanodegrees', ndKey, 'cloud_resources_aws_service_id'],
                null
            ),
    },

    getFirstPartKey(nanodegree) {
        return _.get(nanodegree, '_parts_keys[0]');
    },

    getPartsCount(nanodegree) {
        return _.get(nanodegree, '_parts_keys.length');
    },

    getUnlockedProjects(nanodegree) {
        return _.chain(nanodegree.parts)
            .reject(PartHelper.isLocked)
            .flatMap((part) => PartHelper.getProjects(part))
            .value();
    },

    getPartPosition(nanodegree, part) {
        return _.indexOf(_.get(nanodegree, '_parts_keys', []), part.key);
    },

    getProjectDueAt(nanodegree, project) {
        var deadline = _.find(
            _.get(nanodegree, 'project_deadlines'),
            (deadline) => deadline.progress_key === _.get(project, 'progress_key')
        );
        return new Date(_.get(deadline, 'due_at', null));
    },

    isTermBased(root) {
        return Boolean((root || {}).is_term_based);
    },

    isGoogleCertsND(nanodegree) {
        return _.get(nanodegree, 'key') === 'nd818';
    },

    providesSupport(nanodegree) {
        const key = _.get(nanodegree, 'key');
        const ndsWithoutSuppport = ['nd114', 'nd116'];
        return !_.includes(ndsWithoutSuppport, key);
    },

    isCareerND(nanodegree) {
        return (
            _.get(nanodegree, 'enrollment.product_variant') === PRODUCT_VARIANT.PLUS
        );
    },

    getStaticAccessExpiryDate(nanodegree) {
        return _.get(nanodegree, 'enrollment.static_access.access_expiry_at');
    },

    /**
     * China only trial Nanodegrees follow the pattern ndxxx-cn-xxx-trial
     * for example, nd002-cn-basic-trial, nd002-cn-advanced-trial.
     */
    isCNTrialDegree(nanodegree) {
        return /^nd\d+-cn(-\w+)?-trial$/.test(_.get(nanodegree, 'key'));
    },

    isCNDegree(nanodegree) {
        return _.includes(_.get(nanodegree, 'key'), '-cn');
    },

    isOMACv2: (nanodegree) => {
        return _.includes(_.get(nanodegree, 'key'), '1mac-v2');
    },

    isNFP1: (nanodegree) => {
        return _.includes(_.get(nanodegree, 'key'), 'mena-nfp1');
    },

    isMena: (nanodegree) => {
        return !!_.get(nanodegree, 'key', '').match(/\-mena(-.*)?$/);
    },

    isMenaChallenge: (nanodegree) => {
        return _.includes(_.get(nanodegree, 'key'), '-challenge');
    },

    getNanodegreeTitle(nanodegree) {
        return _.trim(_.get(nanodegree, 'title', '').replace(/nanodegree/i, ''));
    },

    getUpgradeNDKey(nanodegree) {
        // TODO: Come up with a better way to do this in the future
        return nanodegree.key.replace('-ptrial', '');
    },

    getNanodegrees(state) {
        return Object.values(_.get(state, 'nanodegrees', {})) || [];
    },

    getCohorts(nanodegree) {
        return _.chain(nanodegree)
            .get('cohorts', [])
            .orderBy((cohort) => new Date(cohort.start_at), ['asc'])
            .value();
    },

    getCurrentCohort(nanodegree) {
        return _.last(NanodegreeHelper.getCohorts(nanodegree));
    },
    isTermEnded(nanodegree = {}) {
        const cohort = NanodegreeHelper.getCurrentCohort(nanodegree);
        return (
            nanodegree.is_term_based && cohort && moment().isAfter(cohort.end_at)
        );
    },
    isGraduated(nanodegree) {
        return _.get(nanodegree, 'is_graduated', false);
    },

    isReadyToGraduate(nanodegree) {
        return _.get(nanodegree, 'is_ready_for_graduation', false);
    },

    isOpenEndedCohort(nanodegree) {
        return _.get(nanodegree, 'enrollment.open_ended', false);
    },

    isPreOrder(nanodegree) {
        return _.get(nanodegree, 'enrollment.preorder', false);
    },

    isHighTouch(nanodegree) {
        return _.get(nanodegree, 'enrollment.high_touch', false);
    },

    isStatic(nanodegree) {
        const versionLocale = VersionPickerHelper.getVersionLocaleFromSessionStorage(
            _.get(nanodegree, 'key')
        );
        return (
            _.get(nanodegree, 'enrollment.state') ===
            ENROLLMENT_STATES.STATIC_ACCESS &&
            _.isEmpty(_.get(versionLocale, 'locale')) &&
            _.isEmpty(_.get(versionLocale, 'version'))
        );
    },

    isEnterprise(nanodegree) {
        const key = _.get(nanodegree, 'key');
        return (
            _.get(nanodegree, 'enrollment.attributes.is_enterprise') ||
            _.includes(key, '-ent')
        );
    },

    isScholarship(nanodegree) {
        return !!_.get(nanodegree, 'enrollment.attributes.is_scholarship');
    },

    isEnrolled(nanodegree) {
        return _.get(nanodegree, 'enrollment.state') === ENROLLMENT_STATES.ENROLLED;
    },

    isConnect(nanodegree) {
        return !!_.get(nanodegree, 'enrollment.attributes.is_connect');
    },

    isOpenEnded(nanodegree) {
        return !!_.get(nanodegree, 'enrollment.open_ended');
    },

    isPreorder(nanodegree) {
        return _.get(nanodegree, 'enrollment.preorder');
    },

    getNanodegreeExperimentsAttributes(nanodegree) {
        const cohort = this.getCurrentCohort(nanodegree) || null;
        const experimentAttributes = {
            ..._.get(nanodegree, 'enrollment.attributes', {}),
            cohort: _.get(cohort, 'id'),
            locale: nanodegree.locale,
            nd_key: nanodegree.key,
            has_static_access: this.isStatic(nanodegree),
            country_code: i18n.getCountryCode(),
            is_open_ended: this.isOpenEndedCohort(nanodegree),
            is_preorder: this.isPreorder(nanodegree),
            is_omac_v2: this.isOMACv2(nanodegree),
        };
        // TODO: Remove this condition when we sort out `is_consumer_subscription`
        // behavior for MENA challenge nd's
        if (
            ['nd002-mena-nfp1', 'nd018-mena-nfp1', 'nd001-mena-nfp1'].includes(
                nanodegree.key
            )
        ) {
            experimentAttributes['is_consumer_subscription'] = true;
        }
        return experimentAttributes;
    },

    getEnrollmentStartDate(nanodegree) {
        return _.get(nanodegree, 'enrollment.started_at');
    },
    hasStudentHub(nanodegree) {
        return _.get(nanodegree, 'enrollment.includes_student_hub');
    },

    isPaidSingleCourse(nanodegree) {
        return _.includes(
            _.get(nanodegree, 'packaging_options', []),
            'paid_single_course'
        );
    },

    isExecutiveProgram(nanodegree) {
        return _.includes(
            _.get(nanodegree, 'packaging_options', []),
            'executive_program'
        );
    },
};

export default NanodegreeHelper;