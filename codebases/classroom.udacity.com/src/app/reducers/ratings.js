import Actions from 'actions';

export default function(state = {}, action) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.LOAD_NANODEGREE_RATING_COMPLETED:
        case Actions.Types.SUBMIT_NANODEGREE_RATING_COMPLETED:
            const userRatingResponse = action.payload.data;
            if (userRatingResponse) {
                return {
                    ...state,
                    [userRatingResponse.nd_key]: userRatingResponse,
                };
            } else {
                return state;
            }

        default:
            return state;
    }
}