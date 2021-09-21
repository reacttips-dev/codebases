'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.providerContextTypes = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// TODO(jez) 'sync' and 'async' are bad tag names.
// TODO(jez) What if redux also uses this.context.tag?
var providerContextTypes = exports.providerContextTypes = {
  tag: _propTypes2.default.string.isRequired,
  stripe: _propTypes2.default.object,
  addStripeLoadListener: _propTypes2.default.func
};

var getOrCreateStripe = function getOrCreateStripe(apiKey, options) {
  /**
   * Note that this is not meant to be a generic memoization solution.
   * This is specifically a solution for `StripeProvider`s being initialized
   * and destroyed regularly (with the same set of props) when users only
   * use `StripeProvider` for the subtree that contains their checkout form.
   */
  window.Stripe.__cachedInstances = window.Stripe.__cachedInstances || {};
  var cacheKey = 'key=' + apiKey + ' options=' + JSON.stringify(options);

  var stripe = window.Stripe.__cachedInstances[cacheKey] || window.Stripe(apiKey, options);
  window.Stripe.__cachedInstances[cacheKey] = stripe;

  return stripe;
};

var ensureStripeShape = function ensureStripeShape(stripe) {
  if (stripe && stripe.elements && stripe.createSource && stripe.createToken) {
    return stripe;
  } else {
    throw new Error("Please pass a valid Stripe object to StripeProvider. You can obtain a Stripe object by calling 'Stripe(...)' with your publishable key.");
  }
};

var Provider = function (_React$Component) {
  _inherits(Provider, _React$Component);

  // on the other hand: childContextTypes is *required* to use context.
  function Provider(props) {
    _classCallCheck(this, Provider);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    if (_this.props.apiKey && _this.props.stripe) {
      throw new Error("Please pass either 'apiKey' or 'stripe' to StripeProvider, not both.");
    } else if (_this.props.apiKey) {
      if (!window.Stripe) {
        throw new Error("Please load Stripe.js (https://js.stripe.com/v3/) on this page to use react-stripe-elements. If Stripe.js isn't available yet (it's loading asynchronously, or you're using server-side rendering), see https://github.com/stripe/react-stripe-elements#advanced-integrations");
      } else {
        var _this$props = _this.props,
            _apiKey = _this$props.apiKey,
            _children = _this$props.children,
            _stripe = _this$props.stripe,
            options = _objectWithoutProperties(_this$props, ['apiKey', 'children', 'stripe']);

        _this._meta = {
          tag: 'sync',
          stripe: getOrCreateStripe(_apiKey, options)
        };
      }
    } else if (_this.props.stripe) {
      // If we already have a stripe instance (in the constructor), we can behave synchronously.
      _this._meta = {
        tag: 'sync',
        stripe: ensureStripeShape(_this.props.stripe)
      };
    } else if (_this.props.stripe === null) {
      _this._meta = {
        tag: 'async',
        stripe: null
      };
    } else {
      throw new Error("Please pass either 'apiKey' or 'stripe' to StripeProvider. If you're using 'stripe' but don't have a Stripe instance yet, pass 'null' explicitly.");
    }

    _this._didWarn = false;
    _this._didWakeUpListeners = false;
    _this._listeners = [];
    return _this;
  }
  // Even though we're using flow, also use PropTypes so we can take advantage of developer warnings.


  Provider.prototype.getChildContext = function getChildContext() {
    var _this2 = this;

    // getChildContext is run after the constructor, so we WILL have access to
    // the initial state.
    //
    // However, context doesn't update in respnse to state changes like you
    // might expect: context is pulled by the child, not pushed by the parent.
    if (this._meta.tag === 'sync') {
      return {
        tag: 'sync',
        stripe: this._meta.stripe
      };
    } else {
      return {
        tag: 'async',
        addStripeLoadListener: function addStripeLoadListener(fn) {
          if (_this2._meta.stripe) {
            fn(_this2._meta.stripe);
          } else {
            _this2._listeners.push(fn);
          }
        }
      };
    }
  };

  Provider.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var apiKeyChanged = this.props.apiKey && nextProps.apiKey && this.props.apiKey !== nextProps.apiKey;

    var stripeInstanceChanged = this.props.stripe && nextProps.stripe && this.props.stripe !== nextProps.stripe;
    if (!this._didWarn && (apiKeyChanged || stripeInstanceChanged) && window.console && window.console.error) {
      this._didWarn = true;
      // eslint-disable-next-line no-console
      console.error('StripeProvider does not support changing the apiKey parameter.');
      return;
    }

    if (!this._didWakeUpListeners && nextProps.stripe) {
      // Wake up the listeners if we've finally been given a StripeShape
      this._didWakeUpListeners = true;
      var _stripe2 = ensureStripeShape(nextProps.stripe);
      this._meta.stripe = _stripe2;
      this._listeners.forEach(function (fn) {
        fn(_stripe2);
      });
    }
  };

  Provider.prototype.render = function render() {
    return _react2.default.Children.only(this.props.children);
  };

  return Provider;
}(_react2.default.Component);

Provider.propTypes = {
  apiKey: _propTypes2.default.string,
  // PropTypes.object is the only way we can accept a Stripe instance
  // eslint-disable-next-line react/forbid-prop-types
  stripe: _propTypes2.default.object,
  children: _propTypes2.default.node
};
Provider.childContextTypes = providerContextTypes;
Provider.defaultProps = {
  apiKey: undefined,
  stripe: undefined,
  children: null
};
exports.default = Provider;