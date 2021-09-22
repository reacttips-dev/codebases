var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fetch from "isomorphic-fetch";
export const types = {
    getContent: "scm/Content/getContent",
    setContent: "scm/Content/setContent",
};
export const actionCreators = {
    getContent(url, password, id) {
        return (dispatch) => __awaiter(this, void 0, void 0, function* () {
            dispatch({ type: types.getContent });
            const response = yield fetch(`${url}${id}?password=${password}`);
            const json = yield response.json();
            dispatch(actionCreators.setContent(json.id.toString(), json.title.rendered, json.content.rendered, {
                altLangId: json.meta.alternate_id.toString(),
                altLangSeoText: json.meta.alternate_seo_text,
                canonicalUrl: json.meta.canonical_url,
                description: json.excerpt.rendered,
                seoText: json.slug || undefined,
            }));
        });
    },
    setContent(id, title, body, metadata) {
        return { type: types.setContent, id, title, body, metadata };
    },
};
export const defaultState = {
    body: "",
    id: "",
    loading: true,
    metadata: {
        altLangId: "",
        altLangSeoText: "",
        canonicalUrl: "",
        description: "",
    },
    title: "",
};
export const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case types.getContent:
            return Object.assign(Object.assign({}, state), { loading: true });
        case types.setContent:
            const setContentAction = action;
            return {
                body: setContentAction.body,
                id: setContentAction.id,
                loading: false,
                metadata: setContentAction.metadata,
                title: setContentAction.title,
            };
        default:
            return state;
    }
};
//# sourceMappingURL=state.js.map