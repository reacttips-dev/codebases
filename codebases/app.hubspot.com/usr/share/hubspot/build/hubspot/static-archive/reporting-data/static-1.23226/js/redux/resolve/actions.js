'use es6';

export var ADD_CONFIG = '@@reporting/ADD_CONFIG';
export var addConfig = function addConfig(_ref) {
  var config = _ref.config;
  return {
    type: ADD_CONFIG,
    data: {
      config: config
    }
  };
};
export var BUST_ALL_RESOLVES = '@@reporting/BUST_ALL_RESOLVES';
export var bustResolves = function bustResolves() {
  return {
    type: BUST_ALL_RESOLVES
  };
};
export var BUST_ONE_RESOLVE = '@@reporting/BUST_ONE_RESOLVE';
export var bustOneResolve = function bustOneResolve(_ref2) {
  var config = _ref2.config;
  return {
    type: BUST_ONE_RESOLVE,
    data: {
      config: config
    }
  };
};
export var SET_CONFIGURED = '@@reporting/SET_CONFIGURED';
export var setConfigured = function setConfigured(_ref3) {
  var config = _ref3.config,
      configured = _ref3.configured;
  return {
    type: SET_CONFIGURED,
    data: {
      config: config,
      configured: configured
    }
  };
};
export var SET_PROMISE = '@@reporting/SET_PROMISE';
export var setPromise = function setPromise(_ref4) {
  var config = _ref4.config,
      promise = _ref4.promise;
  return {
    type: SET_PROMISE,
    data: {
      config: config,
      promise: promise
    }
  };
};
export var SET_STATUS = '@@reporting/SET_STATUS';
export var setStatus = function setStatus(_ref5) {
  var config = _ref5.config,
      status = _ref5.status,
      error = _ref5.error;
  return {
    type: SET_STATUS,
    data: {
      config: config,
      status: status,
      error: error
    }
  };
};
export var SET_DATA = '@@reporting/SET_DATA';
export var setData = function setData(_ref6) {
  var config = _ref6.config,
      data = _ref6.data;
  return {
    type: SET_DATA,
    data: {
      config: config,
      data: data
    }
  };
};
export var baseEnter = '@@reporting/ENTER_';
export var getEnterActionType = function getEnterActionType(name) {
  return "" + baseEnter + name;
};
export var enterPhase = function enterPhase(_ref7) {
  var config = _ref7.config,
      name = _ref7.name,
      input = _ref7.input;
  return {
    type: getEnterActionType(name),
    data: {
      config: config,
      name: name,
      input: input
    }
  };
};
export var baseExit = '@@reporting/EXIT_';
export var getExitActionType = function getExitActionType(name) {
  return "" + baseExit + name;
};
export var exitPhase = function exitPhase(_ref8) {
  var config = _ref8.config,
      name = _ref8.name,
      output = _ref8.output;
  return {
    type: getExitActionType(name),
    data: {
      config: config,
      name: name,
      output: output
    }
  };
};
export var DEBUG = '@@reporting/DEBUG';
export var debug = function debug(_ref9) {
  var config = _ref9.config,
      key = _ref9.key,
      value = _ref9.value;
  return {
    type: DEBUG,
    data: {
      config: config,
      key: key,
      value: value
    }
  };
};