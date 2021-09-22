var _require = require('preact'),
    h = _require.h; // TODO use Fragment when upgrading to preact X


var Breadcrumb = function Breadcrumb(props) {
  return h("span", null, h("button", {
    type: "button",
    class: "uppy-u-reset",
    onclick: props.getFolder
  }, props.title), !props.isLast ? ' / ' : '');
};

module.exports = function (props) {
  return h("div", {
    class: "uppy-Provider-breadcrumbs"
  }, h("div", {
    class: "uppy-Provider-breadcrumbsIcon"
  }, props.breadcrumbsIcon), props.directories.map(function (directory, i) {
    return h(Breadcrumb, {
      key: directory.id,
      getFolder: function getFolder() {
        return props.getFolder(directory.id);
      },
      title: i === 0 ? props.title : directory.title,
      isLast: i + 1 === props.directories.length
    });
  }));
};