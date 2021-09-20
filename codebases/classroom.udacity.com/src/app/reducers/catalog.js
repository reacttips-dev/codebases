import Actions from 'actions';

export default function(state = {}, action) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.FETCH_NANODEGREE_CATALOG_COMPLETED:
            {
                return {
                    ...state,
                    nanodegrees: action.payload
                        .filter((nd) => nd.available)
                        .sort((a, b) => {
                            const lowerATitle = a.title.toLowerCase();
                            const lowerBTitle = b.title.toLowerCase();
                            return lowerATitle < lowerBTitle ?
                                -1 :
                                lowerATitle > lowerBTitle ?
                                1 :
                                0;
                        }),
                };
            }
    }

    return state;
}