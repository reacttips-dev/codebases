const UPDATE_PAYMENT = "checkout/UPDATE_PAYMENT";
const defaultState = { billingAddress: {} };
export default function reducer(state = defaultState, action = {}) {
    switch (action.type) {
        case UPDATE_PAYMENT:
            return Object.assign(Object.assign({}, state), { cardNumber: "999999999999" });
        default:
            return state;
    }
}
// Action Creators
const updatePayment = () => ({
    type: UPDATE_PAYMENT,
});
export { updatePayment, };
//# sourceMappingURL=payment.js.map