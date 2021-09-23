'use es6';

export default (function (_ref) {
  var containerElement = _ref.containerElement,
      childElement = _ref.childElement;

  if (!containerElement || !childElement) {
    return false;
  }

  var containerScrollTop = containerElement.scrollTop;
  var containerClientHeight = containerElement.clientHeight;
  var childElementOffsetTop = childElement.offsetTop;
  var childElementClientHeight = childElement.clientHeight;
  var topOfViewport = containerScrollTop;
  var bottomOfViewport = containerScrollTop + containerClientHeight;

  var inRange = function inRange(offset) {
    return offset >= topOfViewport && offset <= bottomOfViewport;
  };

  var topOfChildElement = childElementOffsetTop;
  var bottomOfChildElement = childElementOffsetTop + childElementClientHeight;
  var isTopOfChildElementInViewport = inRange(topOfChildElement);
  var isBottomOfChildElementInViewport = inRange(bottomOfChildElement);
  return isTopOfChildElementInViewport || isBottomOfChildElementInViewport;
});