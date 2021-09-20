import Actions from 'actions';

export default function(state = {}, action) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.FETCH_NANODEGREES_BY_KEY_COMPLETED:
            state = {
                ...state,
                nanodegreesByKey: action.payload,
            };
            break;
    }

    return state;
}