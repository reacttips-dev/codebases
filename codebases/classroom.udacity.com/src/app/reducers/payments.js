import Actions from 'actions';

export default function(
    state = {
        orderHistory: [],
        billingInfo: {}
    },
    action
) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.FETCH_ORDER_HISTORY_COMPLETED:
            {
                const {
                    order_history: orderHistory,
                    billing_info: billingInfo,
                } = action.payload;

                state = {
                    ...state,
                    orderHistory,
                    billingInfo,
                };
                break;
            }
    }
    return state;
}