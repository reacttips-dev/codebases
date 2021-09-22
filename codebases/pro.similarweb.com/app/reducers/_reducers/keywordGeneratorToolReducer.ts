import {
    KEYWORD_GENERATOR_TOOL_CLEAR_ALL_PARAMS,
    KEYWORD_GENERATOR_TOOL_SET_COUNTRY,
    KEYWORD_GENERATOR_TOOL_SET_DURATION,
    KEYWORD_GENERATOR_TOOL_SET_SEED_KEYWORD,
    KEYWORD_GENERATOR_TOOL_SET_WEBSOURCE,
    KEYWORD_GENERATOR_TOOL_SUGGESTION_PARAMS,
    KEYWORD_GENERATOR_TOOL_SET_RESULTS_TABLE_VIEW,
    KEYWORD_GENERATOR_TOOL_SET_BOOLEAN_SEARCH_TERM,
    KEYWORD_GENERATOR_TOOL_SET_IS_GROUP_CONTEXT,
} from "../../action_types/keyword_generator_tool_action_types";

interface IKeywordGeneratorToolState {
    seedKeyword: string;
    country: number;
    duration: string;
    webSource: string;
    keys: string;
    arenaCountry: number;
    arenaTitle: string;
    resultsTableView: boolean;
}

const keywordGeneratorToolDefaultState: IKeywordGeneratorToolState = {
    seedKeyword: null,
    country: null,
    duration: null,
    webSource: null,
    keys: null,
    arenaCountry: null,
    arenaTitle: null,
    resultsTableView: false,
};

export const keywordGeneratorToolReducer = (
    state: IKeywordGeneratorToolState = keywordGeneratorToolDefaultState,
    action,
) => {
    switch (action.type) {
        case KEYWORD_GENERATOR_TOOL_SET_IS_GROUP_CONTEXT:
            return {
                ...state,
                isGroupContext: action.isGroupContext,
            };
        case KEYWORD_GENERATOR_TOOL_SET_BOOLEAN_SEARCH_TERM:
            return {
                ...state,
                booleanSearchTerms: action.booleanSearchTerms,
            };
        case KEYWORD_GENERATOR_TOOL_SET_SEED_KEYWORD:
            return {
                ...state,
                seedKeyword: action.seedKeyword,
            };
        case KEYWORD_GENERATOR_TOOL_SET_RESULTS_TABLE_VIEW:
            return {
                ...state,
                resultsTableView: action.resultsTableView,
            };
        case KEYWORD_GENERATOR_TOOL_SET_COUNTRY:
            return {
                ...state,
                country: action.country,
            };
        case KEYWORD_GENERATOR_TOOL_SET_DURATION:
            return {
                ...state,
                duration: action.duration,
            };
        case KEYWORD_GENERATOR_TOOL_SET_WEBSOURCE:
            return {
                ...state,
                webSource: action.webSource,
            };
        case KEYWORD_GENERATOR_TOOL_CLEAR_ALL_PARAMS:
            return {
                ...state,
                seedKeyword: null,
                country: null,
                duration: null,
                webSource: null,
            };
        case KEYWORD_GENERATOR_TOOL_SUGGESTION_PARAMS:
            return {
                ...state,
                keys: action.keys,
                arenaCountry: action.country,
                arenaTitle: action.arenaTitle,
            };
        default:
            return {
                ...state,
            };
    }
};
