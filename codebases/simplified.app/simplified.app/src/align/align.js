/**
 * align dom node flexibly
 * @author yiminghe@gmail.com
 */

import utils from '../utils';
import getVisibleRectForElement from '../getVisibleRectForElement';
import adjustForViewport from '../adjustForViewport';
import getRegion from '../getRegion';
import getElFuturePos from '../getElFuturePos';

// http://yiminghe.iteye.com/blog/1124720

function isFailX(elFuturePos, elRegion, visibleRect) {
  return (
    elFuturePos.left < visibleRect.left ||
    elFuturePos.left + elRegion.width > visibleRect.right
  );
}

function isFailY(elFuturePos, elRegion, visibleRect) {
  return (
    elFuturePos.top < visibleRect.top ||
    elFuturePos.top + elRegion.height > visibleRect.bottom
  );
}

function isCompleteFailX(elFuturePos, elRegion, visibleRect) {
  return (
    elFuturePos.left > visibleRect.right ||
    elFuturePos.left + elRegion.width < visibleRect.left
  );
}

function isCompleteFailY(elFuturePos, elRegion, visibleRect) {
  return (
    elFuturePos.top > visibleRect.bottom ||
    elFuturePos.top + elRegion.height < visibleRect.top
  );
}

function flip(points, reg, map) {
  const ret = [];
  utils.each(points, p => {
    ret.push(
      p.replace(reg, m => {
        return map[m];
      }),
    );
  });
  return ret;
}

function flipOffset(offset, index) {
  offset[index] = -offset[index];
  return offset;
}

function convertOffset(str, offsetLen) {
  let n;
  if (/%$/.test(str)) {
    n = (parseInt(str.substring(0, str.length - 1), 10) / 100) * offsetLen;
  } else {
    n = parseInt(str, 10);
  }
  return n || 0;
}

function normalizeOffset(offset, el) {
  offset[0] = convertOffset(offset[0], el.width);
  offset[1] = convertOffset(offset[1], el.height);
}

/**
 * @param el
 * @param tgtRegion 参照节点所占的区域: { left, top, width, height }
 * @param align
 */
function doAlign(el, tgtRegion, align, isTgtRegionVisible) {
  let points = align.points;
  let offset = align.offset || [0, 0];
  let targetOffset = align.targetOffset || [0, 0];
  let overflow = align.overflow;
  const source = align.source || el;
  offset = [].concat(offset);
  targetOffset = [].concat(targetOffset);
  overflow = overflow || {};
  const newOverflowCfg = {};
  let fail = 0;
  const alwaysByViewport = !!(overflow && overflow.alwaysByViewport);
  // 当前节点可以被放置的显示区域
  const visibleRect = getVisibleRectForElement(source, alwaysByViewport);
  // 当前节点所占的区域, left/top/width/height
  const elRegion = getRegion(source);
  // 将 offset 转换成数值，支持百分比
  normalizeOffset(offset, elRegion);
  normalizeOffset(targetOffset, tgtRegion);
  // 当前节点将要被放置的位置
  let elFuturePos = getElFuturePos(
    elRegion,
    tgtRegion,
    points,
    offset,
    targetOffset,
  );
  // 当前节点将要所处的区域
  let newElRegion = utils.merge(elRegion, elFuturePos);

  // 如果可视区域不能完全放置当前节点时允许调整
  if (
    visibleRect &&
    (overflow.adjustX || overflow.adjustY) &&
    isTgtRegionVisible
  ) {
    if (overflow.adjustX) {
      // 如果横向不能放下
      if (isFailX(elFuturePos, elRegion, visibleRect)) {
        // 对齐位置反下
        const newPoints = flip(points, /[lr]/gi, {
          l: 'r',
          r: 'l',
        });
        // 偏移量也反下
        const newOffset = flipOffset(offset, 0);
        const newTargetOffset = flipOffset(targetOffset, 0);
        const newElFuturePos = getElFuturePos(
          elRegion,
          tgtRegion,
          newPoints,
          newOffset,
          newTargetOffset,
        );

        if (!isCompleteFailX(newElFuturePos, elRegion, visibleRect)) {
          fail = 1;
          points = newPoints;
          offset = newOffset;
          targetOffset = newTargetOffset;
        }
      }
    }

    if (overflow.adjustY) {
      // 如果纵向不能放下
      if (isFailY(elFuturePos, elRegion, visibleRect)) {
        // 对齐位置反下
        const newPoints = flip(points, /[tb]/gi, {
          t: 'b',
          b: 't',
        });
        // 偏移量也反下
        const newOffset = flipOffset(offset, 1);
        const newTargetOffset = flipOffset(targetOffset, 1);
        const newElFuturePos = getElFuturePos(
          elRegion,
          tgtRegion,
          newPoints,
          newOffset,
          newTargetOffset,
        );

        if (!isCompleteFailY(newElFuturePos, elRegion, visibleRect)) {
          fail = 1;
          points = newPoints;
          offset = newOffset;
          targetOffset = newTargetOffset;
        }
      }
    }

    // 如果失败，重新计算当前节点将要被放置的位置
    if (fail) {
      elFuturePos = getElFuturePos(
        elRegion,
        tgtRegion,
        points,
        offset,
        targetOffset,
      );
      utils.mix(newElRegion, elFuturePos);
    }
    const isStillFailX = isFailX(elFuturePos, elRegion, visibleRect);
    const isStillFailY = isFailY(elFuturePos, elRegion, visibleRect);
    // 检查反下后的位置是否可以放下了，如果仍然放不下：
    // 1. 复原修改过的定位参数
    if (isStillFailX || isStillFailY) {
      let newPoints = points;

      // 重置对应部分的翻转逻辑
      if (isStillFailX) {
        newPoints = flip(points, /[lr]/gi, {
          l: 'r',
          r: 'l',
        });
      }
      if (isStillFailY) {
        newPoints = flip(points, /[tb]/gi, {
          t: 'b',
          b: 't',
        });
      }

      points = newPoints;

      offset = align.offset || [0, 0];
      targetOffset = align.targetOffset || [0, 0];
    }
    // 2. 只有指定了可以调整当前方向才调整
    newOverflowCfg.adjustX = overflow.adjustX && isStillFailX;
    newOverflowCfg.adjustY = overflow.adjustY && isStillFailY;

    // 确实要调整，甚至可能会调整高度宽度
    if (newOverflowCfg.adjustX || newOverflowCfg.adjustY) {
      newElRegion = adjustForViewport(
        elFuturePos,
        elRegion,
        visibleRect,
        newOverflowCfg,
      );
    }
  }

  // need judge to in case set fixed with in css on height auto element
  if (newElRegion.width !== elRegion.width) {
    utils.css(
      source,
      'width',
      utils.width(source) + newElRegion.width - elRegion.width,
    );
  }

  if (newElRegion.height !== elRegion.height) {
    utils.css(
      source,
      'height',
      utils.height(source) + newElRegion.height - elRegion.height,
    );
  }

  // https://github.com/kissyteam/kissy/issues/190
  // 相对于屏幕位置没变，而 left/top 变了
  // 例如 <div 'relative'><el absolute></div>
  utils.offset(
    source,
    {
      left: newElRegion.left,
      top: newElRegion.top,
    },
    {
      useCssRight: align.useCssRight,
      useCssBottom: align.useCssBottom,
      useCssTransform: align.useCssTransform,
      ignoreShake: align.ignoreShake,
    },
  );

  return {
    points,
    offset,
    targetOffset,
    overflow: newOverflowCfg,
  };
}

export default doAlign;
/**
 *  2012-04-26 yiminghe@gmail.com
 *   - 优化智能对齐算法
 *   - 慎用 resizeXX
 *
 *  2011-07-13 yiminghe@gmail.com note:
 *   - 增加智能对齐，以及大小调整选项
 **/
