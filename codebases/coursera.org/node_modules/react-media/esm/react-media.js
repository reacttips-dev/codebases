import _extends from '@babel/runtime/helpers/esm/extends';
import _inheritsLoose from '@babel/runtime/helpers/esm/inheritsLoose';
import _assertThisInitialized from '@babel/runtime/helpers/esm/assertThisInitialized';
import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import json2mq from 'json2mq';

var MediaQueryListener =
/*#__PURE__*/
function () {
  function MediaQueryListener(targetWindow, query, listener) {
    var _this = this;

    this.nativeMediaQueryList = targetWindow.matchMedia(query);
    this.active = true; // Safari doesn't clear up listener with removeListener
    // when the listener is already waiting in the event queue.
    // Having an active flag to make sure the listener is not called
    // after we removeListener.

    this.cancellableListener = function () {
      _this.matches = _this.nativeMediaQueryList.matches;

      if (_this.active) {
        listener.apply(void 0, arguments);
      }
    };

    this.nativeMediaQueryList.addListener(this.cancellableListener);
    this.matches = this.nativeMediaQueryList.matches;
  }

  var _proto = MediaQueryListener.prototype;

  _proto.cancel = function cancel() {
    this.active = false;
    this.nativeMediaQueryList.removeListener(this.cancellableListener);
  };

  return MediaQueryListener;
}();

var queryType = PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.arrayOf(PropTypes.object.isRequired)]);
/**
 * Conditionally renders based on whether or not a media query matches.
 */

var Media =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(Media, _React$Component);

  function Media(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "queries", []);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getMatches", function () {
      var result = _this.queries.reduce(function (acc, _ref) {
        var _extends2;

        var name = _ref.name,
            mqListener = _ref.mqListener;
        return _extends({}, acc, (_extends2 = {}, _extends2[name] = mqListener.matches, _extends2));
      }, {}); // return result;


      return unwrapSingleQuery(result);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "updateMatches", function () {
      var newMatches = _this.getMatches();

      _this.setState(function () {
        return {
          matches: newMatches
        };
      }, _this.onChange);
    });

    !(!(!props.query && !props.queries) || props.query && props.queries) ? process.env.NODE_ENV !== "production" ? invariant(false, '<Media> must be supplied with either "query" or "queries"') : invariant(false) : void 0;
    !(props.defaultMatches === undefined || !props.query || typeof props.defaultMatches === "boolean") ? process.env.NODE_ENV !== "production" ? invariant(false, "<Media> when query is set, defaultMatches must be a boolean, received " + typeof props.defaultMatches) : invariant(false) : void 0;
    !(props.defaultMatches === undefined || !props.queries || typeof props.defaultMatches === "object") ? process.env.NODE_ENV !== "production" ? invariant(false, "<Media> when queries is set, defaultMatches must be a object of booleans, received " + typeof props.defaultMatches) : invariant(false) : void 0;

    if (typeof window !== "object") {
      // In case we're rendering on the server, apply the default matches
      var matches;

      if (props.defaultMatches !== undefined) {
        matches = props.defaultMatches;
      } else if (props.query) {
        matches = true;
      }
      /* if (props.queries) */
      else {
          matches = Object.keys(_this.props.queries).reduce(function (acc, key) {
            var _extends3;

            return _extends({}, acc, (_extends3 = {}, _extends3[key] = true, _extends3));
          }, {});
        }

      _this.state = {
        matches: matches
      };
      return _assertThisInitialized(_this);
    }

    _this.initialize(); // Instead of calling this.updateMatches, we manually set the initial state to prevent
    // calling setState, which could trigger an unnecessary second render


    _this.state = {
      matches: _this.props.defaultMatches !== undefined ? _this.props.defaultMatches : _this.getMatches()
    };

    _this.onChange();

    return _this;
  }

  var _proto = Media.prototype;

  _proto.initialize = function initialize() {
    var _this2 = this;

    var targetWindow = this.props.targetWindow || window;
    !(typeof targetWindow.matchMedia === "function") ? process.env.NODE_ENV !== "production" ? invariant(false, "<Media targetWindow> does not support `matchMedia`.") : invariant(false) : void 0;
    var queries = this.props.queries || wrapInQueryObject(this.props.query);
    this.queries = Object.keys(queries).map(function (name) {
      var query = queries[name];
      var qs = typeof query !== "string" ? json2mq(query) : query;
      var mqListener = new MediaQueryListener(targetWindow, qs, _this2.updateMatches);
      return {
        name: name,
        mqListener: mqListener
      };
    });
  };

  _proto.componentDidMount = function componentDidMount() {
    this.initialize(); // If props.defaultMatches has been set, ensure we trigger a two-pass render.
    // This is useful for SSR with mismatching defaultMatches vs actual matches from window.matchMedia
    // Details: https://github.com/ReactTraining/react-media/issues/81

    if (this.props.defaultMatches !== undefined) {
      this.updateMatches();
    }
  };

  _proto.onChange = function onChange() {
    var onChange = this.props.onChange;

    if (onChange) {
      onChange(this.state.matches);
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.queries.forEach(function (_ref2) {
      var mqListener = _ref2.mqListener;
      return mqListener.cancel();
    });
  };

  _proto.render = function render() {
    var _this$props = this.props,
        children = _this$props.children,
        render = _this$props.render;
    var matches = this.state.matches;
    var isAnyMatches = typeof matches === "object" ? Object.keys(matches).some(function (key) {
      return matches[key];
    }) : matches;
    return render ? isAnyMatches ? render(matches) : null : children ? typeof children === "function" ? children(matches) : !Array.isArray(children) || children.length // Preact defaults to empty children array
    ? isAnyMatches ? // We have to check whether child is a composite component or not to decide should we
    // provide `matches` as a prop or not
    React.Children.only(children) && typeof React.Children.only(children).type === "string" ? React.Children.only(children) : React.cloneElement(React.Children.only(children), {
      matches: matches
    }) : null : null : null;
  };

  return Media;
}(React.Component);
/**
 * Wraps a single query in an object. This is used to provide backward compatibility with
 * the old `query` prop (as opposed to `queries`). If only a single query is passed, the object
 * will be unpacked down the line, but this allows our internals to assume an object of queries
 * at all times.
 */


_defineProperty(Media, "propTypes", {
  defaultMatches: PropTypes.oneOfType([PropTypes.bool, PropTypes.objectOf(PropTypes.bool)]),
  query: queryType,
  queries: PropTypes.objectOf(queryType),
  render: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  targetWindow: PropTypes.object,
  onChange: PropTypes.func
});

function wrapInQueryObject(query) {
  return {
    __DEFAULT__: query
  };
}
/**
 * Unwraps an object of queries, if it was originally passed as a single query.
 */


function unwrapSingleQuery(queryObject) {
  var queryNames = Object.keys(queryObject);

  if (queryNames.length === 1 && queryNames[0] === "__DEFAULT__") {
    return queryObject.__DEFAULT__;
  }

  return queryObject;
}

export default Media;
