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
} from "../action_types/keyword_generator_tool_action_types";

export const setBooleanSearchTerms = (booleanSearchTerms) => {
    return {
        type: KEYWORD_GENERATOR_TOOL_SET_BOOLEAN_SEARCH_TERM,
        booleanSearchTerms,
    };
};

export const setSeedKeyword = (seedKeyword) => {
    return {
        type: KEYWORD_GENERATOR_TOOL_SET_SEED_KEYWORD,
        seedKeyword,
    };
};

export const setIsGroupContext = (isGroupContext) => {
    return {
        type: KEYWORD_GENERATOR_TOOL_SET_IS_GROUP_CONTEXT,
        isGroupContext,
    };
};

export const setResultsTableView = (resultsTableView) => {
    return {
        type: KEYWORD_GENERATOR_TOOL_SET_RESULTS_TABLE_VIEW,
        resultsTableView,
    };
};
export const setCountry = (country) => {
    return {
        type: KEYWORD_GENERATOR_TOOL_SET_COUNTRY,
        country,
    };
};
export const setDuration = (duration) => {
    return {
        type: KEYWORD_GENERATOR_TOOL_SET_DURATION,
        duration,
    };
};
export const setWebSource = (webSource) => {
    return {
        type: KEYWORD_GENERATOR_TOOL_SET_WEBSOURCE,
        webSource,
    };
};
export const clearAllParams = () => {
    return {
        type: KEYWORD_GENERATOR_TOOL_CLEAR_ALL_PARAMS,
    };
};

export const setKeywordGeneratorSuggestionParams = (keys, country, arenaTitle) => {
    return {
        type: KEYWORD_GENERATOR_TOOL_SUGGESTION_PARAMS,
        keys,
        country,
        arenaTitle,
    };
};
