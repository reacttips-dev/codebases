'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*  Most of these functions are from the wonderful Underscore package http://underscorejs.org/
    This file exists so that the planoutjs library doesn't depend on a few unneeded third party dependencies
    so that consumers of the library don't have to include dependencies such as underscore. As well, this helps reduce
    the file size of the resulting library.
*/
var trimTrailingWhitespace = function trimTrailingWhitespace(str) {
  return str.replace(/^\s+|\s+$/g, '');
};

var getParameterByName = function getParameterByName(name) {
  var hasLocation = typeof location !== 'undefined';
  var hasWindow = typeof window !== 'undefined';
  var queryParamVal;

  if (hasLocation) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    queryParamVal = results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  } else {
    queryParamVal = "";
  }

  if (queryParamVal === null || queryParamVal === undefined || queryParamVal.length === 0) {
    if (hasWindow && window.localStorage !== undefined && window.localStorage !== null) {
      return window.localStorage.getItem(name);
    }
  }

  return queryParamVal;
};

var deepCopy = function deepCopy(obj) {
  var newObj = obj;

  if (obj && typeof obj === 'object') {
    newObj = Object.prototype.toString.call(obj) === "[object Array]" ? [] : {};

    for (var i in obj) {
      newObj[i] = deepCopy(obj[i]);
    }
  }

  return newObj;
};

var isObject = function isObject(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
};

var isArray = function isArray(object) {
  if (Array.isArray) {
    return Array.isArray(object);
  } else {
    return Object.prototype.toString.call(object) === '[object Array]';
  }
};

var isFunction = function isFunction(obj) {
  return typeof obj == 'function' || false;
}; //extend helpers


var keys = function keys(obj) {
  if (!isObject(obj)) return [];
  if (Object.keys) return Object.keys(obj);
  var keys = [];

  for (var key in obj) {
    if (has(obj, key)) keys.push(key);
  }

  if (hasEnumBug) collectNonEnumProps(obj, keys);
  return keys;
};

var allKeys = function allKeys(obj) {
  if (!isObject(obj)) return [];
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  if (hasEnumBug) collectNonEnumProps(obj, keys);
  return keys;
};

var extendHolder = function extendHolder(keysFunc, undefinedOnly) {
  return function (obj) {
    var length = arguments.length;
    if (length < 2 || obj == null) return obj;

    for (var index = 1; index < length; index++) {
      var source = arguments[index],
          keys = keysFunc(source),
          l = keys.length;

      for (var i = 0; i < l; i++) {
        var key = keys[i];
        if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
      }
    }

    return obj;
  };
}; //extend functionality from underscore


var extend = extendHolder(allKeys);
var extendOwn = extendHolder(keys);
/* underscore helpers */

var identity = function identity(value) {
  return value;
};

var isMatch = function isMatch(object, attrs) {
  var keys = keys(attrs),
      length = keys.length;
  if (object == null) return !length;
  var obj = Object(object);

  for (var i = 0; i < length; i++) {
    var key = keys[i];
    if (attrs[key] !== obj[key] || !(key in obj)) return false;
  }

  return true;
};

var matcher = function matcher(attrs) {
  attrs = extendOwn({}, attrs);
  return function (obj) {
    return isMatch(obj, attrs);
  };
};

var cb = function cb(value, context, argCount) {
  if (value == null) return identity;
  if (isFunction(value)) return optimizeCb(value, context, argCount);
  if (isObject(value)) return matcher(value);
  return property(value);
};

var optimizeCb = function optimizeCb(func, context, argCount) {
  if (context === void 0) return func;

  switch (argCount == null ? 3 : argCount) {
    case 1:
      return function (value) {
        return func.call(context, value);
      };

    case 2:
      return function (value, other) {
        return func.call(context, value, other);
      };

    case 3:
      return function (value, index, collection) {
        return func.call(context, value, index, collection);
      };

    case 4:
      return function (accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
  }

  return function () {
    return func.apply(context, arguments);
  };
}; //from underscore


var forEach = function forEach(obj, iteratee, context) {
  iteratee = optimizeCb(iteratee, context);
  var i, length;

  if (isArrayLike(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee(obj[i], i, obj);
    }
  } else {
    var theKeys = keys(obj);

    for (i = 0, length = theKeys.length; i < length; i++) {
      iteratee(obj[theKeys[i]], theKeys[i], obj);
    }
  }

  return obj;
}; //map functionality from underscore


var map = function map(obj, iteratee, context) {
  iteratee = cb(iteratee, context);
  var theKeys = !isArrayLike(obj) && keys(obj),
      length = (theKeys || obj).length,
      results = Array(length);

  for (var index = 0; index < length; index++) {
    var currentKey = theKeys ? theKeys[index] : index;
    results[index] = iteratee(obj[currentKey], currentKey, obj);
  }

  return results;
}; //reduce functionality from underscore


var reduce = function reduce(obj, iteratee, memo, context) {
  iteratee = optimizeCb(iteratee, context, 4);
  var theKeys = !isArrayLike(obj) && keys(obj),
      length = (theKeys || obj).length,
      index = 0;

  if (arguments.length < 3) {
    memo = obj[theKeys ? theKeys[index] : index];
    index += 1;
  }

  for (; index >= 0 && index < length; index++) {
    var currentKey = theKeys ? theKeys[index] : index;
    memo = iteratee(memo, obj[currentKey], currentKey, obj);
  }

  return memo;
}; //clone functionality from underscore


var shallowCopy = function shallowCopy(obj) {
  if (!isObject(obj)) return obj;
  return isArray(obj) ? obj.slice() : extend({}, obj);
};
/* helper functions from underscore */


var property = function property(key) {
  return function (obj) {
    return obj == null ? void 0 : obj[key];
  };
};

var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
var getLength = property('length');

var isArrayLike = function isArrayLike(collection) {
  var length = getLength(collection);
  return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};

var has = function has(obj, key) {
  return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
};
/* All these are helper functions to deal with older versions of IE  :(*/


var hasEnumBug = !{
  toString: null
}.propertyIsEnumerable('toString');
var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

function collectNonEnumProps(obj, keys) {
  var nonEnumIdx = nonEnumerableProps.length;
  var constructor = obj.constructor;
  var proto = isFunction(constructor) && constructor.prototype || Object.Prototype;
  var prop = 'constructor';
  if (has(obj, prop) && !contains(keys, prop)) keys.push(prop);

  while (nonEnumIdx--) {
    prop = nonEnumerableProps[nonEnumIdx];

    if (prop in obj && obj[prop] !== proto[prop] && !contains(keys, prop)) {
      keys.push(prop);
    }
  }
}

var contains = function contains(obj, item, fromIndex, guard) {
  if (!isArrayLike(obj)) obj = vals(obj);
  if (typeof fromIndex != 'number' || guard) fromIndex = 0;
  return obj.indexOf(item) >= 0;
};

var vals = function vals(obj) {
  var objectKeys = keys(obj);
  var length = objectKeys.length;
  var values = Array(length);

  for (var i = 0; i < length; i++) {
    values[i] = obj[objectKeys[i]];
  }

  return values;
};

var range = function range(max) {
  var l = [];

  for (var i = 0; i < max; i++) {
    l.push(i);
  }

  return l;
};

var hasKey = function hasKey(obj, key) {
  return typeof obj[key] !== 'undefined';
};

function provideAssignment(Random) {
  var Assignment =
  /*#__PURE__*/
  function () {
    function Assignment(experimentSalt, overrides) {
      if (!overrides) {
        overrides = {};
      }

      this.experimentSalt = experimentSalt;
      this._overrides = shallowCopy(overrides);
      this._data = shallowCopy(overrides);
      this.saltSeparator = '.';
    }

    var _proto = Assignment.prototype;

    _proto.evaluate = function evaluate(value) {
      return value;
    };

    _proto.getOverrides = function getOverrides() {
      return this._overrides;
    };

    _proto.addOverride = function addOverride(key, value) {
      this._overrides[key] = value;
      this._data[key] = value;
    };

    _proto.setOverrides = function setOverrides(overrides) {
      this._overrides = shallowCopy(overrides);
      var self = this;
      forEach(Object.keys(this._overrides), function (overrideKey) {
        self._data[overrideKey] = self._overrides[overrideKey];
      });
    };

    _proto.set = function set(name, value) {
      if (name === '_data') {
        this._data = value;
        return;
      } else if (name === '_overrides') {
        this._overrides = value;
        return;
      } else if (name === 'experimentSalt') {
        this.experimentSalt = value;
        return;
      } else if (name === 'saltSeparator') {
        this.saltSeparator = value;
        return;
      }

      if (hasKey(this._overrides, name)) {
        return;
      }

      if (value instanceof Random.PlanOutOpRandom) {
        if (!value.args.salt) {
          value.args.salt = name;
        }

        this._data[name] = value.execute(this);
      } else {
        this._data[name] = value;
      }
    };

    _proto.get = function get(name, defaultVal) {
      if (name === '_data') {
        return this._data;
      } else if (name === '_overrides') {
        return this._overrides;
      } else if (name === 'experimentSalt') {
        return this.experimentSalt;
      } else if (name === 'saltSeparator') {
        return this.saltSeparator;
      } else {
        var value = this._data[name];
        return value === null || value === undefined ? defaultVal : value;
      }
    };

    _proto.getParams = function getParams() {
      return this._data;
    };

    _proto.del = function del(name) {
      delete this._data[name];
    };

    _proto.toString = function toString() {
      return String(this._data);
    };

    _proto.length = function length() {
      return Object.keys(this._data).length;
    };

    return Assignment;
  }();
  return Assignment;
}

function provideExperiment(Assignment) {
  var Experiment =
  /*#__PURE__*/
  function () {
    function Experiment(inputs) {
      this.inputs = inputs;
      this._exposureLogged = false;
      this._salt = null;
      this._inExperiment = true;
      this._autoExposureLog = true;
      this.setup();

      if (!this.name) {
        throw "setup() must set an experiment name via this.setName()";
      }

      this._assignment = new Assignment(this.getSalt());
      this._assigned = false;
    }
    /* default implementation of fetching the range of experiment parameters that this experiment can take */


    var _proto = Experiment.prototype;

    _proto.getDefaultParamNames = function getDefaultParamNames() {
      var assignmentFxn = this.assign.toString();
      var possibleKeys = assignmentFxn.split('.set(');
      possibleKeys.splice(0, 1); //remove first index since it'll have the function definitions

      return map(possibleKeys, function (val) {
        var str = trimTrailingWhitespace(val.split(',')[0]);
        return str.substr(1, str.length - 2); //remove string chars
      });
    };

    _proto.requireAssignment = function requireAssignment() {
      if (!this._assigned) {
        this._assign();
      }
    };

    _proto.requireExposureLogging = function requireExposureLogging(paramName) {
      if (this.shouldLogExposure(paramName)) {
        this.logExposure();
      }
    };

    _proto._assign = function _assign() {
      this.configureLogger();
      var assignVal = this.assign(this._assignment, this.inputs);

      if (assignVal || assignVal === undefined) {
        this._inExperiment = true;
      } else {
        this._inExperiment = false;
      }

      this._assigned = true;
    };

    _proto.setup = function setup() {
      throw "IMPLEMENT setup";
    };

    _proto.inExperiment = function inExperiment() {
      return this._inExperiment;
    };

    _proto.addOverride = function addOverride(key, value) {
      this._assignment.addOverride(key, value);
    };

    _proto.setOverrides = function setOverrides(value) {
      this._assignment.setOverrides(value);

      var o = this._assignment.getOverrides();

      var self = this;
      forEach(Object.keys(o), function (key) {
        if (self.inputs[key] !== undefined) {
          self.inputs[key] = o[key];
        }
      });
    };

    _proto.getSalt = function getSalt() {
      if (this._salt) {
        return this._salt;
      } else {
        return this.name;
      }
    };

    _proto.setSalt = function setSalt(value) {
      this._salt = value;

      if (this._assignment) {
        this._assignment.experimentSalt = value;
      }
    };

    _proto.getName = function getName() {
      return this.name;
    };

    _proto.assign = function assign(params, args) {
      throw "IMPLEMENT assign";
    }
    /*
    This function should return a list of the possible parameter names that the assignment procedure may assign.
    You can optionally override this function to always return this.getDefaultParamNames()
    which will analyze your program at runtime to determine what the range of possible experimental parameters are.
    Otherwise, simply return a fixed list of the experimental parameters that your assignment procedure may assign.
    */
    ;

    _proto.getParamNames = function getParamNames() {
      throw "IMPLEMENT getParamNames";
    };

    _proto.shouldFetchExperimentParameter = function shouldFetchExperimentParameter(name) {
      var experimentalParams = this.getParamNames();
      return experimentalParams.indexOf(name) >= 0;
    };

    _proto.setName = function setName(value) {
      var re = /\s+/g;
      this.name = value.replace(re, '-');

      if (this._assignment) {
        this._assignment.experimentSalt = this.getSalt();
      }
    };

    _proto.__asBlob = function __asBlob(extras) {
      if (extras === void 0) {
        extras = {};
      }

      var d = {
        'name': this.getName(),
        'time': new Date().getTime() / 1000,
        'salt': this.getSalt(),
        'inputs': this.inputs,
        'params': this._assignment.getParams()
      };
      extend(d, extras);
      return d;
    };

    _proto.setAutoExposureLogging = function setAutoExposureLogging(value) {
      this._autoExposureLog = value;
    };

    _proto.getParams = function getParams() {
      this.requireAssignment();
      this.requireExposureLogging();
      return this._assignment.getParams();
    };

    _proto.get = function get(name, def) {
      this.requireAssignment();
      this.requireExposureLogging(name);
      return this._assignment.get(name, def);
    };

    _proto.toString = function toString() {
      this.requireAssignment();
      this.requireExposureLogging();
      return JSON.stringify(this.__asBlob());
    };

    _proto.logExposure = function logExposure(extras) {
      if (!this.inExperiment()) {
        return;
      }

      this._exposureLogged = true;
      this.logEvent('exposure', extras);
    };

    _proto.shouldLogExposure = function shouldLogExposure(paramName) {
      if (paramName !== undefined && !this.shouldFetchExperimentParameter(paramName)) {
        return false;
      }

      return this._autoExposureLog && !this.previouslyLogged();
    };

    _proto.logEvent = function logEvent(eventType, extras) {
      if (!this.inExperiment()) {
        return;
      }

      var extraPayload;

      if (extras) {
        extraPayload = {
          'event': eventType,
          'extra_data': shallowCopy(extras)
        };
      } else {
        extraPayload = {
          'event': eventType
        };
      }

      this.log(this.__asBlob(extraPayload));
    };

    _proto.configureLogger = function configureLogger() {
      throw "IMPLEMENT configureLogger";
    };

    _proto.log = function log(data) {
      throw "IMPLEMENT log";
    };

    _proto.previouslyLogged = function previouslyLogged() {
      throw "IMPLEMENT previouslyLogged";
    };

    return Experiment;
  }();

  return Experiment;
}

var globalInputArgs = {};
var experimentSpecificInputArgs = {};

var fetchInputs = function fetchInputs(args) {
  if (!args) {
    return {};
  }

  return resolveArgs(shallowCopy(args));
};

var resolveArgs = function resolveArgs(args) {
  forEach(Object.keys(args), function (key) {
    if (isFunction(args[key])) {
      args[key] = args[key]();
    }
  });
  return args;
};

var registerExperimentInput = function registerExperimentInput(key, value, experimentName) {
  if (!experimentName) {
    globalInputArgs[key] = value;
  } else {
    if (!experimentSpecificInputArgs[experimentName]) {
      experimentSpecificInputArgs[experimentName] = {};
    }

    experimentSpecificInputArgs[experimentName][key] = value;
  }
};

var getExperimentInputs = function getExperimentInputs(experimentName) {
  var inputArgs = fetchInputs(globalInputArgs);

  if (experimentName && experimentSpecificInputArgs[experimentName]) {
    return extend(inputArgs, fetchInputs(experimentSpecificInputArgs[experimentName]));
  }

  return inputArgs;
};

var ExperimentSetup = /*#__PURE__*/Object.freeze({
  registerExperimentInput: registerExperimentInput,
  getExperimentInputs: getExperimentInputs
});

function provideInterpreter(OpsUtils, Assignment) {
  var Interpreter =
  /*#__PURE__*/
  function () {
    function Interpreter(serialization, experimentSalt, inputs, environment) {
      if (experimentSalt === void 0) {
        experimentSalt = 'global_salt';
      }

      if (inputs === void 0) {
        inputs = {};
      }

      this._serialization = deepCopy(serialization);

      if (!environment) {
        this._env = new Assignment(experimentSalt);
      } else {
        this._env = environment;
      }

      this.experimentSalt = this._experimentSalt = experimentSalt;
      this._evaluated = false;
      this._inExperiment = false;
      this._inputs = shallowCopy(inputs);
    }

    var _proto = Interpreter.prototype;

    _proto.inExperiment = function inExperiment() {
      return this._inExperiment;
    };

    _proto.setEnv = function setEnv(newEnv) {
      this._env = deepCopy(newEnv);
      return this;
    };

    _proto.has = function has(name) {
      return this._env[name];
    };

    _proto.get = function get(name, defaultVal) {
      var inputVal = this._inputs[name];

      if (inputVal === null || inputVal === undefined) {
        inputVal = defaultVal;
      }

      var envVal = this._env.get(name);

      if (envVal !== undefined && envVal !== null) {
        return envVal;
      }

      return inputVal;
    };

    _proto.getParams = function getParams() {
      if (!this._evaluated) {
        try {
          this.evaluate(this._serialization);
        } catch (err) {
          if (err instanceof OpsUtils.StopPlanOutException) {
            this._inExperiment = err.inExperiment;
          }
        }

        this._evaluated = true;
      }

      return this._env.getParams();
    };

    _proto.set = function set(name, value) {
      this._env.set(name, value);

      return this;
    };

    _proto.getSaltSeparator = function getSaltSeparator() {
      return this._env.saltSeparator;
    };

    _proto.setOverrides = function setOverrides(overrides) {
      this._env.setOverrides(overrides);

      return this;
    };

    _proto.getOverrides = function getOverrides() {
      return this._env.getOverrides();
    };

    _proto.hasOverride = function hasOverride(name) {
      var overrides = this.getOverrides();
      return overrides && overrides[name] !== undefined;
    };

    _proto.registerCustomOperators = function registerCustomOperators(operators) {
      OpsUtils.registerOperators(operators);
    };

    _proto.evaluate = function evaluate(planoutCode) {
      if (isObject(planoutCode) && planoutCode.op) {
        return OpsUtils.operatorInstance(planoutCode).execute(this);
      } else if (isArray(planoutCode)) {
        var self = this;
        return map(planoutCode, function (obj) {
          return self.evaluate(obj);
        });
      } else {
        return planoutCode;
      }
    };

    return Interpreter;
  }();

  return Interpreter;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var PlanOutOp =
/*#__PURE__*/
function () {
  function PlanOutOp(args) {
    this.args = args;
  }

  var _proto = PlanOutOp.prototype;

  _proto.execute = function execute(mapper) {
    throw "Implement the execute function";
  };

  _proto.dumpArgs = function dumpArgs() {
    console.log(this.args);
  };

  _proto.getArgMixed = function getArgMixed(name) {
    if (this.args[name] === undefined) {
      throw "Missing argument " + name;
    }

    return this.args[name];
  };

  _proto.getArgNumber = function getArgNumber(name) {
    var cur = this.getArgMixed(name);

    if (typeof cur !== "number") {
      throw name + " is not a number.";
    }

    return cur;
  };

  _proto.getArgString = function getArgString(name) {
    var cur = this.getArgMixed(name);

    if (typeof cur !== "string") {
      throw name + " is not a string.";
    }

    return cur;
  };

  _proto.getArgList = function getArgList(name) {
    var cur = this.getArgMixed(name);

    if (Object.prototype.toString.call(cur) !== '[object Array]') {
      throw name + " is not a list";
    }

    return cur;
  };

  _proto.getArgObject = function getArgObject(name) {
    var cur = this.getArgMixed(name);

    if (Object.prototype.toString.call(cur) !== '[object Object]') {
      throw name + " is not an object.";
    }

    return cur;
  };

  _proto.getArgIndexish = function getArgIndexish(name) {
    var cur = this.getArgMixed(name);
    var type = Object.prototype.toString.call(cur);

    if (type !== '[object Object]' && type !== '[object Array]') {
      throw name + " is not an list or object.";
    }

    return cur;
  };

  return PlanOutOp;
}();

var PlanOutOpSimple =
/*#__PURE__*/
function (_PlanOutOp) {
  _inheritsLoose(PlanOutOpSimple, _PlanOutOp);

  function PlanOutOpSimple() {
    return _PlanOutOp.apply(this, arguments) || this;
  }

  var _proto2 = PlanOutOpSimple.prototype;

  _proto2.execute = function execute(mapper) {
    this.mapper = mapper;
    var self = this;
    forEach(Object.keys(this.args), function (key) {
      self.args[key] = mapper.evaluate(self.args[key]);
    });
    return this.simpleExecute();
  };

  return PlanOutOpSimple;
}(PlanOutOp);

var PlanOutOpUnary =
/*#__PURE__*/
function (_PlanOutOpSimple) {
  _inheritsLoose(PlanOutOpUnary, _PlanOutOpSimple);

  function PlanOutOpUnary() {
    return _PlanOutOpSimple.apply(this, arguments) || this;
  }

  var _proto3 = PlanOutOpUnary.prototype;

  _proto3.simpleExecute = function simpleExecute() {
    return this.unaryExecute(this.getArgMixed('value'));
  };

  _proto3.getUnaryString = function getUnaryString() {
    return this.args.op;
  };

  _proto3.unaryExecute = function unaryExecute(value) {
    throw "implement unaryExecute";
  };

  return PlanOutOpUnary;
}(PlanOutOpSimple);

var PlanOutOpBinary =
/*#__PURE__*/
function (_PlanOutOpSimple2) {
  _inheritsLoose(PlanOutOpBinary, _PlanOutOpSimple2);

  function PlanOutOpBinary() {
    return _PlanOutOpSimple2.apply(this, arguments) || this;
  }

  var _proto4 = PlanOutOpBinary.prototype;

  _proto4.simpleExecute = function simpleExecute() {
    var left = this.getArgMixed('left');
    var right = this.getArgMixed('right');
    return this.binaryExecute(left, right);
  };

  _proto4.getInfixString = function getInfixString() {
    return this.args.op;
  };

  _proto4.binaryExecute = function binaryExecute(left, right) {
    throw "implement binaryExecute";
  };

  return PlanOutOpBinary;
}(PlanOutOpSimple);

var PlanOutOpCommutative =
/*#__PURE__*/
function (_PlanOutOpSimple3) {
  _inheritsLoose(PlanOutOpCommutative, _PlanOutOpSimple3);

  function PlanOutOpCommutative() {
    return _PlanOutOpSimple3.apply(this, arguments) || this;
  }

  var _proto5 = PlanOutOpCommutative.prototype;

  _proto5.simpleExecute = function simpleExecute() {
    return this.commutativeExecute(this.getArgList('values'));
  };

  _proto5.getCommutativeString = function getCommutativeString() {
    return this.args.op;
  };

  _proto5.commutativeExecute = function commutativeExecute(values) {
    throw "implement commutativeExecute";
  };

  return PlanOutOpCommutative;
}(PlanOutOpSimple);

var Base = /*#__PURE__*/Object.freeze({
  PlanOutOp: PlanOutOp,
  PlanOutOpSimple: PlanOutOpSimple,
  PlanOutOpCommutative: PlanOutOpCommutative,
  PlanOutOpBinary: PlanOutOpBinary,
  PlanOutOpUnary: PlanOutOpUnary
});

var initializeOperators = function initializeOperators(Core, Random) {
  registerOperators({
    'literal': Core.Literal,
    'get': Core.Get,
    'set': Core.Set,
    'seq': Core.Seq,
    'return': Core.Return,
    'index': Core.Index,
    'array': Core.Arr,
    'equals': Core.Equals,
    'and': Core.And,
    'or': Core.Or,
    ">": Core.GreaterThan,
    "<": Core.LessThan,
    ">=": Core.GreaterThanOrEqualTo,
    "<=": Core.LessThanOrEqualTo,
    "%": Core.Mod,
    "/": Core.Divide,
    "not": Core.Not,
    "round": Core.Round,
    "negative": Core.Negative,
    "min": Core.Min,
    "max": Core.Max,
    "length": Core.Length,
    "coalesce": Core.Coalesce,
    "map": Core.Map,
    "cond": Core.Cond,
    "product": Core.Product,
    "sum": Core.Sum,
    "randomFloat": Random.RandomFloat,
    "randomInteger": Random.RandomInteger,
    "bernoulliTrial": Random.BernoulliTrial,
    "bernoulliFilter": Random.BernoulliFilter,
    "uniformChoice": Random.UniformChoice,
    "weightedChoice": Random.WeightedChoice,
    "sample": Random.Sample
  });
};

var operators = {};

var registerOperators = function registerOperators(ops) {
  forEach(ops, function (value, op) {
    if (operators[op]) {
      throw op + " already is defined";
    } else {
      operators[op] = value;
    }
  });
};

var isOperator = function isOperator(op) {
  return isObject(op) && op.op;
};

var operatorInstance = function operatorInstance(params) {
  var op = params.op;

  if (!operators[op]) {
    throw "Unknown Operator " + op;
  }

  return new operators[op](params);
};

var StopPlanOutException = function StopPlanOutException(inExperiment) {
  this.inExperiment = inExperiment;
};

var OpsUtils = /*#__PURE__*/Object.freeze({
  initializeOperators: initializeOperators,
  registerOperators: registerOperators,
  isOperator: isOperator,
  operatorInstance: operatorInstance,
  StopPlanOutException: StopPlanOutException
});

var Literal =
/*#__PURE__*/
function (_PlanOutOp) {
  _inheritsLoose(Literal, _PlanOutOp);

  function Literal() {
    return _PlanOutOp.apply(this, arguments) || this;
  }

  var _proto = Literal.prototype;

  _proto.execute = function execute(mapper) {
    return this.getArgMixed('value');
  };

  return Literal;
}(PlanOutOp);

var Get =
/*#__PURE__*/
function (_PlanOutOp2) {
  _inheritsLoose(Get, _PlanOutOp2);

  function Get() {
    return _PlanOutOp2.apply(this, arguments) || this;
  }

  var _proto2 = Get.prototype;

  _proto2.execute = function execute(mapper) {
    return mapper.get(this.getArgString('var'));
  };

  return Get;
}(PlanOutOp);

var Seq =
/*#__PURE__*/
function (_PlanOutOp3) {
  _inheritsLoose(Seq, _PlanOutOp3);

  function Seq() {
    return _PlanOutOp3.apply(this, arguments) || this;
  }

  var _proto3 = Seq.prototype;

  _proto3.execute = function execute(mapper) {
    forEach(this.getArgList('seq'), function (op) {
      mapper.evaluate(op);
    });
  };

  return Seq;
}(PlanOutOp);

var Return =
/*#__PURE__*/
function (_PlanOutOp4) {
  _inheritsLoose(Return, _PlanOutOp4);

  function Return() {
    return _PlanOutOp4.apply(this, arguments) || this;
  }

  var _proto4 = Return.prototype;

  _proto4.execute = function execute(mapper) {
    var value = mapper.evaluate(this.getArgMixed('value'));
    var inExperiment = false;

    if (value) {
      inExperiment = true;
    }

    throw new StopPlanOutException(inExperiment);
  };

  return Return;
}(PlanOutOp);

var Set =
/*#__PURE__*/
function (_PlanOutOp5) {
  _inheritsLoose(Set, _PlanOutOp5);

  function Set() {
    return _PlanOutOp5.apply(this, arguments) || this;
  }

  var _proto5 = Set.prototype;

  _proto5.execute = function execute(mapper) {
    var variable = this.getArgString('var');
    var value = this.getArgMixed('value');

    if (mapper.hasOverride(variable)) {
      return;
    }

    if (value && isOperator(value) && !value.salt) {
      value.salt = variable;
    }

    if (variable == "experimentSalt") {
      mapper.experimentSalt = value;
    }

    mapper.set(variable, mapper.evaluate(value));
  };

  return Set;
}(PlanOutOp);

var Arr =
/*#__PURE__*/
function (_PlanOutOp6) {
  _inheritsLoose(Arr, _PlanOutOp6);

  function Arr() {
    return _PlanOutOp6.apply(this, arguments) || this;
  }

  var _proto6 = Arr.prototype;

  _proto6.execute = function execute(mapper) {
    return map(this.getArgList('values'), function (value) {
      return mapper.evaluate(value);
    });
  };

  return Arr;
}(PlanOutOp);

var Coalesce =
/*#__PURE__*/
function (_PlanOutOp7) {
  _inheritsLoose(Coalesce, _PlanOutOp7);

  function Coalesce() {
    return _PlanOutOp7.apply(this, arguments) || this;
  }

  var _proto7 = Coalesce.prototype;

  _proto7.execute = function execute(mapper) {
    var values = this.getArgList('values');

    for (var i = 0; i < values.length; i++) {
      var x = values[i];
      var evalX = mapper.evaluate(x);

      if (evalX !== null && evalX !== undefined) {
        return evalX;
      }
    }

    return null;
  };

  return Coalesce;
}(PlanOutOp);

var Index =
/*#__PURE__*/
function (_PlanOutOpSimple) {
  _inheritsLoose(Index, _PlanOutOpSimple);

  function Index() {
    return _PlanOutOpSimple.apply(this, arguments) || this;
  }

  var _proto8 = Index.prototype;

  _proto8.simpleExecute = function simpleExecute() {
    var base = this.getArgIndexish('base');
    var index = this.getArgMixed('index');

    if (typeof index === "number") {
      if (index >= 0 && index < base.length) {
        return base[index];
      } else {
        return undefined;
      }
    } else {
      return base[index];
    }
  };

  return Index;
}(PlanOutOpSimple);

var Cond =
/*#__PURE__*/
function (_PlanOutOp8) {
  _inheritsLoose(Cond, _PlanOutOp8);

  function Cond() {
    return _PlanOutOp8.apply(this, arguments) || this;
  }

  var _proto9 = Cond.prototype;

  _proto9.execute = function execute(mapper) {
    var list = this.getArgList('cond');

    for (var i in list) {
      var ifClause = list[i]['if'];
      var thenClause = list[i]['then'];

      if (mapper.evaluate(ifClause)) {
        return mapper.evaluate(thenClause);
      }
    }

    return null;
  };

  return Cond;
}(PlanOutOp);

var And =
/*#__PURE__*/
function (_PlanOutOp9) {
  _inheritsLoose(And, _PlanOutOp9);

  function And() {
    return _PlanOutOp9.apply(this, arguments) || this;
  }

  var _proto10 = And.prototype;

  _proto10.execute = function execute(mapper) {
    return reduce(this.getArgList('values'), function (ret, clause) {
      if (!ret) {
        return ret;
      }

      return Boolean(mapper.evaluate(clause));
    }, true);
  };

  return And;
}(PlanOutOp);

var Or =
/*#__PURE__*/
function (_PlanOutOp10) {
  _inheritsLoose(Or, _PlanOutOp10);

  function Or() {
    return _PlanOutOp10.apply(this, arguments) || this;
  }

  var _proto11 = Or.prototype;

  _proto11.execute = function execute(mapper) {
    return reduce(this.getArgList('values'), function (ret, clause) {
      if (ret) {
        return ret;
      }

      return Boolean(mapper.evaluate(clause));
    }, false);
  };

  return Or;
}(PlanOutOp);

var Product =
/*#__PURE__*/
function (_PlanOutOpCommutative) {
  _inheritsLoose(Product, _PlanOutOpCommutative);

  function Product() {
    return _PlanOutOpCommutative.apply(this, arguments) || this;
  }

  var _proto12 = Product.prototype;

  _proto12.commutativeExecute = function commutativeExecute(values) {
    return reduce(values, function (memo, value) {
      return memo * value;
    }, 1);
  };

  return Product;
}(PlanOutOpCommutative);

var Sum =
/*#__PURE__*/
function (_PlanOutOpCommutative2) {
  _inheritsLoose(Sum, _PlanOutOpCommutative2);

  function Sum() {
    return _PlanOutOpCommutative2.apply(this, arguments) || this;
  }

  var _proto13 = Sum.prototype;

  _proto13.commutativeExecute = function commutativeExecute(values) {
    return reduce(values, function (memo, value) {
      return memo + value;
    }, 0);
  };

  return Sum;
}(PlanOutOpCommutative);

var Equals =
/*#__PURE__*/
function (_PlanOutOpBinary) {
  _inheritsLoose(Equals, _PlanOutOpBinary);

  function Equals() {
    return _PlanOutOpBinary.apply(this, arguments) || this;
  }

  var _proto14 = Equals.prototype;

  _proto14.getInfixString = function getInfixString() {
    return "==";
  };

  _proto14.binaryExecute = function binaryExecute(left, right) {
    return left === right;
  };

  return Equals;
}(PlanOutOpBinary);

var GreaterThan =
/*#__PURE__*/
function (_PlanOutOpBinary2) {
  _inheritsLoose(GreaterThan, _PlanOutOpBinary2);

  function GreaterThan() {
    return _PlanOutOpBinary2.apply(this, arguments) || this;
  }

  var _proto15 = GreaterThan.prototype;

  _proto15.binaryExecute = function binaryExecute(left, right) {
    return left > right;
  };

  return GreaterThan;
}(PlanOutOpBinary);

var LessThan =
/*#__PURE__*/
function (_PlanOutOpBinary3) {
  _inheritsLoose(LessThan, _PlanOutOpBinary3);

  function LessThan() {
    return _PlanOutOpBinary3.apply(this, arguments) || this;
  }

  var _proto16 = LessThan.prototype;

  _proto16.binaryExecute = function binaryExecute(left, right) {
    return left < right;
  };

  return LessThan;
}(PlanOutOpBinary);

var LessThanOrEqualTo =
/*#__PURE__*/
function (_PlanOutOpBinary4) {
  _inheritsLoose(LessThanOrEqualTo, _PlanOutOpBinary4);

  function LessThanOrEqualTo() {
    return _PlanOutOpBinary4.apply(this, arguments) || this;
  }

  var _proto17 = LessThanOrEqualTo.prototype;

  _proto17.binaryExecute = function binaryExecute(left, right) {
    return left <= right;
  };

  return LessThanOrEqualTo;
}(PlanOutOpBinary);

var GreaterThanOrEqualTo =
/*#__PURE__*/
function (_PlanOutOpBinary5) {
  _inheritsLoose(GreaterThanOrEqualTo, _PlanOutOpBinary5);

  function GreaterThanOrEqualTo() {
    return _PlanOutOpBinary5.apply(this, arguments) || this;
  }

  var _proto18 = GreaterThanOrEqualTo.prototype;

  _proto18.binaryExecute = function binaryExecute(left, right) {
    return left >= right;
  };

  return GreaterThanOrEqualTo;
}(PlanOutOpBinary);

var Mod =
/*#__PURE__*/
function (_PlanOutOpBinary6) {
  _inheritsLoose(Mod, _PlanOutOpBinary6);

  function Mod() {
    return _PlanOutOpBinary6.apply(this, arguments) || this;
  }

  var _proto19 = Mod.prototype;

  _proto19.binaryExecute = function binaryExecute(left, right) {
    return left % right;
  };

  return Mod;
}(PlanOutOpBinary);

var Divide =
/*#__PURE__*/
function (_PlanOutOpBinary7) {
  _inheritsLoose(Divide, _PlanOutOpBinary7);

  function Divide() {
    return _PlanOutOpBinary7.apply(this, arguments) || this;
  }

  var _proto20 = Divide.prototype;

  _proto20.binaryExecute = function binaryExecute(left, right) {
    return parseFloat(left) / parseFloat(right);
  };

  return Divide;
}(PlanOutOpBinary);

var Round =
/*#__PURE__*/
function (_PlanOutOpUnary) {
  _inheritsLoose(Round, _PlanOutOpUnary);

  function Round() {
    return _PlanOutOpUnary.apply(this, arguments) || this;
  }

  var _proto21 = Round.prototype;

  _proto21.unaryExecute = function unaryExecute(value) {
    return Math.round(value);
  };

  return Round;
}(PlanOutOpUnary);

var Not =
/*#__PURE__*/
function (_PlanOutOpUnary2) {
  _inheritsLoose(Not, _PlanOutOpUnary2);

  function Not() {
    return _PlanOutOpUnary2.apply(this, arguments) || this;
  }

  var _proto22 = Not.prototype;

  _proto22.getUnaryString = function getUnaryString() {
    return '!';
  };

  _proto22.unaryExecute = function unaryExecute(value) {
    return !value;
  };

  return Not;
}(PlanOutOpUnary);

var Negative =
/*#__PURE__*/
function (_PlanOutOpUnary3) {
  _inheritsLoose(Negative, _PlanOutOpUnary3);

  function Negative() {
    return _PlanOutOpUnary3.apply(this, arguments) || this;
  }

  var _proto23 = Negative.prototype;

  _proto23.getUnaryString = function getUnaryString() {
    return '-';
  };

  _proto23.unaryExecute = function unaryExecute(value) {
    return 0 - value;
  };

  return Negative;
}(PlanOutOpUnary);

var Min =
/*#__PURE__*/
function (_PlanOutOpCommutative3) {
  _inheritsLoose(Min, _PlanOutOpCommutative3);

  function Min() {
    return _PlanOutOpCommutative3.apply(this, arguments) || this;
  }

  var _proto24 = Min.prototype;

  _proto24.commutativeExecute = function commutativeExecute(values) {
    return Math.min.apply(null, values);
  };

  return Min;
}(PlanOutOpCommutative);

var Max =
/*#__PURE__*/
function (_PlanOutOpCommutative4) {
  _inheritsLoose(Max, _PlanOutOpCommutative4);

  function Max() {
    return _PlanOutOpCommutative4.apply(this, arguments) || this;
  }

  var _proto25 = Max.prototype;

  _proto25.commutativeExecute = function commutativeExecute(values) {
    return Math.max.apply(null, values);
  };

  return Max;
}(PlanOutOpCommutative);

var Length =
/*#__PURE__*/
function (_PlanOutOpUnary4) {
  _inheritsLoose(Length, _PlanOutOpUnary4);

  function Length() {
    return _PlanOutOpUnary4.apply(this, arguments) || this;
  }

  var _proto26 = Length.prototype;

  _proto26.unaryExecute = function unaryExecute(value) {
    return value.length;
  };

  return Length;
}(PlanOutOpUnary);

var Map =
/*#__PURE__*/
function (_PlanOutOpSimple2) {
  _inheritsLoose(Map, _PlanOutOpSimple2);

  function Map() {
    return _PlanOutOpSimple2.apply(this, arguments) || this;
  }

  var _proto27 = Map.prototype;

  _proto27.simpleExecute = function simpleExecute() {
    var copy = deepCopy(this.args);
    delete copy.op;
    delete copy.salt;
    return copy;
  };

  return Map;
}(PlanOutOpSimple);

var Core = /*#__PURE__*/Object.freeze({
  Literal: Literal,
  Get: Get,
  Seq: Seq,
  Set: Set,
  Arr: Arr,
  Map: Map,
  Coalesce: Coalesce,
  Index: Index,
  Cond: Cond,
  And: And,
  Or: Or,
  Product: Product,
  Sum: Sum,
  Equals: Equals,
  GreaterThan: GreaterThan,
  LessThan: LessThan,
  LessThanOrEqualTo: LessThanOrEqualTo,
  GreaterThanOrEqualTo: GreaterThanOrEqualTo,
  Mod: Mod,
  Divide: Divide,
  Round: Round,
  Not: Not,
  Negative: Negative,
  Min: Min,
  Max: Max,
  Length: Length,
  Return: Return
});

function provideNamespace(Random, Assignment, Experiment) {
  var DefaultExperiment =
  /*#__PURE__*/
  function (_Experiment) {
    _inheritsLoose(DefaultExperiment, _Experiment);

    function DefaultExperiment() {
      return _Experiment.apply(this, arguments) || this;
    }

    var _proto = DefaultExperiment.prototype;

    _proto.configureLogger = function configureLogger() {
      return;
    };

    _proto.setup = function setup() {
      this.name = 'test_name';
    };

    _proto.log = function log(data) {
      return;
    };

    _proto.getParamNames = function getParamNames() {
      return this.getDefaultParamNames();
    };

    _proto.previouslyLogged = function previouslyLogged() {
      return true;
    };

    _proto.assign = function assign(params, args) {
      return;
    };

    return DefaultExperiment;
  }(Experiment);

  var Namespace =
  /*#__PURE__*/
  function () {
    function Namespace() {}

    var _proto2 = Namespace.prototype;

    _proto2.addExperiment = function addExperiment(name, obj, segments) {
      throw "IMPLEMENT addExperiment";
    };

    _proto2.removeExperiment = function removeExperiment(name) {
      throw "IMPLEMENT removeExperiment";
    };

    _proto2.setAutoExposureLogging = function setAutoExposureLogging(value) {
      throw "IMPLEMENT setAutoExposureLogging";
    };

    _proto2.inExperiment = function inExperiment() {
      throw "IMPLEMENT inExperiment";
    };

    _proto2.get = function get(name, defaultVal) {
      throw "IMPLEMENT get";
    };

    _proto2.logExposure = function logExposure(extras) {
      throw "IMPLEMENT logExposure";
    };

    _proto2.logEvent = function logEvent(eventType, extras) {
      throw "IMPLEMENT logEvent";
    };

    _proto2.requireExperiment = function requireExperiment() {
      if (!this._experiment) {
        this._assignExperiment();
      }
    };

    _proto2.requireDefaultExperiment = function requireDefaultExperiment() {
      if (!this._defaultExperiment) {
        this._assignDefaultExperiment();
      }
    };

    return Namespace;
  }();

  var SimpleNamespace =
  /*#__PURE__*/
  function (_Namespace) {
    _inheritsLoose(SimpleNamespace, _Namespace);

    function SimpleNamespace(args) {
      var _this;

      _this = _Namespace.call(this, args) || this;
      _this.inputs = args || {};
      _this.numSegments = 1;
      _this.segmentAllocations = {};
      _this.currentExperiments = {};
      _this._experiment = null;
      _this._defaultExperiment = null;
      _this.defaultExperimentClass = DefaultExperiment;
      _this._inExperiment = false;

      _this.setupDefaults();

      _this.setup();

      if (!_this.name) {
        throw "setup() must set a namespace name via this.setName()";
      }

      _this.availableSegments = range(_this.numSegments);

      _this.setupExperiments();

      return _this;
    }

    var _proto3 = SimpleNamespace.prototype;

    _proto3.setupDefaults = function setupDefaults() {
      return;
    };

    _proto3.setup = function setup() {
      throw "IMPLEMENT setup";
    };

    _proto3.setupExperiments = function setupExperiments() {
      throw "IMPLEMENT setupExperiments";
    };

    _proto3.getPrimaryUnit = function getPrimaryUnit() {
      return this._primaryUnit;
    };

    _proto3.allowedOverride = function allowedOverride() {
      return false;
    };

    _proto3.getOverrides = function getOverrides() {
      return {};
    };

    _proto3.setPrimaryUnit = function setPrimaryUnit(value) {
      this._primaryUnit = value;
    };

    _proto3.addExperiment = function addExperiment(name, expObject, segments) {
      var numberAvailable = this.availableSegments.length;

      if (numberAvailable < segments) {
        return false;
      } else if (this.currentExperiments[name] !== undefined) {
        return false;
      }

      var a = new Assignment(this.name);
      a.set('sampled_segments', new Random.Sample({
        'choices': this.availableSegments,
        'draws': segments,
        'unit': name
      }));
      var sample = a.get('sampled_segments');

      for (var i = 0; i < sample.length; i++) {
        this.segmentAllocations[sample[i]] = name;
        var currentIndex = this.availableSegments.indexOf(sample[i]);
        this.availableSegments[currentIndex] = this.availableSegments[numberAvailable - 1];
        this.availableSegments.splice(numberAvailable - 1, 1);
        numberAvailable -= 1;
      }

      this.currentExperiments[name] = expObject;
    };

    _proto3.removeExperiment = function removeExperiment(name) {
      var _this2 = this;

      if (this.currentExperiments[name] === undefined) {
        return false;
      }

      forEach(Object.keys(this.segmentAllocations), function (cur) {
        if (_this2.segmentAllocations[cur] === name) {
          delete _this2.segmentAllocations[cur];

          _this2.availableSegments.push(cur);
        }
      });
      delete this.currentExperiments[name];
      return true;
    };

    _proto3.getSegment = function getSegment() {
      var a = new Assignment(this.name);
      var segment = new Random.RandomInteger({
        'min': 0,
        'max': this.numSegments - 1,
        'unit': this.inputs[this.getPrimaryUnit()]
      });
      a.set('segment', segment);
      return a.get('segment');
    };

    _proto3._assignExperiment = function _assignExperiment() {
      this.inputs = extend(this.inputs, getExperimentInputs(this.getName()));
      var segment = this.getSegment();

      if (this.segmentAllocations[segment] !== undefined) {
        var experimentName = this.segmentAllocations[segment];

        this._assignExperimentObject(experimentName);
      }
    };

    _proto3._assignExperimentObject = function _assignExperimentObject(experimentName) {
      var experiment = new this.currentExperiments[experimentName](this.inputs);
      experiment.setName(this.getName() + "-" + experimentName);
      experiment.setSalt(this.getName() + "-" + experimentName);
      this._experiment = experiment;
      this._inExperiment = experiment.inExperiment();

      if (!this._inExperiment) {
        this._assignDefaultExperiment();
      }
    };

    _proto3._assignDefaultExperiment = function _assignDefaultExperiment() {
      this._defaultExperiment = new this.defaultExperimentClass(this.inputs);
    };

    _proto3.defaultGet = function defaultGet(name, default_val) {
      _Namespace.prototype.requireDefaultExperiment.call(this);

      return this._defaultExperiment.get(name, default_val);
    };

    _proto3.getName = function getName() {
      return this.name;
    };

    _proto3.setName = function setName(name) {
      this.name = name;
    };

    _proto3.previouslyLogged = function previouslyLogged() {
      if (this._experiment) {
        return this._experiment.previouslyLogged();
      }

      return null;
    };

    _proto3.inExperiment = function inExperiment() {
      _Namespace.prototype.requireExperiment.call(this);

      return this._inExperiment;
    };

    _proto3.setAutoExposureLogging = function setAutoExposureLogging(value) {
      this._autoExposureLoggingSet = value;

      if (this._defaultExperiment) {
        this._defaultExperiment.setAutoExposureLogging(value);
      }

      if (this._experiment) {
        this._experiment.setAutoExposureLogging(value);
      }
    };

    _proto3.setGlobalOverride = function setGlobalOverride(name) {
      var globalOverrides = this.getOverrides();

      if (globalOverrides && hasKey(globalOverrides, name)) {
        var overrides = globalOverrides[name];

        if (overrides && hasKey(this.currentExperiments, overrides.experimentName)) {
          this._assignExperimentObject(overrides.experimentName);

          this._experiment.addOverride(name, overrides.value);
        }
      }
    };

    _proto3.setLocalOverride = function setLocalOverride(name) {
      var experimentName = getParameterByName('experimentOverride');

      if (experimentName && hasKey(this.currentExperiments, experimentName)) {
        this._assignExperimentObject(experimentName);

        if (getParameterByName(name)) {
          this._experiment.addOverride(name, getParameterByName(name));
        }
      }
    };

    _proto3.getParams = function getParams(experimentName) {
      _Namespace.prototype.requireExperiment.call(this);

      if (this._experiment && this.getOriginalExperimentName() === experimentName) {
        return this._experiment.getParams();
      } else {
        return null;
      }
    };

    _proto3.getOriginalExperimentName = function getOriginalExperimentName() {
      if (this._experiment) {
        return this._experiment.getName().split('-')[1];
      }

      return null;
    };

    _proto3.get = function get(name, defaultVal) {
      _Namespace.prototype.requireExperiment.call(this);

      if (this.allowedOverride()) {
        this.setGlobalOverride(name);
      }

      this.setLocalOverride(name);

      if (!this._experiment) {
        return this.defaultGet(name, defaultVal);
      } else {
        if (this._autoExposureLoggingSet !== undefined) {
          this._experiment.setAutoExposureLogging(this._autoExposureLoggingSet);
        }

        return this._experiment.get(name, this.defaultGet(name, defaultVal));
      }
    };

    _proto3.logExposure = function logExposure(extras) {
      _Namespace.prototype.requireExperiment.call(this);

      if (!this._experiment) {
        return;
      }

      this._experiment.logExposure(extras);
    };

    _proto3.logEvent = function logEvent(eventType, extras) {
      _Namespace.prototype.requireExperiment.call(this);

      if (!this._experiment) {
        return;
      }

      this._experiment.logEvent(eventType, extras);
    };

    return SimpleNamespace;
  }(Namespace);

  return {
    Namespace: Namespace,
    SimpleNamespace: SimpleNamespace
  };
}

var planoutAPIFactory = (function (_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$Random = _ref.Random,
      Random = _ref$Random === void 0 ? null : _ref$Random;

  // Provide our operations to the OpsUtils module
  initializeOperators(Core, Random); // Inject our Random and other dependencies into our modules

  var Assignment = provideAssignment(Random);
  var Experiment = provideExperiment(Assignment);
  var Interpreter = provideInterpreter(OpsUtils, Assignment);
  var Namespace = provideNamespace(Random, Assignment, Experiment);
  return {
    Assignment: Assignment,
    Experiment: Experiment,
    ExperimentSetup: ExperimentSetup,
    Interpreter: Interpreter,
    Ops: {
      Random: Random,
      Core: Core,
      Base: Base
    },
    Namespace: Namespace
  };
});

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var crypt = createCommonjsModule(function (module) {
(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();
});

var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

var charenc_1 = charenc;

var sha1 = createCommonjsModule(function (module) {
(function() {
  var crypt$1 = crypt,
      utf8 = charenc_1.utf8,
      bin = charenc_1.bin,

  // The core
  sha1 = function (message) {
    // Convert to byte array
    if (message.constructor == String)
      message = utf8.stringToBytes(message);
    else if (!Array.isArray(message))
      message = message.toString();

    // otherwise assume byte array

    var m  = crypt$1.bytesToWords(message),
        l  = message.length * 8,
        w  = [],
        H0 =  1732584193,
        H1 = -271733879,
        H2 = -1732584194,
        H3 =  271733878,
        H4 = -1009589776;

    // Padding
    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >>> 9) << 4) + 15] = l;

    for (var i = 0; i < m.length; i += 16) {
      var a = H0,
          b = H1,
          c = H2,
          d = H3,
          e = H4;

      for (var j = 0; j < 80; j++) {

        if (j < 16)
          w[j] = m[i + j];
        else {
          var n = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
          w[j] = (n << 1) | (n >>> 31);
        }

        var t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + (
                j < 20 ? (H1 & H2 | ~H1 & H3) + 1518500249 :
                j < 40 ? (H1 ^ H2 ^ H3) + 1859775393 :
                j < 60 ? (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588 :
                         (H1 ^ H2 ^ H3) - 899497514);

        H4 = H3;
        H3 = H2;
        H2 = (H1 << 30) | (H1 >>> 2);
        H1 = H0;
        H0 = t;
      }

      H0 += a;
      H1 += b;
      H2 += c;
      H3 += d;
      H4 += e;
    }

    return [H0, H1, H2, H3, H4];
  },

  // Public API
  api = function (message, options) {
    var digestbytes = crypt$1.wordsToBytes(sha1(message));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt$1.bytesToHex(digestbytes);
  };

  api._blocksize = 16;
  api._digestsize = 20;

  module.exports = api;
})();
});

var PlanOutOpRandom =
/*#__PURE__*/
function (_PlanOutOpSimple) {
  _inheritsLoose(PlanOutOpRandom, _PlanOutOpSimple);

  function PlanOutOpRandom() {
    return _PlanOutOpSimple.apply(this, arguments) || this;
  }

  var _proto = PlanOutOpRandom.prototype;

  _proto.hashCalculation = function hashCalculation(hash) {
    return parseInt(hash.substr(0, 13), 16);
  };

  _proto.zeroToOneCalculation = function zeroToOneCalculation(appendedUnit) {
    // 0xFFFFFFFFFFFFF == LONG_SCALE
    return this.getHash(appendedUnit) / 0xFFFFFFFFFFFFF;
  };

  _proto.getUnit = function getUnit(appendedUnit) {
    var unit = this.getArgMixed('unit');

    if (!isArray(unit)) {
      unit = [unit];
    }

    if (appendedUnit) {
      unit.push(appendedUnit);
    }

    return unit;
  };

  _proto.getUniform = function getUniform(minVal, maxVal, appendedUnit) {
    if (minVal === void 0) {
      minVal = 0.0;
    }

    if (maxVal === void 0) {
      maxVal = 1.0;
    }

    var zeroToOne = this.zeroToOneCalculation(appendedUnit);
    return zeroToOne * (maxVal - minVal) + minVal;
  };

  _proto.getHash = function getHash(appendedUnit) {
    var fullSalt;

    if (this.args.full_salt) {
      fullSalt = this.getArgString('full_salt') + '.';
    } else {
      var salt = this.getArgString('salt');
      fullSalt = this.mapper.get('experimentSalt') + '.' + salt + this.mapper.get('saltSeparator');
    }

    var unitStr = this.getUnit(appendedUnit).map(function (element) {
      return String(element);
    }).join('.');
    var hashStr = fullSalt + unitStr;
    var hash = sha1(hashStr);
    return this.hashCalculation(hash);
  };

  return PlanOutOpRandom;
}(PlanOutOpSimple);

var RandomFloatBuilder = function RandomFloatBuilder(RandomOpsClass) {
  return (
    /*#__PURE__*/
    function (_RandomOpsClass) {
      _inheritsLoose(_class, _RandomOpsClass);

      function _class() {
        return _RandomOpsClass.apply(this, arguments) || this;
      }

      var _proto2 = _class.prototype;

      _proto2.simpleExecute = function simpleExecute() {
        var minVal = this.getArgNumber('min');
        var maxVal = this.getArgNumber('max');
        return this.getUniform(minVal, maxVal);
      };

      return _class;
    }(RandomOpsClass)
  );
};

var RandomIntegerBuilder = function RandomIntegerBuilder(RandomOpsClass) {
  return (
    /*#__PURE__*/
    function (_RandomOpsClass2) {
      _inheritsLoose(_class2, _RandomOpsClass2);

      function _class2() {
        return _RandomOpsClass2.apply(this, arguments) || this;
      }

      var _proto3 = _class2.prototype;

      _proto3.randomIntegerCalculation = function randomIntegerCalculation(minVal, maxVal) {
        return (this.getHash() + minVal) % (maxVal - minVal + 1);
      };

      _proto3.simpleExecute = function simpleExecute() {
        var minVal = this.getArgNumber('min');
        var maxVal = this.getArgNumber('max');
        return this.randomIntegerCalculation(minVal, maxVal);
      };

      return _class2;
    }(RandomOpsClass)
  );
};

var BernoulliTrialBuilder = function BernoulliTrialBuilder(RandomOpsClass) {
  return (
    /*#__PURE__*/
    function (_RandomOpsClass3) {
      _inheritsLoose(_class3, _RandomOpsClass3);

      function _class3() {
        return _RandomOpsClass3.apply(this, arguments) || this;
      }

      var _proto4 = _class3.prototype;

      _proto4.simpleExecute = function simpleExecute() {
        var p = this.getArgNumber('p');

        if (p < 0 || p > 1) {
          throw "Invalid probability";
        }

        if (this.getUniform(0.0, 1.0) <= p) {
          return 1;
        } else {
          return 0;
        }
      };

      return _class3;
    }(RandomOpsClass)
  );
};

var BernoulliFilterBuilder = function BernoulliFilterBuilder(RandomOpsClass) {
  return (
    /*#__PURE__*/
    function (_RandomOpsClass4) {
      _inheritsLoose(_class4, _RandomOpsClass4);

      function _class4() {
        return _RandomOpsClass4.apply(this, arguments) || this;
      }

      var _proto5 = _class4.prototype;

      _proto5.simpleExecute = function simpleExecute() {
        var p = this.getArgNumber('p');
        var values = this.getArgList('choices');

        if (p < 0 || p > 1) {
          throw "Invalid probability";
        }

        if (values.length == 0) {
          return [];
        }

        var ret = [];

        for (var i = 0; i < values.length; i++) {
          var cur = values[i];

          if (this.getUniform(0.0, 1.0, cur) <= p) {
            ret.push(cur);
          }
        }

        return ret;
      };

      return _class4;
    }(RandomOpsClass)
  );
};

var UniformChoiceBuilder = function UniformChoiceBuilder(OpRandomClass) {
  return (
    /*#__PURE__*/
    function (_OpRandomClass) {
      _inheritsLoose(_class5, _OpRandomClass);

      function _class5() {
        return _OpRandomClass.apply(this, arguments) || this;
      }

      var _proto6 = _class5.prototype;

      _proto6.randomIndexCalculation = function randomIndexCalculation(choices) {
        return this.getHash() % choices.length;
      };

      _proto6.simpleExecute = function simpleExecute() {
        var choices = this.getArgList('choices');

        if (choices.length === 0) {
          return [];
        }

        var randIndex = this.randomIndexCalculation(choices);
        return choices[randIndex];
      };

      return _class5;
    }(OpRandomClass)
  );
};

var WeightedChoiceBuilder = function WeightedChoiceBuilder(RandomOpsClass) {
  return (
    /*#__PURE__*/
    function (_RandomOpsClass5) {
      _inheritsLoose(_class6, _RandomOpsClass5);

      function _class6() {
        return _RandomOpsClass5.apply(this, arguments) || this;
      }

      var _proto7 = _class6.prototype;

      _proto7.simpleExecute = function simpleExecute() {
        var choices = this.getArgList('choices');
        var weights = this.getArgList('weights');

        if (choices.length === 0) {
          return [];
        }

        var cumSum = 0;
        var cumWeights = weights.map(function (weight) {
          cumSum += weight;
          return cumSum;
        });
        var stopVal = this.getUniform(0.0, cumSum);

        for (var i = 0; i < cumWeights.length; ++i) {
          if (stopVal <= cumWeights[i]) {
            return choices[i];
          }
        }
      };

      return _class6;
    }(RandomOpsClass)
  );
};

var SampleBuilder = function SampleBuilder(RandomOpsClass) {
  return (
    /*#__PURE__*/
    function (_RandomOpsClass6) {
      _inheritsLoose(_class7, _RandomOpsClass6);

      function _class7() {
        return _RandomOpsClass6.apply(this, arguments) || this;
      }

      var _proto8 = _class7.prototype;

      _proto8.sampleIndexCalculation = function sampleIndexCalculation(i) {
        return this.getHash(i) % (i + 1);
      };

      _proto8.allowSampleStoppingPoint = function allowSampleStoppingPoint() {
        return true;
      };

      _proto8.sample = function sample(array, numDraws) {
        var len = array.length;
        var stoppingPoint = len - numDraws;
        var allowStoppingPoint = this.allowSampleStoppingPoint();

        for (var i = len - 1; i > 0; i--) {
          var j = this.sampleIndexCalculation(i);
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;

          if (allowStoppingPoint && stoppingPoint === i) {
            return array.slice(i, len);
          }
        }

        return array.slice(0, numDraws);
      };

      _proto8.simpleExecute = function simpleExecute() {
        var choices = shallowCopy(this.getArgList('choices'));
        var numDraws = 0;

        if (this.args.draws !== undefined) {
          numDraws = this.getArgNumber('draws');
        } else {
          numDraws = choices.length;
        }

        return this.sample(choices, numDraws);
      };

      return _class7;
    }(RandomOpsClass)
  );
};

var Sample = SampleBuilder(PlanOutOpRandom);
var WeightedChoice = WeightedChoiceBuilder(PlanOutOpRandom);
var UniformChoice = UniformChoiceBuilder(PlanOutOpRandom);
var BernoulliFilter = BernoulliFilterBuilder(PlanOutOpRandom);
var BernoulliTrial = BernoulliTrialBuilder(PlanOutOpRandom);
var RandomInteger = RandomIntegerBuilder(PlanOutOpRandom);
var RandomFloat = RandomFloatBuilder(PlanOutOpRandom);

var Random = /*#__PURE__*/Object.freeze({
  PlanOutOpRandom: PlanOutOpRandom,
  Sample: Sample,
  WeightedChoice: WeightedChoice,
  UniformChoice: UniformChoice,
  BernoulliFilter: BernoulliFilter,
  BernoulliTrial: BernoulliTrial,
  RandomInteger: RandomInteger,
  RandomFloat: RandomFloat
});

var index = planoutAPIFactory({
  Random: Random
});

exports.default = index;
