import Actions from 'actions';

export default function(state = {}, action) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.FETCH_COURSE_NAME_COMPLETED:
            const {
                title,
                key
            } = action.payload;
            state = {
                ...state,
                [key]: _.assign({}, state[key], {
                    name: title
                }),
            };
            return state;
            break;
        default:
            return state;
    }
}