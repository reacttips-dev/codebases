(function webpackUniversalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory(require("react"));
  else if(typeof define === 'function' && define.amd)
    define(["react"], factory);
  else if(typeof exports === 'object')
    exports["useNamedRoutes"] = factory(require("react"));
  else
    root["useNamedRoutes"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_7__) {
return /******/ (function(modules) { // webpackBootstrap
/******/  // The module cache
/******/  var installedModules = {};

/******/  // The require function
/******/  function __webpack_require__(moduleId) {

/******/    // Check if module is in cache
/******/    if(installedModules[moduleId])
/******/      return installedModules[moduleId].exports;

/******/    // Create a new module (and put it into the cache)
/******/    var module = installedModules[moduleId] = {
/******/      exports: {},
/******/      id: moduleId,
/******/      loaded: false
/******/    };

/******/    // Execute the module function
/******/    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/    // Flag the module as loaded
/******/    module.loaded = true;

/******/    // Return the exports of the module
/******/    return module.exports;
/******/  }


/******/  // expose the modules object (__webpack_modules__)
/******/  __webpack_require__.m = modules;

/******/  // expose the module cache
/******/  __webpack_require__.c = installedModules;

/******/  // __webpack_public_path__
/******/  __webpack_require__.p = "";

/******/  // Load entry module and return exports
/******/  return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  exports.default = useNamedRoutes;

  var _invariant = __webpack_require__(6);

  var _invariant2 = _interopRequireDefault(_invariant);

  var _PatternUtils = __webpack_require__(1);

  var _RouteUtils = __webpack_require__(2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function makePaths(paths, route, basePath) {
    var path = route.path;
    var name = route.name;
    var indexRoute = route.indexRoute;
    var childRoutes = route.childRoutes;


    var fullPath = void 0;
    if (!path) {
      fullPath = basePath;
    } else if (path[0] === '/') {
      // TODO: This is getting deprecated.
      fullPath = path;
    } else if (basePath[basePath.length - 1] === '/') {
      fullPath = '' + basePath + path;
    } else {
      fullPath = basePath + '/' + path;
    }

    if (name) {
      /* eslint-disable no-param-reassign */
      paths[name] = fullPath;
      /* eslint-enable no-param-reassign */
    }

    if (indexRoute) {
      makePaths(paths, indexRoute, fullPath);
    }
    if (childRoutes) {
      childRoutes.forEach(function (childRoute) {
        return makePaths(paths, childRoute, fullPath);
      });
    }
  }

  function useNamedRoutes(createHistory) {
    return function () {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var history = createHistory(options);

      var routes = options.routes;

      var paths = {};
      (0, _RouteUtils.createRoutes)(routes).forEach(function (route) {
        return makePaths(paths, route, '/');
      });

      function resolveLocation(location) {
        var name = void 0;
        if (typeof location === 'string') {
          if (location[0] !== '/') {
            name = location;
          }
        } else {
          name = location.name;
        }
        if (!name) {
          return location;
        }

        var path = paths[name];
        !path ? (undefined) !== 'production' ? (0, _invariant2.default)(false, 'Unknown route: %s', name) : (0, _invariant2.default)(false) : void 0;

        return _extends({}, location, {
          pathname: (0, _PatternUtils.formatPattern)(path, location.params)
        });
      }

      function push(location) {
        history.push(resolveLocation(location));
      }

      function replace(location) {
        history.replace(resolveLocation(location));
      }

      function createPath(location) {
        return history.createPath(resolveLocation(location));
      }

      function createHref(location) {
        return history.createHref(resolveLocation(location));
      }

      function createLocation(location) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return history.createLocation.apply(history, [resolveLocation(location)].concat(args));
      }

      return _extends({}, history, {
        push: push,
        replace: replace,
        createPath: createPath,
        createHref: createHref,
        createLocation: createLocation
      });
    };
  }
  module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  exports.__esModule = true;
  exports.compilePattern = compilePattern;
  exports.matchPattern = matchPattern;
  exports.getParamNames = getParamNames;
  exports.getParams = getParams;
  exports.formatPattern = formatPattern;

  var _invariant = __webpack_require__(4);

  var _invariant2 = _interopRequireDefault(_invariant);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function _compilePattern(pattern) {
    var regexpSource = '';
    var paramNames = [];
    var tokens = [];

    var match = void 0,
        lastIndex = 0,
        matcher = /:([a-zA-Z_$][a-zA-Z0-9_$]*)|\*\*|\*|\(|\)/g;
    while (match = matcher.exec(pattern)) {
      if (match.index !== lastIndex) {
        tokens.push(pattern.slice(lastIndex, match.index));
        regexpSource += escapeRegExp(pattern.slice(lastIndex, match.index));
      }

      if (match[1]) {
        regexpSource += '([^/]+)';
        paramNames.push(match[1]);
      } else if (match[0] === '**') {
        regexpSource += '(.*)';
        paramNames.push('splat');
      } else if (match[0] === '*') {
        regexpSource += '(.*?)';
        paramNames.push('splat');
      } else if (match[0] === '(') {
        regexpSource += '(?:';
      } else if (match[0] === ')') {
        regexpSource += ')?';
      }

      tokens.push(match[0]);

      lastIndex = matcher.lastIndex;
    }

    if (lastIndex !== pattern.length) {
      tokens.push(pattern.slice(lastIndex, pattern.length));
      regexpSource += escapeRegExp(pattern.slice(lastIndex, pattern.length));
    }

    return {
      pattern: pattern,
      regexpSource: regexpSource,
      paramNames: paramNames,
      tokens: tokens
    };
  }

  var CompiledPatternsCache = {};

  function compilePattern(pattern) {
    if (!(pattern in CompiledPatternsCache)) CompiledPatternsCache[pattern] = _compilePattern(pattern);

    return CompiledPatternsCache[pattern];
  }

  /**
   * Attempts to match a pattern on the given pathname. Patterns may use
   * the following special characters:
   *
   * - :paramName     Matches a URL segment up to the next /, ?, or #. The
   *                  captured string is considered a "param"
   * - ()             Wraps a segment of the URL that is optional
   * - *              Consumes (non-greedy) all characters up to the next
   *                  character in the pattern, or to the end of the URL if
   *                  there is none
   * - **             Consumes (greedy) all characters up to the next character
   *                  in the pattern, or to the end of the URL if there is none
   *
   * The return value is an object with the following properties:
   *
   * - remainingPathname
   * - paramNames
   * - paramValues
   */
  function matchPattern(pattern, pathname) {
    // Ensure pattern starts with leading slash for consistency with pathname.
    if (pattern.charAt(0) !== '/') {
      pattern = '/' + pattern;
    }

    var _compilePattern2 = compilePattern(pattern);

    var regexpSource = _compilePattern2.regexpSource;
    var paramNames = _compilePattern2.paramNames;
    var tokens = _compilePattern2.tokens;


    if (pattern.charAt(pattern.length - 1) !== '/') {
      regexpSource += '/?'; // Allow optional path separator at end.
    }

    // Special-case patterns like '*' for catch-all routes.
    if (tokens[tokens.length - 1] === '*') {
      regexpSource += '$';
    }

    var match = pathname.match(new RegExp('^' + regexpSource, 'i'));
    if (match == null) {
      return null;
    }

    var matchedPath = match[0];
    var remainingPathname = pathname.substr(matchedPath.length);

    if (remainingPathname) {
      // Require that the match ends at a path separator, if we didn't match
      // the full path, so any remaining pathname is a new path segment.
      if (matchedPath.charAt(matchedPath.length - 1) !== '/') {
        return null;
      }

      // If there is a remaining pathname, treat the path separator as part of
      // the remaining pathname for properly continuing the match.
      remainingPathname = '/' + remainingPathname;
    }

    return {
      remainingPathname: remainingPathname,
      paramNames: paramNames,
      paramValues: match.slice(1).map(function (v) {
        return v && decodeURIComponent(v);
      })
    };
  }

  function getParamNames(pattern) {
    return compilePattern(pattern).paramNames;
  }

  function getParams(pattern, pathname) {
    var match = matchPattern(pattern, pathname);
    if (!match) {
      return null;
    }

    var paramNames = match.paramNames;
    var paramValues = match.paramValues;

    var params = {};

    paramNames.forEach(function (paramName, index) {
      params[paramName] = paramValues[index];
    });

    return params;
  }

  /**
   * Returns a version of the given pattern with params interpolated. Throws
   * if there is a dynamic segment of the pattern for which there is no param.
   */
  function formatPattern(pattern, params) {
    params = params || {};

    var _compilePattern3 = compilePattern(pattern);

    var tokens = _compilePattern3.tokens;

    var parenCount = 0,
        pathname = '',
        splatIndex = 0;

    var token = void 0,
        paramName = void 0,
        paramValue = void 0;
    for (var i = 0, len = tokens.length; i < len; ++i) {
      token = tokens[i];

      if (token === '*' || token === '**') {
        paramValue = Array.isArray(params.splat) ? params.splat[splatIndex++] : params.splat;

        !(paramValue != null || parenCount > 0) ? (undefined) !== 'production' ? (0, _invariant2.default)(false, 'Missing splat #%s for path "%s"', splatIndex, pattern) : (0, _invariant2.default)(false) : void 0;

        if (paramValue != null) pathname += encodeURI(paramValue);
      } else if (token === '(') {
        parenCount += 1;
      } else if (token === ')') {
        parenCount -= 1;
      } else if (token.charAt(0) === ':') {
        paramName = token.substring(1);
        paramValue = params[paramName];

        !(paramValue != null || parenCount > 0) ? (undefined) !== 'production' ? (0, _invariant2.default)(false, 'Missing "%s" parameter for path "%s"', paramName, pattern) : (0, _invariant2.default)(false) : void 0;

        if (paramValue != null) pathname += encodeURIComponent(paramValue);
      } else {
        pathname += token;
      }
    }

    return pathname.replace(/\/+/g, '/');
  }

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  exports.__esModule = true;

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  exports.isReactChildren = isReactChildren;
  exports.createRouteFromReactElement = createRouteFromReactElement;
  exports.createRoutesFromReactChildren = createRoutesFromReactChildren;
  exports.createRoutes = createRoutes;

  var _react = __webpack_require__(7);

  var _react2 = _interopRequireDefault(_react);

  var _routerWarning = __webpack_require__(3);

  var _routerWarning2 = _interopRequireDefault(_routerWarning);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function isValidChild(object) {
    return object == null || _react2.default.isValidElement(object);
  }

  function isReactChildren(object) {
    return isValidChild(object) || Array.isArray(object) && object.every(isValidChild);
  }

  function checkPropTypes(componentName, propTypes, props) {
    componentName = componentName || 'UnknownComponent';

    for (var propName in propTypes) {
      if (Object.prototype.hasOwnProperty.call(propTypes, propName)) {
        var error = propTypes[propName](props, propName, componentName);

        /* istanbul ignore if: error logging */
        if (error instanceof Error) (undefined) !== 'production' ? (0, _routerWarning2.default)(false, error.message) : void 0;
      }
    }
  }

  function createRoute(defaultProps, props) {
    return _extends({}, defaultProps, props);
  }

  function createRouteFromReactElement(element) {
    var type = element.type;
    var route = createRoute(type.defaultProps, element.props);

    if (type.propTypes) checkPropTypes(type.displayName || type.name, type.propTypes, route);

    if (route.children) {
      var childRoutes = createRoutesFromReactChildren(route.children, route);

      if (childRoutes.length) route.childRoutes = childRoutes;

      delete route.children;
    }

    return route;
  }

  /**
   * Creates and returns a routes object from the given ReactChildren. JSX
   * provides a convenient way to visualize how routes in the hierarchy are
   * nested.
   *
   *   import { Route, createRoutesFromReactChildren } from 'react-router'
   *
   *   const routes = createRoutesFromReactChildren(
   *     <Route component={App}>
   *       <Route path="home" component={Dashboard}/>
   *       <Route path="news" component={NewsFeed}/>
   *     </Route>
   *   )
   *
   * Note: This method is automatically used when you provide <Route> children
   * to a <Router> component.
   */
  function createRoutesFromReactChildren(children, parentRoute) {
    var routes = [];

    _react2.default.Children.forEach(children, function (element) {
      if (_react2.default.isValidElement(element)) {
        // Component classes may have a static create* method.
        if (element.type.createRouteFromReactElement) {
          var route = element.type.createRouteFromReactElement(element, parentRoute);

          if (route) routes.push(route);
        } else {
          routes.push(createRouteFromReactElement(element));
        }
      }
    });

    return routes;
  }

  /**
   * Creates and returns an array of routes from the given object which
   * may be a JSX route, a plain object route, or an array of either.
   */
  function createRoutes(routes) {
    if (isReactChildren(routes)) {
      routes = createRoutesFromReactChildren(routes);
    } else if (routes && !Array.isArray(routes)) {
      routes = [routes];
    }

    return routes;
  }

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  exports.__esModule = true;
  exports.default = routerWarning;
  exports._resetWarned = _resetWarned;

  var _warning = __webpack_require__(5);

  var _warning2 = _interopRequireDefault(_warning);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var warned = {};

  function routerWarning(falseToWarn, message) {
    // Only issue deprecation warnings once.
    if (message.indexOf('deprecated') !== -1) {
      if (warned[message]) {
        return;
      }

      warned[message] = true;
    }

    message = '[react-router] ' + message;

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    _warning2.default.apply(undefined, [falseToWarn, message].concat(args));
  }

  function _resetWarned() {
    warned = {};
  }

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

  /**
   * Copyright 2013-2015, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   */

  'use strict';

  /**
   * Use invariant() to assert state which your program assumes to be true.
   *
   * Provide sprintf-style format (only %s is supported) and arguments
   * to provide information about what broke and what you were
   * expecting.
   *
   * The invariant message will be stripped in production, but the invariant
   * will remain to ensure logic does not differ in production.
   */

  var invariant = function(condition, format, a, b, c, d, e, f) {
    if ((undefined) !== 'production') {
      if (format === undefined) {
        throw new Error('invariant requires an error message argument');
      }
    }

    if (!condition) {
      var error;
      if (format === undefined) {
        error = new Error(
          'Minified exception occurred; use the non-minified dev environment ' +
          'for the full error message and additional helpful warnings.'
        );
      } else {
        var args = [a, b, c, d, e, f];
        var argIndex = 0;
        error = new Error(
          format.replace(/%s/g, function() { return args[argIndex++]; })
        );
        error.name = 'Invariant Violation';
      }

      error.framesToPop = 1; // we don't care about invariant's own frame
      throw error;
    }
  };

  module.exports = invariant;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

  /**
   * Copyright 2014-2015, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   */

  'use strict';

  /**
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */

  var warning = function() {};

  if ((undefined) !== 'production') {
    warning = function(condition, format, args) {
      var len = arguments.length;
      args = new Array(len > 2 ? len - 2 : 0);
      for (var key = 2; key < len; key++) {
        args[key - 2] = arguments[key];
      }
      if (format === undefined) {
        throw new Error(
          '`warning(condition, format, ...args)` requires a warning ' +
          'message argument'
        );
      }

      if (format.length < 10 || (/^[s\W]*$/).test(format)) {
        throw new Error(
          'The warning format should be able to uniquely identify this ' +
          'warning. Please, use a more descriptive format than: ' + format
        );
      }

      if (!condition) {
        var argIndex = 0;
        var message = 'Warning: ' +
          format.replace(/%s/g, function() {
            return args[argIndex++];
          });
        if (typeof console !== 'undefined') {
          console.error(message);
        }
        try {
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          throw new Error(message);
        } catch(x) {}
      }
    };
  }

  module.exports = warning;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

  /**
   * Copyright 2013-2015, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   */

  'use strict';

  /**
   * Use invariant() to assert state which your program assumes to be true.
   *
   * Provide sprintf-style format (only %s is supported) and arguments
   * to provide information about what broke and what you were
   * expecting.
   *
   * The invariant message will be stripped in production, but the invariant
   * will remain to ensure logic does not differ in production.
   */

  var invariant = function(condition, format, a, b, c, d, e, f) {
    if ((undefined) !== 'production') {
      if (format === undefined) {
        throw new Error('invariant requires an error message argument');
      }
    }

    if (!condition) {
      var error;
      if (format === undefined) {
        error = new Error(
          'Minified exception occurred; use the non-minified dev environment ' +
          'for the full error message and additional helpful warnings.'
        );
      } else {
        var args = [a, b, c, d, e, f];
        var argIndex = 0;
        error = new Error(
          format.replace(/%s/g, function() { return args[argIndex++]; })
        );
        error.name = 'Invariant Violation';
      }

      error.framesToPop = 1; // we don't care about invariant's own frame
      throw error;
    }
  };

  module.exports = invariant;


/***/ },
/* 7 */
/***/ function(module, exports) {

  module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ }
/******/ ])
});
;
