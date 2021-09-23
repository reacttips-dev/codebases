'use es6';

import immutable, { List, Map as ImmutableMap, OrderedMap, Record, Set as ImmutableSet } from 'immutable';
import fromJSOrdered from './fromJSOrdered';
import * as overrides from './overrides';

var isDevelopment = function isDevelopment() {
  try {
    return overrides.development.enabled || window.location.pathname.includes('test') && window.location.pathname.includes('.html');
  } catch (e) {
    return false;
  }
};

var logger = {
  warn: isDevelopment() ? function (stack, title) {
    console.groupCollapsed("Warning: " + title);
    console.warn(); // for test suite

    for (var _len = arguments.length, messages = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      messages[_key - 2] = arguments[_key];
    }

    messages.forEach(function (message) {
      return typeof message === 'function' ? message() : console.log(message);
    });
    console.log("%c" + stack, 'color: red');
    console.groupEnd();
  } : function () {},
  error: isDevelopment() ? function (stack, title) {
    console.groupCollapsed("Error: " + title);
    console.error(); // for test suite

    for (var _len2 = arguments.length, messages = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      messages[_key2 - 2] = arguments[_key2];
    }

    messages.forEach(function (message) {
      return typeof message === 'function' ? message() : console.log(message);
    });
    console.log("%c" + stack, 'color: red');
    console.groupEnd();
  } : function () {}
};
var captureStackTrace = isDevelopment() ? function () {
  return new Error('').stack || 'Stack only available in certain browsers';
} : function () {
  return '';
};
var VALIDATE = 'validate';
var ANY = 'any';
var BOOLEAN = 'boolean';
var STRING = 'string';
var NUMBER = 'number';
var SYMBOL = 'symbol';
var FUNC = 'func';
var LIST = 'List';
var MAP = 'Map';
var RECORD = 'Record';
var POLY = 'Poly';

var type = function type(describe, evaluate) {
  evaluate.describe = describe;
  return evaluate;
};

var identity = function identity(any) {
  return any;
};

var result = function result(expression) {
  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return typeof expression === 'function' ? expression.apply(void 0, args) : expression;
};

var always = function always() {
  var expression = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  var constant = arguments.length > 1 ? arguments[1] : undefined;
  return type(function () {
    return Object.assign({}, expression.describe(), {
      always: constant
    });
  }, function (value) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$origin = _ref.origin,
        origin = _ref$origin === void 0 ? value : _ref$origin,
        parent = _ref.parent,
        path = _ref.path,
        _ref$stack = _ref.stack,
        stack = _ref$stack === void 0 ? captureStackTrace() : _ref$stack;

    if (value !== constant) {
      logger.warn(stack, "Mismatching value provided to always constant {" + path + "}", 'Name: always', "Path: " + path, 'Message: Expected constant value', function () {
        return console.log('Expected:', constant);
      }, function () {
        return console.log('Got:', value);
      }, function () {
        return console.log('Origin:', origin);
      });
    }

    return result(expression, constant, {
      origin: origin,
      parent: parent,
      path: path,
      stack: stack
    });
  });
};

var required = function required() {
  var expression = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  return type(function () {
    var description = expression.describe();
    delete description.optional;
    return description;
  }, function (value) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$origin = _ref2.origin,
        origin = _ref2$origin === void 0 ? value : _ref2$origin,
        parent = _ref2.parent,
        path = _ref2.path,
        _ref2$stack = _ref2.stack,
        stack = _ref2$stack === void 0 ? captureStackTrace() : _ref2$stack;

    if (value === undefined) {
      logger.warn(stack, "Missing required value at {" + path + "}", 'Name: required', "Path: " + path, 'Message: Expected defined value', function () {
        return console.log('Value:', value);
      }, function () {
        return console.log('Origin:', origin);
      });
    }

    return result(expression, value, {
      origin: origin,
      parent: parent,
      path: path,
      stack: stack
    });
  });
};

var optional = function optional() {
  var expression = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  return type(function () {
    return Object.assign({}, expression.describe(), {
      optional: true
    });
  }, function (value) {
    for (var _len4 = arguments.length, rest = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      rest[_key4 - 1] = arguments[_key4];
    }

    return value === undefined ? value : result.apply(void 0, [expression, value].concat(rest));
  });
};

var defaultValue = function defaultValue() {
  var expression = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  var fallback = arguments.length > 1 ? arguments[1] : undefined;
  return type(function () {
    return Object.assign({}, expression.describe(), {}, fallback ? {
      defaultValue: fallback
    } : {});
  }, function () {
    var maybeValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : fallback;

    for (var _len5 = arguments.length, rest = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      rest[_key5 - 1] = arguments[_key5];
    }

    return result.apply(void 0, [expression, maybeValue].concat(rest));
  });
};

var fromJS = function fromJS() {
  var expression = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  return function (value) {
    for (var _len6 = arguments.length, rest = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
      rest[_key6 - 1] = arguments[_key6];
    }

    return result.apply(void 0, [expression, immutable.fromJS(value)].concat(rest));
  };
};

var _fromJSOrdered = function _fromJSOrdered() {
  var expression = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  return function (value) {
    for (var _len7 = arguments.length, rest = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
      rest[_key7 - 1] = arguments[_key7];
    }

    return result.apply(void 0, [expression, fromJSOrdered(value)].concat(rest));
  };
};

var validate = function validate() {
  var expression = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : VALIDATE;
  var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  return function (value) {
    var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref3$origin = _ref3.origin,
        origin = _ref3$origin === void 0 ? value : _ref3$origin,
        parent = _ref3.parent,
        _ref3$path = _ref3.path,
        path = _ref3$path === void 0 ? name : _ref3$path,
        _ref3$stack = _ref3.stack,
        stack = _ref3$stack === void 0 ? captureStackTrace() : _ref3$stack;

    try {
      if (!result(expression, value, {
        origin: origin,
        parent: parent,
        path: path,
        stack: stack
      })) {
        logger.warn(stack, "Invalid value at {" + path + "}", "Name: " + name, "Path: " + path, typeof message === 'function' ? message : "Message: " + message, function () {
          return console.log('Value:', value);
        }, function () {
          return console.log('Origin:', origin);
        });
      }

      return value;
    } catch (validationError) {
      logger.error(stack, "Errored value at {" + path + "}", "Name: " + name, "Path: " + path, typeof message === 'function' ? message : "Message: " + message, function () {
        return console.log('Value:', value);
      }, function () {
        return console.log('Origin:', origin);
      }, function () {
        return console.log('Validation Error:', validationError);
      });
      throw validationError;
    }
  };
};

var chainable = function chainable(fn, name) {
  var pipe = function pipe(next) {
    return function () {
      var expression = next.apply(void 0, arguments);
      return type(expression.describe || fn.describe, chainable(function (value) {
        for (var _len8 = arguments.length, rest = new Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
          rest[_key8 - 1] = arguments[_key8];
        }

        return expression.apply(void 0, [fn.apply(void 0, [value].concat(rest))].concat(rest));
      }));
    };
  };

  var decorate = function decorate(decorator) {
    return function () {
      for (var _len9 = arguments.length, decorateArgs = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        decorateArgs[_key9] = arguments[_key9];
      }

      var expression = decorator.apply(void 0, [fn].concat(decorateArgs));
      return type(expression.describe || fn.describe, chainable(function (value) {
        var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref4$origin = _ref4.origin,
            origin = _ref4$origin === void 0 ? value : _ref4$origin,
            parent = _ref4.parent,
            _ref4$path = _ref4.path,
            path = _ref4$path === void 0 ? name : _ref4$path,
            _ref4$stack = _ref4.stack,
            stack = _ref4$stack === void 0 ? captureStackTrace() : _ref4$stack;

        return expression(value, {
          origin: origin,
          parent: parent,
          path: path,
          stack: stack
        });
      }));
    };
  };
  /* eslint-disable no-use-before-define */


  fn.validate = pipe(validate);
  fn.always = decorate(always);
  fn.required = decorate(required);
  fn.optional = decorate(optional);
  fn.defaultValue = decorate(defaultValue);
  fn.fromJS = decorate(fromJS);
  fn.fromJSOrdered = decorate(_fromJSOrdered);
  /* eslint-enable no-use-before-define */

  return fn;
};

export var any = function any() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ANY;
  return type(function () {
    return {
      type: ANY,
      name: name,
      label: name
    };
  }, chainable(validate(true, name), name));
};
export var boolean = function boolean() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : BOOLEAN;
  return type(function () {
    return {
      type: BOOLEAN,
      name: name,
      label: name
    };
  }, chainable(validate(function (value) {
    return typeof value === typeof true;
  }, name, 'Expected a boolean'), name).required());
};
export var number = function number() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : NUMBER;
  return type(function () {
    return {
      type: NUMBER,
      name: name,
      label: name
    };
  }, chainable(validate(function (value) {
    return typeof value === 'number';
  }, name, 'Expected a number'), name).required());
};
export var string = function string() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : STRING;
  return type(function () {
    return {
      type: STRING,
      name: name,
      label: name
    };
  }, chainable(validate(function (value) {
    return typeof value === 'string';
  }, name, 'Expected a string'), name).required());
};
export var symbol = function symbol() {
  var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : SYMBOL;
  var set = ImmutableSet(immutable.fromJS(list).toList());
  return type(function () {
    return {
      type: SYMBOL,
      name: name,
      label: name,
      set: set
    };
  }, chainable(validate(function (value) {
    return set.contains(value);
  }, name, function () {
    return console.log('Message: Expected one of', set.toJS());
  }), name).required());
};
export var func = function func() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : FUNC;
  return type(function () {
    return {
      type: FUNC,
      name: name,
      label: name
    };
  }, chainable(validate(function (value) {
    return typeof value === 'function';
  }, name, 'Expected a function'), name).required());
};
export var list = function list() {
  var expression = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : any();
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : LIST;
  return type(function () {
    var valueType = expression.describe();
    return {
      type: LIST,
      name: name,
      label: "List<" + valueType.label + ">",
      value: valueType
    };
  }, chainable(function (values) {
    var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref5$origin = _ref5.origin,
        origin = _ref5$origin === void 0 ? values : _ref5$origin,
        parent = _ref5.parent,
        _ref5$path = _ref5.path,
        path = _ref5$path === void 0 ? name : _ref5$path,
        _ref5$stack = _ref5.stack,
        stack = _ref5$stack === void 0 ? captureStackTrace() : _ref5$stack;

    try {
      return List(validate(function (arr) {
        if (Array.isArray(arr) || List.isList(arr)) {
          return true;
        }
        /* Validate will log it as an errored value & rethrow this error */


        throw new Error();
      }, name, 'Expected an Array or List')(values, {
        origin: origin,
        parent: parent,
        path: path,
        stack: stack
      })).map(function (value, key) {
        return result(expression, value, {
          origin: origin,
          parent: values,
          path: path + "[" + key + "]",
          stack: stack
        });
      });
    } catch (e) {
      /* Lets pass the value through, we already logged any possible errors */
      return values;
    }
  }, name).required());
};
export var kvmap = function kvmap() {
  var keyExpression = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : any();
  var valueExpression = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : any();
  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : MAP;
  return type(function () {
    var keyType = keyExpression.describe();
    var valueType = valueExpression.describe();
    return {
      type: MAP,
      name: name,
      label: "Map<" + keyType.label + ", " + valueType.label + ">",
      key: keyType,
      value: valueType
    };
  }, chainable(function (object) {
    var _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref6$origin = _ref6.origin,
        origin = _ref6$origin === void 0 ? object : _ref6$origin,
        parent = _ref6.parent,
        _ref6$path = _ref6.path,
        path = _ref6$path === void 0 ? name : _ref6$path,
        _ref6$stack = _ref6.stack,
        stack = _ref6$stack === void 0 ? captureStackTrace() : _ref6$stack;

    try {
      return ImmutableMap(validate(function (obj) {
        if (obj === Object(obj) || ImmutableMap.isMap(obj)) {
          return true;
        }
        /* Validate will log it as an errored value & rethrow this error */


        throw new Error();
      }, name, 'Expected an Object or Map')(object, {
        origin: origin,
        parent: parent,
        path: path,
        stack: stack
      })).mapKeys(function (key) {
        return result(keyExpression, key, {
          origin: origin,
          parent: object,
          path: path + "@" + key,
          stack: stack
        });
      }).map(function (value, key) {
        return result(valueExpression, value, {
          origin: origin,
          parent: object,
          path: path + "[" + key + "]",
          stack: stack
        });
      });
    } catch (e) {
      /* Lets pass the value through, we already logged any possible errors */
      return object;
    }
  }, name).required());
};
export var map = function map() {
  var valueExpression = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : any();
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MAP;
  return kvmap(string(), valueExpression, name);
};
export var record = function record(expressions) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : RECORD;
  var expressionMap = ImmutableMap(expressions);
  var defaultValues = expressionMap.map(function () {
    return undefined;
  }).toObject();
  var factory = Record(defaultValues, name);
  return type(function () {
    return {
      type: RECORD,
      name: name,
      label: name,
      fields: OrderedMap(expressions).map(function () {
        var expression = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : any();
        return expression.describe();
      })
    };
  }, chainable(function (object) {
    var _ref7 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref7$origin = _ref7.origin,
        origin = _ref7$origin === void 0 ? object : _ref7$origin,
        parent = _ref7.parent,
        _ref7$path = _ref7.path,
        path = _ref7$path === void 0 ? name : _ref7$path,
        _ref7$stack = _ref7.stack,
        stack = _ref7$stack === void 0 ? captureStackTrace() : _ref7$stack;

    var values = ImmutableMap(validate(function (obj) {
      return ImmutableMap(obj);
    }, name, 'Expected an Object or Map')(object, {
      origin: origin,
      parent: parent,
      path: path,
      stack: stack
    }));
    values.filter(function (_, key) {
      return !expressionMap.has(key);
    }).forEach(function (value, key) {
      logger.warn(stack, "Unexpected key at {" + path + "}", "Name: " + name, "Path: " + path, 'Message: Unexpected key for checked record', function () {
        return console.log('Key:', key);
      }, function () {
        return console.log('Value:', value);
      }, function () {
        return console.log('Origin:', origin);
      });
    });
    return factory(expressionMap.map(function () {
      var expression = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
      var key = arguments.length > 1 ? arguments[1] : undefined;
      return result(expression, values.get(key), {
        origin: origin,
        parent: object,
        path: path + "." + key,
        stack: stack
      });
    }));
  }, name).required());
};
export var recursive = function recursive(producer) {
  var recursiveExpression = type(function () {
    return {
      recursive: true
    };
  }, chainable(function () {
    return recursive(producer).apply(void 0, arguments);
  }).optional());
  var rootExpression = producer(recursiveExpression);

  var _rootExpression$descr = rootExpression.describe(),
      rootType = _rootExpression$descr.type,
      rootName = _rootExpression$descr.name,
      rootLabel = _rootExpression$descr.label;

  var recursiveDescription = Object.assign({
    type: rootType,
    name: rootName,
    label: rootLabel
  }, recursiveExpression.describe());

  recursiveExpression.describe = function () {
    return recursiveDescription;
  };

  return rootExpression;
};
export var poly = function poly(field, types) {
  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : POLY;
  return type(function () {
    return {
      type: POLY,
      name: name,
      label: name,
      field: field,
      types: OrderedMap(types).map(function () {
        var expression = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : any();
        return expression.describe();
      })
    };
  }, chainable(function (object) {
    var _ref8 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref8$origin = _ref8.origin,
        origin = _ref8$origin === void 0 ? object : _ref8$origin,
        parent = _ref8.parent,
        path = _ref8.path,
        _ref8$stack = _ref8.stack,
        stack = _ref8$stack === void 0 ? captureStackTrace() : _ref8$stack;

    try {
      var typeName = ImmutableMap.isMap(object) ? object.get(field) : object[field];
      var typeConstructor = types[typeName];
      return typeConstructor(object, {
        origin: origin,
        parent: parent,
        path: path,
        stack: stack
      });
    } catch (e) {
      try {
        validate(function () {
          throw e;
        }, name, 'Failed to construct poly type')(object, {
          origin: origin,
          parent: parent,
          path: path,
          stack: stack
        }); // eslint-disable-next-line no-empty
      } catch (ignored) {}
    }

    return object;
  }).required());
};