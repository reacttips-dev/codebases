import NanodegreeHelper from 'helpers/nanodegree-helper';

// NOTE: Exported for testing purposes
export const getNanodegreesAndCoursesAndParts = (state) => {
    return _.get(state, 'settings.user.nanodegreesAndCoursesAndParts') || {};
};

export const _getNanodegreesAndCoursesAndParts = (state) => {
    const {
        current = [], graduated = []
    } = getNanodegreesAndCoursesAndParts(
        state
    );
    return [...current, ...graduated];
};

export const getNanodegrees = (state) => {
    return _.get(state, 'settings.user.nanodegrees') || [];
};

export const getNanodegreeByND = (state, ndKey) => {
    return getNanodegrees(state).find(
        (nanodegree) => _.get(nanodegree, 'key', '') === ndKey
    );
};

export const getHasAnyKnowledgeReviews = (state) => {
    return _getNanodegreesAndCoursesAndParts(state).some((nanodegree) =>
        _.get(nanodegree, 'enrollment.includes_knowledge_reviews', false)
    );
};

export const getHasEnterpriseDefaultServiceModel = (state) => {
    // here we are merging the root nanodegree state with
    // the settings nanodegrees and courses and parts state because
    // if a user refreshes the settings state will not be populated
    return [
        ..._getNanodegreesAndCoursesAndParts(state),
        ...NanodegreeHelper.getNanodegrees(state),
    ].some((nanodegree) => {
        return (
            _.get(nanodegree, 'enrollment.service_model_id') ===
            CONFIG.enterpriseDefaultServiceModelId
        );
    });
};

export const getHasScholarshipDefaultServiceModel = (state) => {
    return getNanodegrees(state).some((nanodegree) => {
        return (
            _.get(nanodegree, 'enrollment.service_model_id') ===
            CONFIG.scholarshipsDefaultServiceModelId
        );
    });
};

export const getHasKnowledgeReviewsByND = (state, ndKey) => {
    const nanodegree = getNanodegreeByND(state, ndKey);
    return _.get(nanodegree, 'enrollment.includes_knowledge_reviews', false);
};

export const getHasAnyStudentHub = (state) => {
    return _getNanodegreesAndCoursesAndParts(state).some((nanodegree) =>
        _.get(nanodegree, 'enrollment.includes_student_hub', false)
    );
};

export const getHasStudentHubByND = (state, ndKey) => {
    const nanodegree = getNanodegreeByND(state, ndKey);
    return _.get(nanodegree, 'enrollment.includes_student_hub', false);
};

const SettingsHelper = {
    State: {
        getUser(state) {
            return _.get(state, 'settings.user') || {};
        },

        studentCanSeeNotifications(state) {
            return !SettingsHelper.State.isGTStudent(state);
        },

        getCurrency(state) {
            return _.get(state, 'settings.currency');
        },

        getAccountCreditTotal(state) {
            return _.get(state, 'settings.accountCreditTotal');
        },

        isGTStudent(state) {
            return _.get(state, 'settings.user.affiliate_program_key') === 'gt';
        },

        getSubscriptions(state) {
            return _.get(state, 'settings.subscriptions') || [];
        },

        getTermPurchases(state) {
            return _.get(state, 'settings.termPurchases') || [];
        },

        getConnectSession(state) {
            return _.get(state, 'settings.connectSession');
        },

        getFacebookName(state) {
            return _.get(state, 'settings.facebookName');
        },

        getGoogleName(state) {
            return _.get(state, 'settings.googleName');
        },

        getSubscribedNanodegreesCount(state) {
            return _.get(state, 'settings.user.subscribedNanodegreesCount', 0);
        },

        getSubscribedCoursesCount(state) {
            return _.get(state, 'settings.user.subscribedCoursesCount', 0);
        },

        getSubscribedPartsCount(state) {
            return _.get(state, 'settings.user.subscribedPartsCount', 0);
        },

        getGraduatedNanodegreesCount(state) {
            return _.get(state, 'settings.user.graduatedNanodegreesCount', 0);
        },

        getGraduatedPartsCount(state) {
            return _.get(state, 'settings.user.graduatedPartsCount', 0);
        },

        getGraduatedCoursesCount(state) {
            return _.get(state, 'settings.user.graduatedCoursesCount', 0);
        },

        getAllNanodegrees(state) {
            const currentNds = _.get(state, 'settings.user.nanodegrees', []);
            const graduatedNds = _.get(
                state,
                'settings.user.graduated_nanodegrees', []
            );
            const ndList = _.map(_.union(currentNds, graduatedNds), (nd) =>
                _.pick(nd, ['id', 'key', 'locale', 'version'])
            );

            return ndList;
        },

        getNanodegreesAndCoursesAndParts(state) {
            return getNanodegreesAndCoursesAndParts(state);
        },
        getNanodegrees(state) {
            return getNanodegrees(state);
        },
        getCourses(state) {
            return _.get(state, 'settings.user.courses') || [];
        },
        getHasStudentHub(state, ndKey) {
            return ndKey ?
                getHasStudentHubByND(state, ndKey) :
                getHasAnyStudentHub(state);
        },
        getHasEnterpriseDefaultServiceModel(state) {
            return getHasEnterpriseDefaultServiceModel(state);
        },
        getHasScholarshipDefaultServiceModel(state) {
            return getHasScholarshipDefaultServiceModel(state);
        },
        getHasKnowledgeReviews(state, ndKey) {
            return ndKey ?
                getHasKnowledgeReviewsByND(state, ndKey) :
                getHasAnyKnowledgeReviews(state);
        },
        getIsEnterpriseOnly(state) {
            const nanodegrees = SettingsHelper.State.getNanodegrees(state);
            if (_.isEmpty(nanodegrees)) {
                return false;
            }
            return nanodegrees.every((nanodegree) =>
                NanodegreeHelper.isEnterprise(nanodegree)
            );
        },
    },

    getAddressSnakeCase(addressCamelCase) {
        const COMMON_ADDRESS_FIELDS = [
            'line1',
            'line2',
            'city',
            'region',
            'country',
        ];
        return {
            ..._.pick(addressCamelCase, COMMON_ADDRESS_FIELDS),
            postal_code: addressCamelCase.postalCode,
        };
    },

    getStudentHubUsername(user) {
        if (_.isEmpty(user.first_name) || _.isEmpty(user.last_name)) {
            return '@me';
        }
        return `@${_.capitalize(user.first_name)}${_.toUpper(user.last_name[0])}`;
    },
};

export default SettingsHelper;