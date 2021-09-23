'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import UILoadingSpinner from '../loading/UILoadingSpinner';
import { throwErrorAsync } from '../utils/ThrowError';
import { callIfPossible } from '../core/Functions';

function makeLoadable(loader) {
  var promise = null;
  var state = {
    loading: false,
    result: null,
    error: null
  };

  function init() {
    if (promise == null) {
      state.loading = true;
      state.result = null;
      state.error = null;
      promise = loader().then(function (result) {
        state.result = result;
        return result;
      }).catch(function (err) {
        state.error = err;
        var reportedErr = new Error('Loadable: error loading split chunk');
        reportedErr.stack = err.stack;
        throwErrorAsync(reportedErr); // report errors to console/Sentry/NR #5930

        throw err;
      }).finally(function () {
        state.loading = false;
      });
    }

    return promise;
  }

  function retry() {
    if (!state.loading) {
      promise = null;
    }

    return init();
  }

  function getState() {
    return state;
  }

  function subscribe(obs) {
    var unsubscribed = false;

    var unsubscribe = function unsubscribe() {
      unsubscribed = true;
    };

    init().then(function () {
      if (unsubscribed) return;
      callIfPossible(obs.next, state.result);
    }).catch(function () {
      if (unsubscribed) return;
      callIfPossible(obs.error, state.error);
    }).finally(function () {
      if (unsubscribed) return;
      callIfPossible(obs.complete);
    });
    return unsubscribe;
  }

  return {
    init: init,
    retry: retry,
    subscribe: subscribe,
    getState: getState
  };
}

function resolveImport(obj) {
  return obj && obj.__esModule ? obj.default : obj;
}

function renderResolved(result, props) {
  var ResolvedComponent = resolveImport(result);
  return /*#__PURE__*/_jsx(ResolvedComponent, Object.assign({}, props));
}

function RenderSpinner(_ref) {
  var pastDelay = _ref.pastDelay;
  if (pastDelay) return /*#__PURE__*/_jsx(UILoadingSpinner, {
    showResult: false
  });
  return null;
}

function RenderNothing() {
  return null;
}

export default function Loadable(options) {
  var _options$loader = options.loader,
      loader = _options$loader === void 0 ? null : _options$loader,
      _options$LoadingCompo = options.LoadingComponent,
      LoadingComponent = _options$LoadingCompo === void 0 ? RenderSpinner : _options$LoadingCompo,
      _options$ErrorCompone = options.ErrorComponent,
      ErrorComponent = _options$ErrorCompone === void 0 ? RenderNothing : _options$ErrorCompone,
      _options$delay = options.delay,
      delay = _options$delay === void 0 ? 200 : _options$delay,
      _options$render = options.render,
      _render = _options$render === void 0 ? renderResolved : _options$render,
      _options$spinnerMinRe = options.spinnerMinRenderTime,
      spinnerMinRenderTime = _options$spinnerMinRe === void 0 ? 50 : _options$spinnerMinRe;

  if (LoadingComponent == null) {
    throw new Error('UILoadable requires a `LoadingComponent`');
  }

  var _makeLoadable = makeLoadable(loader),
      init = _makeLoadable.init,
      retry = _makeLoadable.retry,
      getState = _makeLoadable.getState,
      subscribe = _makeLoadable.subscribe;

  var LoadableComponent = /*#__PURE__*/function (_Component) {
    _inherits(LoadableComponent, _Component);

    function LoadableComponent(props) {
      var _this;

      _classCallCheck(this, LoadableComponent);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(LoadableComponent).call(this, props));

      _this.retry = function () {
        _this.setState({
          error: null,
          loading: true
        }, function () {
          retry();

          _this._loadModule();
        });
      };

      init();

      var _getState = getState(),
          loading = _getState.loading,
          result = _getState.result,
          error = _getState.error;

      _this.state = {
        loading: loading,
        result: result,
        error: error,
        pastDelay: typeof delay === 'number' && delay <= 0,
        spinnerRenderIsLocked: false
      };
      return _this;
    }

    _createClass(LoadableComponent, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this._mounted = true;

        this._loadModule();
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this._mounted = false;

        this._clearTimers();

        callIfPossible(this._unsubscribe);
      }
    }, {
      key: "_loadModule",
      value: function _loadModule() {
        var _this2 = this;

        var _getState2 = getState(),
            loading = _getState2.loading; // bail if finished loading


        if (!loading) return;

        this._startTimers();

        this._unsubscribe = subscribe({
          next: function next(res) {
            _this2.setState({
              loading: false,
              result: res
            });
          },
          error: function error(err) {
            _this2.setState({
              loading: false,
              error: err
            });
          },
          complete: function complete() {
            _this2._clearTimers();
          }
        });
      }
    }, {
      key: "_lockSpinner",
      value: function _lockSpinner() {
        var _this3 = this;

        if (typeof spinnerMinRenderTime === 'number' && spinnerMinRenderTime > 0) {
          this.setState({
            spinnerRenderIsLocked: true
          }, function () {
            setTimeout(function () {
              if (!_this3._mounted) return;

              _this3.setState({
                spinnerRenderIsLocked: false
              });
            }, spinnerMinRenderTime);
          });
        }
      }
    }, {
      key: "_startTimers",
      value: function _startTimers() {
        var _this4 = this;

        if (typeof delay === 'number' && delay > 0) {
          this._delay = setTimeout(function () {
            _this4.setState({
              pastDelay: true
            }, function () {
              _this4._lockSpinner();
            });
          }, delay);
        }
      }
    }, {
      key: "_clearTimers",
      value: function _clearTimers() {
        clearTimeout(this._delay);
      }
    }, {
      key: "render",
      value: function render() {
        if (this.state.loading || this.state.error || this.state.spinnerRenderIsLocked) {
          var FallbackComponent = this.state.error ? ErrorComponent : LoadingComponent;
          return /*#__PURE__*/_jsx(FallbackComponent, {
            loading: this.state.loading,
            error: this.state.error,
            pastDelay: this.state.pastDelay,
            retry: this.retry
          });
        } else if (this.state.result) {
          return _render(this.state.result, this.props);
        } else {
          return null;
        }
      }
    }]);

    return LoadableComponent;
  }(Component);

  LoadableComponent.displayName = 'UILoadable';
  LoadableComponent.preload = init;
  return LoadableComponent;
}