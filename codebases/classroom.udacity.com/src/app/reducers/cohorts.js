import Actions from 'actions';

export default function(state = {}, action) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.FETCH_COHORTS_COMPLETED:
            const {
                status,
                nanodegree_key,
                cohorts
            } = action.payload;
            state = {
                ...state,
                [nanodegree_key]: {
                    ...state[nanodegree_key],
                    [status]: cohorts || [],
                },
            };
            break;
    }

    return state;
}