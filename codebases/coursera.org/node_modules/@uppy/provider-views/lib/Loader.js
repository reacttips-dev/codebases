var _require = require('preact'),
    h = _require.h;

module.exports = function (props) {
  return h("div", {
    class: "uppy-Provider-loading"
  }, h("span", null, props.i18n('loading')));
};