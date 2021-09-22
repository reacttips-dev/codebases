function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('preact'),
    h = _require.h,
    Component = _require.Component;

module.exports = /*#__PURE__*/function (_Component) {
  _inheritsLoose(Filter, _Component);

  function Filter(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    _this.preventEnterPress = _this.preventEnterPress.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = Filter.prototype;

  _proto.preventEnterPress = function preventEnterPress(ev) {
    if (ev.keyCode === 13) {
      ev.stopPropagation();
      ev.preventDefault();
    }
  };

  _proto.render = function render() {
    var _this2 = this;

    return h("div", {
      class: "uppy-ProviderBrowser-search"
    }, h("input", {
      class: "uppy-u-reset uppy-ProviderBrowser-searchInput",
      type: "text",
      placeholder: this.props.i18n('filter'),
      "aria-label": this.props.i18n('filter'),
      onkeyup: this.preventEnterPress,
      onkeydown: this.preventEnterPress,
      onkeypress: this.preventEnterPress,
      oninput: function oninput(e) {
        return _this2.props.filterQuery(e);
      },
      value: this.props.filterInput
    }), h("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "uppy-c-icon uppy-ProviderBrowser-searchIcon",
      width: "12",
      height: "12",
      viewBox: "0 0 12 12"
    }, h("path", {
      d: "M8.638 7.99l3.172 3.172a.492.492 0 1 1-.697.697L7.91 8.656a4.977 4.977 0 0 1-2.983.983C2.206 9.639 0 7.481 0 4.819 0 2.158 2.206 0 4.927 0c2.721 0 4.927 2.158 4.927 4.82a4.74 4.74 0 0 1-1.216 3.17zm-3.71.685c2.176 0 3.94-1.726 3.94-3.856 0-2.129-1.764-3.855-3.94-3.855C2.75.964.984 2.69.984 4.819c0 2.13 1.765 3.856 3.942 3.856z"
    })), this.props.filterInput && h("button", {
      class: "uppy-u-reset uppy-ProviderBrowser-searchClose",
      type: "button",
      "aria-label": this.props.i18n('resetFilter'),
      title: this.props.i18n('resetFilter'),
      onclick: this.props.filterQuery
    }, h("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "uppy-c-icon",
      viewBox: "0 0 19 19"
    }, h("path", {
      d: "M17.318 17.232L9.94 9.854 9.586 9.5l-.354.354-7.378 7.378h.707l-.62-.62v.706L9.318 9.94l.354-.354-.354-.354L1.94 1.854v.707l.62-.62h-.706l7.378 7.378.354.354.354-.354 7.378-7.378h-.707l.622.62v-.706L9.854 9.232l-.354.354.354.354 7.378 7.378.708-.707-7.38-7.378v.708l7.38-7.38.353-.353-.353-.353-.622-.622-.353-.353-.354.352-7.378 7.38h.708L2.56 1.23 2.208.88l-.353.353-.622.62-.353.355.352.353 7.38 7.38v-.708l-7.38 7.38-.353.353.352.353.622.622.353.353.354-.353 7.38-7.38h-.708l7.38 7.38z"
    }))));
  };

  return Filter;
}(Component);