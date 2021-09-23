import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useReducer } from 'react';
import { loadAndOpenSalesChat } from './_core/utils/loadAndOpenSalesChat';
var INITIAL_FRAME_DIMENSIONS = {
  height: '500px',
  width: '900px'
};
export var FrameAction;

(function (FrameAction) {
  FrameAction["LOAD_FRAME"] = "LOAD_FRAME";
  FrameAction["FRAME_READY"] = "FRAME_READY";
  FrameAction["CLOSE_FRAME"] = "CLOSE_FRAME";
  FrameAction["HIDE_PARENT_MODAL"] = "HIDE_PARENT_MODAL";
  FrameAction["RESIZE_PARENT_MODAL"] = "RESIZE_PARENT_MODAL";
  FrameAction["OPEN_CHAT"] = "OPEN_CHAT";
})(FrameAction || (FrameAction = {}));

export var EXPECTED_MESSAGES = Object.keys(FrameAction);
var initialFrameState = {
  loadFrame: false,
  frameReady: false,
  showParentModal: true,
  frameDimensions: INITIAL_FRAME_DIMENSIONS
};

var frameReducer = function frameReducer(state, action) {
  var LOAD_FRAME = FrameAction.LOAD_FRAME,
      FRAME_READY = FrameAction.FRAME_READY,
      CLOSE_FRAME = FrameAction.CLOSE_FRAME,
      HIDE_PARENT_MODAL = FrameAction.HIDE_PARENT_MODAL,
      RESIZE_PARENT_MODAL = FrameAction.RESIZE_PARENT_MODAL,
      OPEN_CHAT = FrameAction.OPEN_CHAT;

  switch (action.type) {
    case LOAD_FRAME:
      return Object.assign({}, state, {
        loadFrame: true
      });

    case FRAME_READY:
      return Object.assign({}, state, {
        frameReady: true
      });

    case HIDE_PARENT_MODAL:
      return Object.assign({}, state, {
        showParentModal: false
      });

    case RESIZE_PARENT_MODAL:
      return Object.assign({}, state, {
        showParentModal: true,
        frameDimensions: Object.assign({}, state.frameDimensions, {}, action.payload)
      });

    case CLOSE_FRAME:
      return initialFrameState;

    case OPEN_CHAT:
      loadAndOpenSalesChat(action.payload);
      return state;

    default:
      return state;
  }
};

export var useModalFrameReducer = function useModalFrameReducer() {
  var _useReducer = useReducer(frameReducer, initialFrameState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      frameState = _useReducer2[0],
      dispatchFrameAction = _useReducer2[1];

  return [frameState, dispatchFrameAction];
};