import getAlignOffset from './getAlignOffset';

function getElFuturePos(elRegion, refNodeRegion, points, offset, targetOffset) {
  const p1 = getAlignOffset(refNodeRegion, points[1]);
  const p2 = getAlignOffset(elRegion, points[0]);
  const diff = [p2.left - p1.left, p2.top - p1.top];

  return {
    left: Math.round(elRegion.left - diff[0] + offset[0] - targetOffset[0]),
    top: Math.round(elRegion.top - diff[1] + offset[1] - targetOffset[1]),
  };
}

export default getElFuturePos;
