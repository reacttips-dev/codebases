'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initStateWithPrevTab = exports.withReduxStateSync = exports.createReduxStateSync = exports.createStateSyncMiddleware = undefined;
exports.generateUuidForAction = generateUuidForAction;
exports.isActionAllowed = isActionAllowed;
exports.isActionSynced = isActionSynced;
exports.createMessageListener = createMessageListener;

var _broadcastChannel = require('broadcast-channel');

var _broadcastChannel2 = _interopRequireDefault(_broadcastChannel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lastUuid = 0; /* eslint-env browser */

var GET_INIT_STATE = '&_GET_INIT_STATE';
var SEND_INIT_STATE = '&_SEND_INIT_STATE';
var RECEIVE_INIT_STATE = '&_RECEIVE_INIT_STATE';

var defaultConfig = {
  channel: 'redux_state_sync',
  predicate: null,
  blacklist: [],
  whitelist: [],
  broadcastChannelOption: null,
  prepareState: function prepareState(state) {
    return state;
  }
};

var getIniteState = function getIniteState() {
  return { type: GET_INIT_STATE };
};
var sendIniteState = function sendIniteState() {
  return { type: SEND_INIT_STATE };
};
var receiveIniteState = function receiveIniteState(state) {
  return { type: RECEIVE_INIT_STATE, payload: state };
};

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function guid() {
  return '' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

// generate current window unique id
var WINDOW_STATE_SYNC_ID = guid();
// if the message receiver is already created
var isMessageListenerCreated = false;
// export for test
function generateUuidForAction(action) {
  var stampedAction = action;
  stampedAction.$uuid = guid();
  stampedAction.$wuid = WINDOW_STATE_SYNC_ID;
  return stampedAction;
}
// export for test
function isActionAllowed(_ref) {
  var predicate = _ref.predicate,
      blacklist = _ref.blacklist,
      whitelist = _ref.whitelist;

  var allowed = function allowed() {
    return true;
  };

  if (predicate && typeof predicate === 'function') {
    allowed = predicate;
  } else if (Array.isArray(blacklist)) {
    allowed = function allowed(type) {
      return blacklist.indexOf(type) < 0;
    };
  } else if (Array.isArray(whitelist)) {
    allowed = function allowed(type) {
      return whitelist.indexOf(type) >= 0;
    };
  }
  return allowed;
}
// export for test
function isActionSynced(action) {
  return !!action.$isSync;
}
// export for test
function createMessageListener(_ref2) {
  var channel = _ref2.channel,
      dispatch = _ref2.dispatch,
      allowed = _ref2.allowed;

  var isSynced = false;
  var tabs = {};
  var messageChannel = channel;
  messageChannel.onmessage = function (stampedAction) {
    // Ignore if this action is triggered by this window
    if (stampedAction.$wuid === WINDOW_STATE_SYNC_ID) {
      return;
    }
    // IE bug https://stackoverflow.com/questions/18265556/why-does-internet-explorer-fire-the-window-storage-event-on-the-window-that-st
    if (stampedAction.type === RECEIVE_INIT_STATE) {
      return;
    }
    // ignore other values that saved to localstorage.
    if (stampedAction.$uuid && stampedAction.$uuid !== lastUuid) {
      if (stampedAction.type === GET_INIT_STATE && !tabs[stampedAction.$wuid]) {
        tabs[stampedAction.$wuid] = true;
        dispatch(sendIniteState());
      } else if (stampedAction.type === SEND_INIT_STATE && !tabs[stampedAction.$wuid]) {
        if (!isSynced) {
          isSynced = true;
          dispatch(receiveIniteState(stampedAction.payload));
        }
        return;
      } else if (allowed(stampedAction.type)) {
        lastUuid = stampedAction.$uuid;
        dispatch(Object.assign(stampedAction, {
          $isSync: true
        }));
      }
    }
  };
}

var createStateSyncMiddleware = exports.createStateSyncMiddleware = function createStateSyncMiddleware() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultConfig;

  var allowed = isActionAllowed(config);
  var channel = new _broadcastChannel2.default(config.channel, config.broadcastChannelOption);
  var prepareState = config.prepareState || defaultConfig.prepareState;

  return function (_ref3) {
    var getState = _ref3.getState,
        dispatch = _ref3.dispatch;
    return function (next) {
      return function (action) {
        // create message receiver
        if (!isMessageListenerCreated) {
          isMessageListenerCreated = true;
          createMessageListener({ channel: channel, dispatch: dispatch, allowed: allowed });
        }
        // post messages
        if (action && !action.$uuid) {
          var stampedAction = generateUuidForAction(action);
          lastUuid = stampedAction.$uuid;
          try {
            if (action.type === SEND_INIT_STATE) {
              if (getState()) {
                stampedAction.payload = prepareState(getState());
                channel.postMessage(stampedAction);
              }
              return next(action);
            }
            if (allowed(stampedAction.type) || action.type === GET_INIT_STATE) {
              channel.postMessage(stampedAction);
            }
          } catch (e) {
            console.error("Your browser doesn't support cross tab communication");
          }
        }
        return next(Object.assign(action, {
          $isSync: typeof action.$isSync === 'undefined' ? false : action.$isSync
        }));
      };
    };
  };
};

var createReduxStateSync = exports.createReduxStateSync = function createReduxStateSync(_ref4) {
  var prepareState = _ref4.prepareState;
  return function (appReducer) {
    return function (state, action) {
      var initState = state;
      if (action.type === RECEIVE_INIT_STATE) {
        initState = prepareState(action.payload);
      }
      return appReducer(initState, action);
    };
  };
};

// init state with other tab's state
var withReduxStateSync = exports.withReduxStateSync = createReduxStateSync({
  prepareState: function prepareState(state) {
    return state;
  }
});

var initStateWithPrevTab = exports.initStateWithPrevTab = function initStateWithPrevTab(_ref5) {
  var dispatch = _ref5.dispatch;

  dispatch(getIniteState());
};