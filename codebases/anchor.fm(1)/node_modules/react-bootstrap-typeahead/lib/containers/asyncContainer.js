'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_DELAY_MS = 200;

/**
 * HoC that encapsulates common behavior and functionality for doing
 * asynchronous searches, including:
 *
 *  - Debouncing user input
 *  - Query caching (optional)
 *  - Search prompt and empty results behaviors
 */
var asyncContainer = function asyncContainer(Typeahead) {
  var Container = function (_React$Component) {
    _inherits(Container, _React$Component);

    function Container() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, Container);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Container.__proto__ || Object.getPrototypeOf(Container)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        hasSelection: false,
        query: ''
      }, _this._getEmptyLabel = function () {
        var _this$props = _this.props,
            emptyLabel = _this$props.emptyLabel,
            isLoading = _this$props.isLoading,
            multiple = _this$props.multiple,
            promptText = _this$props.promptText,
            searchText = _this$props.searchText,
            useCache = _this$props.useCache;
        var _this$state = _this.state,
            hasSelection = _this$state.hasSelection,
            query = _this$state.query;


        if (!query.length || !multiple && hasSelection) {
          return promptText;
        }

        if (isLoading || useCache && !_this._cache[query]) {
          return searchText;
        }

        return emptyLabel;
      }, _this._handleChange = function (selected) {
        _this.setState({ hasSelection: !!selected.length }, function () {
          _this.props.onChange && _this.props.onChange(selected);
        });
      }, _this._handleInputChange = function (query) {
        _this.props.onInputChange && _this.props.onInputChange(query);
        _this._handleSearchDebounced(query);
      }, _this._handleSearch = function (initialQuery) {
        var _this$props2 = _this.props,
            caseSensitive = _this$props2.caseSensitive,
            minLength = _this$props2.minLength,
            multiple = _this$props2.multiple,
            onSearch = _this$props2.onSearch,
            useCache = _this$props2.useCache;


        var query = initialQuery.trim();
        if (!caseSensitive) {
          query = query.toLowerCase();
        }

        _this.setState({ query: query });

        if (!query || minLength && query.length < minLength) {
          return;
        }

        // Use cached results, if available.
        if (useCache && _this._cache[query]) {
          return;
        }

        // In the single-selection case, perform a search only on user input
        // not selection.
        if (!multiple && _this.state.hasSelection) {
          return;
        }

        // Perform the search.
        onSearch(query);
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Container, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        this._cache = {};
        this._handleSearchDebounced = (0, _debounce2.default)(this._handleSearch, this.props.delay);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var options = nextProps.options,
            useCache = nextProps.useCache;


        if (!this.props.isLoading) {
          return;
        }

        if (useCache) {
          this._cache[this.state.query] = options;
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this._cache = {};
        this._handleSearchDebounced.cancel();
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props,
            allowNew = _props.allowNew,
            options = _props.options,
            useCache = _props.useCache,
            props = _objectWithoutProperties(_props, ['allowNew', 'options', 'useCache']);

        var cachedQuery = this._cache[this.state.query];
        var emptyLabel = this._getEmptyLabel();

        // Short-circuit the creation of custom selections while the user is in
        // the process of searching. The logic for whether or not to display the
        // custom menu option is basically the same as whether we display the
        // empty label, so use that as a proxy.
        var shouldAllowNew = allowNew && emptyLabel === props.emptyLabel;

        return _react2.default.createElement(Typeahead, _extends({}, props, {
          allowNew: shouldAllowNew,
          emptyLabel: emptyLabel,
          onChange: this._handleChange,
          onInputChange: this._handleInputChange,
          options: useCache && cachedQuery ? cachedQuery : options,
          ref: function ref(instance) {
            return _this2._instance = instance;
          }
        }));
      }

      /**
       * Make the component instance available.
       */

    }, {
      key: 'getInstance',
      value: function getInstance() {
        return this._instance.getInstance();
      }
    }]);

    return Container;
  }(_react2.default.Component);

  Container.propTypes = {
    /**
     * Delay, in milliseconds, before performing search.
     */
    delay: _propTypes2.default.number,
    /**
     * Whether or not a request is currently pending. Necessary for the
     * container to know when new results are available.
     */
    isLoading: _propTypes2.default.bool.isRequired,
    /**
     * Callback to perform when the search is executed.
     */
    onSearch: _propTypes2.default.func.isRequired,
    /**
     * Options to be passed to the typeahead. Will typically be the query
     * results, but can also be initial default options.
     */
    options: _propTypes2.default.array,
    /**
     * Message displayed in the menu when there is no user input.
     */
    promptText: _propTypes2.default.node,
    /**
     * Message displayed in the menu while the request is pending.
     */
    searchText: _propTypes2.default.node,
    /**
     * Whether or not the component should cache query results.
     */
    useCache: _propTypes2.default.bool
  };

  Container.defaultProps = {
    delay: DEFAULT_DELAY_MS,
    minLength: 2,
    options: [],
    promptText: 'Type to search...',
    searchText: 'Searching...',
    useCache: true
  };

  return Container;
};

exports.default = asyncContainer;