import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import storiesReducer from "./storiesReducer";
import pagesReducer from "./pagesReducer";
import layersReducer from "./storyLayersReducer";
import registerReducer from "./registerReducer";
import sidebarSliderReducer from "./sidebarSliderReducer";
import { USER_LOGGED_OUT, BACK_FROM_STUDIO } from "../_actions/types";
import navBarReducer from "./navBarReducer";
import storyEditorReducer from "./storyEditorReducer";
import webSocketReducer from "./webSocketReducer";
import homePageCardSelectionReducer from "./homePageCardSelectionReducer";
import folderReducer from "./folderReducer";
import storyDetailsReducer from "./storyDetailsReducer";
import sessionReducer from "./sessionReducer";
import commonActionReducer from "./commonActionReducer";
import applicationReducer from "./applicationReducer";
import broadcastTextCursorReducer from "./broadcastTextCursorReducer";
import broadcastMouseCursorReducer from "./broadcastMouseCursorReducer";
import broadcastEventReducer from "./broadcastEventReducer";
import commentReducer from "./commentReducer";
import rightSidebarReducer from "./rightSidebarReducer";
import brandKitReducer from "./brandKitReducer";
import commandKReducer from "./commandKReducer";
import aiDocumentReducer from "./aiDocumentReducer";
import slidePresetReducer from "./slidePresetReducer";
import subscriptionReducer from "./subscriptionReducer";
import motionReducer from "./motionReducer";
import bottomPanelReducer from "./bottomPanelReducer";

const appReducer = combineReducers({
  auth: authReducer,
  errors: errorReducer,
  stories: storiesReducer,
  register: registerReducer,
  sidebarSlider: sidebarSliderReducer,
  navbar: navBarReducer,
  editor: storyEditorReducer,
  websockets: webSocketReducer,
  homePageCards: homePageCardSelectionReducer,
  folders: folderReducer,
  story: storyDetailsReducer,
  layerstore: layersReducer,
  pagestore: pagesReducer,
  session: sessionReducer,
  app: applicationReducer,
  actions: commonActionReducer,
  textcursorstore: broadcastTextCursorReducer,
  mousepointerstore: broadcastMouseCursorReducer,
  actionstore: broadcastEventReducer,
  comment: commentReducer,
  rightsidebar: rightSidebarReducer,
  brandKit: brandKitReducer,
  commandK: commandKReducer,
  document: aiDocumentReducer,
  slidePresets: slidePresetReducer,
  subscription: subscriptionReducer,
  motionStore: motionReducer,
  bottomPanel: bottomPanelReducer,
});

const rootReducer = (state, action) => {
  // when a logout action is dispatched it will reset redux state
  if (action.type === USER_LOGGED_OUT) {
    state = undefined;
    if (!!window.Intercom && window.Intercom.booted) {
      window.Intercom("shutdown");
    }
  } else if (action.type === BACK_FROM_STUDIO) {
    state.sidebarSlider = undefined;
    state.editor = undefined;
    state.stories = undefined;
    state.layerstore = undefined;
    state.pagestore = undefined;
    state.rightsidebar = undefined;
    state.story = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
