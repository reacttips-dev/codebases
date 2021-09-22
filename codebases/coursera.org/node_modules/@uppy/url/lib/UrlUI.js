function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('preact'),
    h = _require.h,
    Component = _require.Component;

var UrlUI = /*#__PURE__*/function (_Component) {
  _inheritsLoose(UrlUI, _Component);

  function UrlUI(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    _this.handleKeyPress = _this.handleKeyPress.bind(_assertThisInitialized(_this));
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = UrlUI.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.input.value = '';
  };

  _proto.handleKeyPress = function handleKeyPress(ev) {
    if (ev.keyCode === 13) {
      this.props.addFile(this.input.value);
    }
  };

  _proto.handleClick = function handleClick() {
    this.props.addFile(this.input.value);
  };

  _proto.render = function render() {
    var _this2 = this;

    return h("div", {
      class: "uppy-Url"
    }, h("input", {
      class: "uppy-u-reset uppy-c-textInput uppy-Url-input",
      type: "text",
      "aria-label": this.props.i18n('enterUrlToImport'),
      placeholder: this.props.i18n('enterUrlToImport'),
      onkeyup: this.handleKeyPress,
      ref: function ref(input) {
        _this2.input = input;
      },
      "data-uppy-super-focusable": true
    }), h("button", {
      class: "uppy-u-reset uppy-c-btn uppy-c-btn-primary uppy-Url-importButton",
      type: "button",
      onclick: this.handleClick
    }, this.props.i18n('import')));
  };

  return UrlUI;
}(Component);

module.exports = UrlUI;