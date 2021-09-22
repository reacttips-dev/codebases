var _require = require('preact'),
    h = _require.h;

var prettyBytes = require('@uppy/utils/lib/prettyBytes');

var truncateString = require('../../../utils/truncateString');

var renderAcquirerIcon = function renderAcquirerIcon(acquirer, props) {
  return h("span", {
    title: props.i18n('fileSource', {
      name: acquirer.name
    })
  }, acquirer.icon());
};

var renderFileSource = function renderFileSource(props) {
  return props.file.source && props.file.source !== props.id && h("div", {
    class: "uppy-DashboardItem-sourceIcon"
  }, props.acquirers.map(function (acquirer) {
    if (acquirer.id === props.file.source) {
      return renderAcquirerIcon(acquirer, props);
    }
  }));
};

var renderFileName = function renderFileName(props) {
  // Take up at most 2 lines on any screen
  var maxNameLength; // For very small mobile screens

  if (props.containerWidth <= 352) {
    maxNameLength = 35; // For regular mobile screens
  } else if (props.containerWidth <= 576) {
    maxNameLength = 60; // For desktops
  } else {
    maxNameLength = 30;
  }

  return h("div", {
    class: "uppy-DashboardItem-name",
    title: props.file.meta.name
  }, truncateString(props.file.meta.name, maxNameLength));
};

var renderFileSize = function renderFileSize(props) {
  return props.file.data.size && h("div", {
    class: "uppy-DashboardItem-statusSize"
  }, prettyBytes(props.file.data.size));
};

module.exports = function FileInfo(props) {
  return h("div", {
    class: "uppy-DashboardItem-fileInfo",
    "data-uppy-file-source": props.file.source
  }, renderFileName(props), h("div", {
    class: "uppy-DashboardItem-status"
  }, renderFileSize(props), renderFileSource(props)));
};