var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const initialState = {
    categories: {},
    isLoading: false,
};
export const actionTypes = {
    getCategoryContent: "scm/categories/getCategoryContent",
    onError: "scm/categories/onError",
    setCategoryContent: "scm/categories/setCategoryContent",
};
export function getActionCreators(categoryContentProvider) {
    const actionCreators = {
        getCategoryContent: (id, language, state) => (dispatch) => __awaiter(this, void 0, void 0, function* () {
            if (state && state.categories[id]) {
                return;
            }
            dispatch({ type: actionTypes.getCategoryContent });
            let content;
            try {
                content = yield categoryContentProvider.getContent(id, language);
            }
            catch (error) {
                dispatch(actionCreators.onError());
                throw error;
            }
            dispatch(actionCreators.setCategoryContent(id, content));
        }),
        onError: () => {
            return { type: actionTypes.onError };
        },
        setCategoryContent: (id, content) => {
            return { type: actionTypes.setCategoryContent, categoryId: id, categoryContent: content };
        },
    };
    return actionCreators;
}
export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.getCategoryContent:
            return Object.assign(Object.assign({}, state), { isLoading: true });
        case actionTypes.onError:
            return Object.assign(Object.assign({}, state), { isLoading: false });
        case actionTypes.setCategoryContent:
            const setCategoryContentAction = action;
            return {
                categories: Object.assign(Object.assign({}, state.categories), { [setCategoryContentAction.categoryId]: setCategoryContentAction.categoryContent }),
                isLoading: false,
            };
        default:
            return state;
    }
};
//# sourceMappingURL=index.js.map