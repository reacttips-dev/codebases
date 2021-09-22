import { main as mainReducer } from "reducers/main";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import thunkDependencies from "./thunk-dependencies";
import persistState from "redux-localstorage";

const middlewares = [thunk.withExtraArgument(thunkDependencies)];

if (process.env.NODE_ENV === "development") {
    // Use logger only in DEV
    const logger = createLogger({
        collapsed: true,
    });

    middlewares.push(logger);
}

const navOverrideLocalStorage = persistState("primaryNavOverride", { key: "primaryNavOverride" });

export const generateStore = (segments?) => {
    const composeEnhancers = composeWithDevTools({
        // Specify name here, actionsBlacklist, actionsCreators and other options if needed
    });
    // we gather segments data from startup call
    let initialState = {};

    if (segments) {
        initialState = {
            conversionModule: {
                segments,
            },
        };
    }

    return createStore(
        mainReducer,
        initialState,
        composeEnhancers(applyMiddleware(...middlewares), navOverrideLocalStorage),
    );
};
