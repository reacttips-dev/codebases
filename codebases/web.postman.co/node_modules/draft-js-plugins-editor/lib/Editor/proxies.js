'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// the list of available proxies can be found here: https://github.com/facebook/draft-js/blob/master/src/component/base/DraftEditor.react.js#L120
var proxies = ['focus', 'blur', 'setMode', 'exitCurrentMode', 'restoreEditorDOM', 'setRenderGuard', 'removeRenderGuard', 'setClipboard', 'getClipboard', 'getEditorKey', 'update', 'onDragEnter', 'onDragLeave'];

exports.default = proxies;