import {homePageActionTypes} from "../../actions/homeActions";
import {HomePageState} from "../../models";

export const initialHomePageState: HomePageState = {
    content: null,
    contentType: null,
    error: {
        error: null,
        statusCode: null,
    },
    loading: false,
};

export const homePage = (state = initialHomePageState, action) => {
    switch (action.type) {
        case homePageActionTypes.fetchContent:
            return {
                ...state,
                loading: true,
            };
        case homePageActionTypes.fetchFallbackContent:
            return {
                ...state,
                loading: true,
            };
        case homePageActionTypes.getContentSuccess:
            return {
                ...state,
                content: action.content,
                contentType: "homepage",
                error: initialHomePageState.error,
                loading: false,
            };
        case homePageActionTypes.getFallbackContentSuccess:
            return {
                ...state,
                content: action.content,
                contentType: "homepageFallback",
                error: initialHomePageState.error,
                loading: false,
            };
        case homePageActionTypes.homepageError:
            return {
                ...state,
                contentType: "homepageError",
                error: {
                    error: action.error,
                    statusCode: action.error.statusCode,
                },
                loading: false,
            };
        default:
            return state;
    }
};

export default homePage;
