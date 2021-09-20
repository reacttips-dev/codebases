import Features from 'constants/features';

export default {
    State: {
        isFeatureEnabled(state, featureName) {
            return _.get(state, `features.${featureName}.isEnabled`, false);
        },
    },

    showTermDeadline(state, ndKey) {
        return _.get(
            state.features[`${Features.NDHOME_TERM_DEADLINE}-${ndKey}`],
            'isEnabled',
            false
        );
    },
};