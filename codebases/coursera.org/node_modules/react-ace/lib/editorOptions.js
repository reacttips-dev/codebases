'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var editorOptions = ['minLines', 'maxLines', 'readOnly', 'highlightActiveLine', 'tabSize', 'enableBasicAutocompletion', 'enableLiveAutocompletion', 'enableSnippets'];

var editorEvents = ['onChange', 'onFocus', 'onInput', 'onBlur', 'onCopy', 'onPaste', 'onSelectionChange', 'onCursorChange', 'onScroll', 'handleOptions', 'updateRef'];
var debounce = function debounce(fn, delay) {
  var timer = null;
  return function () {
    var context = this,
        args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
};
exports.editorOptions = editorOptions;
exports.editorEvents = editorEvents;
exports.debounce = debounce;