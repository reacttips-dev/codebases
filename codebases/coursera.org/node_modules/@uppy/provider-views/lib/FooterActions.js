var _require = require('preact'),
    h = _require.h;

module.exports = function (props) {
  return h("div", {
    class: "uppy-ProviderBrowser-footer"
  }, h("button", {
    class: "uppy-u-reset uppy-c-btn uppy-c-btn-primary",
    onclick: props.done
  }, props.i18n('selectX', {
    smart_count: props.selected
  })), h("button", {
    class: "uppy-u-reset uppy-c-btn uppy-c-btn-link",
    onclick: props.cancel
  }, props.i18n('cancel')));
};