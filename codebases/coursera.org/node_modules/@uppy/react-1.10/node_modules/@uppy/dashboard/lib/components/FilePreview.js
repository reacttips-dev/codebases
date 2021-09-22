var getFileTypeIcon = require('../utils/getFileTypeIcon');

var _require = require('preact'),
    h = _require.h;

module.exports = function FilePreview(props) {
  var file = props.file;

  if (file.preview) {
    return h("img", {
      class: "uppy-Dashboard-Item-previewImg",
      alt: file.name,
      src: file.preview
    });
  }

  var _getFileTypeIcon = getFileTypeIcon(file.type),
      color = _getFileTypeIcon.color,
      icon = _getFileTypeIcon.icon;

  return h("div", {
    class: "uppy-Dashboard-Item-previewIconWrap"
  }, h("span", {
    class: "uppy-Dashboard-Item-previewIcon",
    style: {
      color: color
    }
  }, icon), h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "uppy-Dashboard-Item-previewIconBg",
    width: "58",
    height: "76",
    viewBox: "0 0 58 76"
  }, h("rect", {
    fill: "#FFF",
    width: "58",
    height: "76",
    rx: "3",
    "fill-rule": "evenodd"
  })));
};