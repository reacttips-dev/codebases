'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _draftJs = require('draft-js');

exports.default = function (text) {
  return _draftJs.EditorState.createWithContent(_draftJs.ContentState.createFromText(text));
}; /**
    * Create an editor state with some text in it already
    */