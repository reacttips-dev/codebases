import doAlign from './align';
import getOffsetParent from '../getOffsetParent';
import getVisibleRectForElement from '../getVisibleRectForElement';
import getRegion from '../getRegion';

function isOutOfVisibleRect(target, alwaysByViewport) {
  const visibleRect = getVisibleRectForElement(target, alwaysByViewport);
  const targetRegion = getRegion(target);

  return (
    !visibleRect ||
    targetRegion.left + targetRegion.width <= visibleRect.left ||
    targetRegion.top + targetRegion.height <= visibleRect.top ||
    targetRegion.left >= visibleRect.right ||
    targetRegion.top >= visibleRect.bottom
  );
}

function alignElement(el, refNode, align) {
  const target = align.target || refNode;
  const refNodeRegion = getRegion(target);

  const isTargetNotOutOfVisible = !isOutOfVisibleRect(
    target,
    align.overflow && align.overflow.alwaysByViewport,
  );

  return doAlign(el, refNodeRegion, align, isTargetNotOutOfVisible);
}

alignElement.__getOffsetParent = getOffsetParent;

alignElement.__getVisibleRectForElement = getVisibleRectForElement;

export default alignElement;
