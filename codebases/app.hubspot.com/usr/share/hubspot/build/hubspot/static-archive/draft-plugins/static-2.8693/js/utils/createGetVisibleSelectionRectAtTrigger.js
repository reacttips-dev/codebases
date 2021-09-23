'use es6';

export default (function (_ref) {
  var trigger = _ref.trigger,
      maximumSearch = _ref.maximumSearch;
  return function (saveCoordinates) {
    var selection = window.getSelection();

    if (!selection.rangeCount) {
      return null;
    }

    var range = selection.getRangeAt(0).cloneRange();
    var anchorNode = selection.anchorNode;
    var fullText = anchorNode.textContent;
    var sliceEnd = range.startOffset > fullText.length - 1 ? range.startOffset : range.startOffset + 1; // Need to ignore other literal chars that match trigger, find the right one.
    // If the token is active, then the trigger must be within `maximumSearch`
    // chars of the cursor position, so we search only those and take the last
    // occurrence of the trigger, which must have activated the token - the
    // other matches of trigger are unrelated to this, so we don't want their position.

    var startIndex = range.startOffset - maximumSearch;
    var sliceStart = startIndex < 0 ? 0 : startIndex;
    var textToSearch = fullText.slice(sliceStart, sliceEnd);
    var offset = sliceStart + textToSearch.lastIndexOf(trigger);

    if (offset < 0) {
      return null;
    }

    range.setStart(anchorNode, offset);

    if (offset + 1 < range.endOffset) {
      range.setEnd(anchorNode, offset + 1);
    }

    var boundingRect = range.getBoundingClientRect();

    if (!boundingRect) {
      return null;
    }

    var top = boundingRect.top;
    var right = boundingRect.right;
    var bottom = boundingRect.bottom;
    var left = boundingRect.left;

    if (top === 0 && right === 0 && bottom === 0 && left === 0) {
      return null;
    }

    saveCoordinates(boundingRect);
    return boundingRect;
  };
});