import * as Redux from "redux";
import userEngagement from "./userEngagementReducer";
import workspaceOptIn from "./workspaceOptInReducer";

const { combineReducers } = Redux;
const userData = combineReducers({
    userEngagement,
    workspaceOptIn,
});

export default userData;
