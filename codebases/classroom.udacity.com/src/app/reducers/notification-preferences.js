import Actions from 'actions';

const initialState = {
    preferences: {}
};

export default function(state = initialState, action) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.FETCH_NOTIFICATION_PREFERENCES_COMPLETED:
        case Actions.Types.UPDATE_NOTIFICATION_PREFERENCES_COMPLETED:
        case Actions.Types
        .UPDATE_NOTIFICATION_PREFERENCES_UNSUBSCRIBE_ALL_COMPLETED:
            {
                return {
                    ...state,
                    preferences: action.payload.data,
                };
            }

        default:
            return state;
    }
}