import Actions from 'actions';

export default function(state = {}, action) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.FETCH_FEATURE_ENABLED_COMPLETED:
            const {
                key,
                featureDetails
            } = action.payload;

            return {
                ...state,
                [key]: featureDetails,
            };

        default:
            return state;
    }
}