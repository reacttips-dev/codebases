'use es6';

import { Record, Map as ImmutableMap } from 'immutable';
export var StatusTypes = {
  PENDING: 'PENDING',
  SUCCEEDED: 'SUCCEEDED',
  ERRORED: 'ERRORED'
};
export var HttpRequestState = Record({
  request: null,
  status: StatusTypes.PENDING,
  promise: null,
  response: null,
  error: null,
  duration: null,
  ttl: null,
  timeout: null
}, 'HttpRequestState');
export var types = {
  ADD_REQUEST: '@@reporting/ADD_REQUEST',
  REMOVE_REQUEST: '@@reporting/REMOVE_REQUEST',
  SET_REQUEST_STATUS: '@@reporting/SET_REQUEST_STATUS'
};
export var initialState = ImmutableMap();
export var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      _action$data = action.data,
      data = _action$data === void 0 ? {} : _action$data;

  switch (type) {
    case types.ADD_REQUEST:
      {
        var request = data.request,
            promise = data.promise,
            _data$ttl = data.ttl,
            ttl = _data$ttl === void 0 ? null : _data$ttl,
            timeout = data.timeout;

        if (!state.has(request)) {
          return state.set(request, new HttpRequestState({
            request: request,
            promise: promise,
            ttl: ttl,
            timeout: timeout
          }));
        }

        return state;
      }

    case types.REMOVE_REQUEST:
      {
        var _request = data.request;
        var requestState = state.get(_request);

        if (requestState && requestState.timeout) {
          clearTimeout(requestState.timeout);
        }

        return state.remove(_request);
      }

    case types.SET_REQUEST_STATUS:
      {
        var _request2 = data.request,
            response = data.response,
            status = data.status,
            duration = data.duration,
            error = data.error,
            _timeout = data.timeout;

        if (!state.has(_request2)) {
          // the request must have already been busted
          return state;
        }

        return state.update(_request2, function (requestState) {
          return requestState.set('response', response).set('status', status).set('duration', duration).set('error', error).set('timeout', _timeout);
        });
      }

    default:
      {
        return state;
      }
  }
};
export var actions = {
  addRequest: function addRequest(_ref) {
    var request = _ref.request,
        promise = _ref.promise,
        ttl = _ref.ttl,
        timeout = _ref.timeout;
    return {
      type: types.ADD_REQUEST,
      data: {
        request: request,
        promise: promise,
        ttl: ttl,
        timeout: timeout
      }
    };
  },
  removeRequest: function removeRequest(_ref2) {
    var request = _ref2.request;
    return {
      type: types.REMOVE_REQUEST,
      data: {
        request: request
      }
    };
  },
  setRequestStatus: function setRequestStatus(_ref3) {
    var request = _ref3.request,
        response = _ref3.response,
        status = _ref3.status,
        duration = _ref3.duration,
        error = _ref3.error,
        timeout = _ref3.timeout;
    return {
      type: types.SET_REQUEST_STATUS,
      data: {
        request: request,
        response: response,
        status: status,
        duration: duration,
        error: error,
        timeout: timeout
      }
    };
  }
};
export var getState = function getState(state) {
  return state.request;
};
export var getRequestState = function getRequestState(state, request) {
  return state.request.get(request);
};
export var getRequestStatus = function getRequestStatus(state, request) {
  return state.request.getIn([request, 'status']);
};
export var getRequestPromise = function getRequestPromise(state, request) {
  return state.request.getIn([request, 'promise']);
};