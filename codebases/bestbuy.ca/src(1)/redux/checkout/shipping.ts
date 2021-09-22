const UPDATE_SHIPPING = "checkout/UPDATE_SHIPPING";
const defaultState = {};
export default function reducer(state = defaultState, action = {}) {
    switch (action.type) {
        case UPDATE_SHIPPING:
            return Object.assign(Object.assign({}, state), { firstName: "DD" });
        default:
            return state;
    }
}
// Action Creators
const updateUser = () => ({
    type: UPDATE_SHIPPING,
});
export { updateUser, };
//# sourceMappingURL=shipping.js.map