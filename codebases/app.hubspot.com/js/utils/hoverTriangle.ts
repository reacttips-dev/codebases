import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import navQuerySelectorAll from 'unified-navigation-ui/utils/navQuerySelectorAll';
import isNavAncestor from 'unified-navigation-ui/utils/isNavAncestor';
import each from 'unified-navigation-ui/utils/each';
import { navEvent } from 'unified-navigation-ui/deferred/analytics/navEvent';
import { addDesktopEventListener } from 'unified-navigation-ui/utils/eventListeners';

function pointLiesWithinTriangle(_ref, _ref2) {
  var _ref3 = _slicedToArray(_ref, 2),
      x = _ref3[0],
      y = _ref3[1];

  var _ref4 = _slicedToArray(_ref2, 3),
      _ref4$ = _slicedToArray(_ref4[0], 2),
      aX = _ref4$[0],
      aY = _ref4$[1],
      _ref4$2 = _slicedToArray(_ref4[1], 2),
      bX = _ref4$2[0],
      bY = _ref4$2[1],
      _ref4$3 = _slicedToArray(_ref4[2], 2),
      cX = _ref4$3[0],
      cY = _ref4$3[1];

  var detT = (bY - cY) * (aX - cX) + (cX - bX) * (aY - cY);
  var barycentric1 = ((bY - cY) * (x - cX) + (cX - bX) * (y - cY)) / detT;
  var barycentric2 = ((cY - aY) * (x - cX) + (aX - cX) * (y - cY)) / detT;
  var barycentric3 = 1 - barycentric1 - barycentric2;
  return barycentric1 >= 0 && barycentric2 >= 0 && barycentric3 >= 0;
}

function mouseCloser(previousMouseX, currentMouseX, childEdgeX) {
  if (!previousMouseX) {
    return true;
  }

  return Math.abs(previousMouseX - childEdgeX) >= Math.abs(currentMouseX - childEdgeX);
}

export default function attachHoverTriangleListener(parentElement) {
  if (!parentElement) {
    return;
  }

  var child = parentElement.querySelector('.expansion');

  var _Array$prototype$slic = Array.prototype.slice.call(parentElement.children).filter(function (c) {
    return c.tagName.toLowerCase() === 'a';
  }),
      _Array$prototype$slic2 = _slicedToArray(_Array$prototype$slic, 1),
      link = _Array$prototype$slic2[0];

  var hovering = false;
  var previousMouseX;
  var previousMouseY;
  var movingVertexX;
  var movingVertexY;

  var mouseMoveListener = function mouseMoveListener(_ref5) {
    var mouseX = _ref5.clientX,
        mouseY = _ref5.clientY;

    var _parentElement$getBou = parentElement.getBoundingClientRect(),
        parentX = _parentElement$getBou.left;

    var _getBoundingClientRec = child.getBoundingClientRect(),
        childX = _getBoundingClientRec.left,
        childY = _getBoundingClientRec.top,
        childWidth = _getBoundingClientRec.width,
        childHeight = _getBoundingClientRec.height;

    var childEdgeX = childX < parentX ? childX + childWidth : childX;
    var childTopY = childY;
    var childBottomY = childY + childHeight;
    var isMouseCloser = mouseCloser(previousMouseX, mouseX, childEdgeX);

    if (isMouseCloser) {
      movingVertexY = previousMouseY;
      movingVertexX = previousMouseX + (childX < parentX ? 1 : -1);
    }

    var mouseInsideTriangle = pointLiesWithinTriangle([mouseX, mouseY], [[movingVertexX, movingVertexY], [childEdgeX, childTopY], [childEdgeX, childBottomY]]);

    if (!hovering && !mouseInsideTriangle) {
      setTimeout(function () {
        parentElement.classList.remove('active');
        parentElement.querySelector('a').setAttribute('aria-expanded', 'false');
        document.removeEventListener('mousemove', mouseMoveListener);
      }, 0);
    }

    previousMouseX = mouseX;
    previousMouseY = mouseY;
  };

  addDesktopEventListener(parentElement, 'mousemove', function () {
    var allActiveElements = Array.prototype.slice.call(navQuerySelectorAll('.active'));

    if (allActiveElements.every(function (activeElement) {
      return isNavAncestor(parentElement, activeElement);
    })) {
      if (!parentElement.classList.contains('navAccounts')) {
        navEvent(link, 'navHoverEvent');
      }

      parentElement.classList.add('active');
      parentElement.querySelector('a').setAttribute('aria-expanded', 'true');
      link.focus();
    }

    hovering = true;
  });
  link.addEventListener('click', function (evt) {
    var isCurrentlyActive = parentElement.classList.contains('active');
    var allActiveElements = navQuerySelectorAll('.active');
    each(allActiveElements, function (activeElement) {
      if (!isNavAncestor(parentElement, activeElement)) {
        activeElement.classList.remove('active');
        activeElement.querySelector('a').setAttribute('aria-expanded', 'false');
        var blurEvent = document.createEvent('HTMLEvents');
        blurEvent.initEvent('blur', false, true);
        activeElement.dispatchEvent(blurEvent);
      }
    });

    if (!isCurrentlyActive) {
      if (parentElement) {
        parentElement.classList.add('active');
        parentElement.querySelector('a').setAttribute('aria-expanded', 'true');
      }
    } else {
      if (parentElement) {
        parentElement.classList.remove('active');
        parentElement.querySelector('a').setAttribute('aria-expanded', 'false');
      }
    }

    evt.preventDefault();
    evt.stopPropagation();
  });
  addDesktopEventListener(parentElement, 'mouseleave', function (_ref6) {
    var mouseX = _ref6.clientX,
        mouseY = _ref6.clientY;
    hovering = false;
    previousMouseX = mouseX;
    previousMouseY = mouseY;

    if (parentElement.classList.contains('active')) {
      addDesktopEventListener(document, 'mousemove', mouseMoveListener);
    }
  });
  addDesktopEventListener(child, 'mouseenter', function () {
    hovering = true;
  });
  addDesktopEventListener(child, 'mouseleave', function () {
    hovering = false;
  });
}