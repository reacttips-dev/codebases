'use es6';

export default (function (src) {
  var moreAttrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var script = document.createElement('script');
  var attrs = Object.assign({
    async: true
  }, moreAttrs, {
    src: src
  });
  Object.keys(attrs).forEach(function (key) {
    script.setAttribute(key, attrs[key]);
  });
  document.body.appendChild(script);
});