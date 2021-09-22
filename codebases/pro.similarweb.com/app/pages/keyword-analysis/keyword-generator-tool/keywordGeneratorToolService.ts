const stateName = "keywordAnalysis-keywordGeneratorTool";
const KEYWORD_GENERATOR_TOOL_LOCAL_STORAGE_KEY = "KEYWORD_GENERATOR_TOOL_LOCAL_STORAGE_KEY";
const loadState = () => {
    try {
        const serializedState = localStorage.getItem(KEYWORD_GENERATOR_TOOL_LOCAL_STORAGE_KEY);
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};
const clearState = () => {
    try {
        localStorage.removeItem(KEYWORD_GENERATOR_TOOL_LOCAL_STORAGE_KEY);
    } catch (e) {
        // Suppress errors.
    }
};
const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(KEYWORD_GENERATOR_TOOL_LOCAL_STORAGE_KEY, serializedState);
    } catch (err) {
        // Ignore write errors.
    }
};
const saveStateOnNavChangeStart = (fromState, fromParams) => {
    if (fromState.name === "") {
        return;
    }
    const state = [fromState.name, fromParams];
    saveState(state);
};
const defaultState = (kwGroup, params) => [
    "keywordAnalysis-organic",
    {
        ...params,
        keyword: `*${kwGroup.Id}`,
    },
];

const getStateAndParams = (kwGroup, params) => {
    const savedState = loadState();
    if (!savedState) {
        return defaultState(kwGroup, params);
    } else {
        const [stateName, stateParams] = savedState;
        switch (stateName) {
            case "marketingWorkspace-exists":
                return ["marketingWorkspace-exists", { ...stateParams }];
            default:
                return defaultState(kwGroup, params);
        }
    }
};
export { stateName, saveStateOnNavChangeStart, getStateAndParams, clearState };
