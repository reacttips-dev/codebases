import utils from '../utils';
import doAlign from './align';

/**
 * `tgtPoint`: { pageX, pageY } or { clientX, clientY }.
 * If client position provided, will internal convert to page position.
 */

function alignPoint(el, tgtPoint, align) {
  let pageX;
  let pageY;

  const doc = utils.getDocument(el);
  const win = doc.defaultView || doc.parentWindow;

  const scrollX = utils.getWindowScrollLeft(win);
  const scrollY = utils.getWindowScrollTop(win);
  const viewportWidth = utils.viewportWidth(win);
  const viewportHeight = utils.viewportHeight(win);

  if ('pageX' in tgtPoint) {
    pageX = tgtPoint.pageX;
  } else {
    pageX = scrollX + tgtPoint.clientX;
  }

  if ('pageY' in tgtPoint) {
    pageY = tgtPoint.pageY;
  } else {
    pageY = scrollY + tgtPoint.clientY;
  }

  const tgtRegion = {
    left: pageX,
    top: pageY,
    width: 0,
    height: 0,
  };

  const pointInView =
    pageX >= 0 &&
    pageX <= scrollX + viewportWidth &&
    (pageY >= 0 && pageY <= scrollY + viewportHeight);

  // Provide default target point
  const points = [align.points[0], 'cc'];

  return doAlign(el, tgtRegion, { ...align, points }, pointInView);
}

export default alignPoint;
