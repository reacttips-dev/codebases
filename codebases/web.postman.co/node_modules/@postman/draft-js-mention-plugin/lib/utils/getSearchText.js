'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getWordAt = require('./getWordAt');

var _getWordAt2 = _interopRequireDefault(_getWordAt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getSearchText = function getSearchText(editorState, selection) {
  var anchorKey = selection.getAnchorKey();
  var anchorOffset = selection.getAnchorOffset() - 1;
  var currentContent = editorState.getCurrentContent();
  var currentBlock = currentContent.getBlockForKey(anchorKey);
  var blockText = currentBlock.getText();
  return (0, _getWordAt2.default)(blockText, anchorOffset);
};

exports.default = getSearchText;