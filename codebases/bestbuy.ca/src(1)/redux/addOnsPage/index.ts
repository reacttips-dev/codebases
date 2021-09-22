/* --------Constants--------*/
export const UPDATE_PARENT_ITEM_JUST_ADDED = "addOnsPage/UPDATE_PARENT_ITEM_JUST_ADDED";
export const updateParentItemJustAdded = (parentItemJustAdded) => ({
    payload: { parentItemJustAdded },
    type: UPDATE_PARENT_ITEM_JUST_ADDED,
});
const defaultState = {
    parentItemJustAdded: false,
};
export default function reducer(state = defaultState, action = {}) {
    switch (action.type) {
        case UPDATE_PARENT_ITEM_JUST_ADDED:
            return Object.assign(Object.assign({}, state), { parentItemJustAdded: action.payload.parentItemJustAdded });
        default:
            return state;
    }
}
/* --------Selector--------*/
export const hasParentItemJustAdded = (state) => {
    return state && state.parentItemJustAdded;
};
//# sourceMappingURL=index.js.map