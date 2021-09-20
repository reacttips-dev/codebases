'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MentionSuggestionsPortal = function (_Component) {
  _inherits(MentionSuggestionsPortal, _Component);

  function MentionSuggestionsPortal(props) {
    _classCallCheck(this, MentionSuggestionsPortal);

    // Note: this is a workaround for an obscure issue: https://github.com/draft-js-plugins/draft-js-plugins/pull/667/files
    // Ideally we can remove this in the future.
    var _this = _possibleConstructorReturn(this, (MentionSuggestionsPortal.__proto__ || Object.getPrototypeOf(MentionSuggestionsPortal)).call(this, props));

    _this.searchPortalRef = function (element) {
      _this.searchPortal = element;
    };
    return _this;
  }

  // When inputting Japanese characters (or any complex alphabet which requires
  // hitting enter to commit the characters), that action was causing a race
  // condition when we used componentWillMount. By using componentDidMount
  // instead of componentWillMount, the component will unmount unregister and
  // then properly mount and register after. Prior to this change,
  // componentWillMount would not fire after componentWillUnmount even though it
  // was still in the DOM, so it wasn't re-registering the offsetkey.


  _createClass(MentionSuggestionsPortal, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.store.register(this.props.offsetKey);
      this.updatePortalClientRect(this.props);

      // trigger a re-render so the MentionSuggestions becomes active
      this.props.setEditorState(this.props.getEditorState());
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.updatePortalClientRect(nextProps);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.store.unregister(this.props.offsetKey);
    }
  }, {
    key: 'updatePortalClientRect',
    value: function updatePortalClientRect(props) {
      var _this2 = this;

      this.props.store.updatePortalClientRect(props.offsetKey, function () {
        return _this2.searchPortal.getBoundingClientRect();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'span',
        {
          className: this.key,
          ref: this.searchPortalRef
        },
        this.props.children
      );
    }
  }]);

  return MentionSuggestionsPortal;
}(_react.Component);

exports.default = MentionSuggestionsPortal;