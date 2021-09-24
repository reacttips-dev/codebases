'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { FLOATING_ALERT_TIMING } from 'HubStyleTokens/times';
import { Children, cloneElement, useEffect, useState } from 'react';
import useMounted from 'react-utils/hooks/useMounted';
import styled from 'styled-components';
var PopTransitionWrapper = styled.div.withConfig({
  displayName: "AlertListTransition__PopTransitionWrapper",
  componentId: "zsidkk-0"
})(["opacity:", ";transform:scale(", ");transition-property:'opacity, transform';transition-duration:", ";pointer-events:", ";"], function (_ref) {
  var open = _ref.open;
  return open ? '1' : '0';
}, function (_ref2) {
  var open = _ref2.open;
  return open ? '1' : '0.9';
}, FLOATING_ALERT_TIMING, function (_ref3) {
  var open = _ref3.open;
  return !open && 'none';
});

var renderWrappedChild = function renderWrappedChild(child, open) {
  return /*#__PURE__*/_jsx(PopTransitionWrapper, {
    className: "private-floating-alert-list__child",
    open: open,
    children: child
  }, child.key);
};

var PopTransition = function PopTransition(_ref4) {
  var children = _ref4.children;

  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      visibleChildren = _useState2[0],
      setVisibleChildren = _useState2[1];

  var _useState3 = useState({}),
      _useState4 = _slicedToArray(_useState3, 2),
      leavingChildrenKeys = _useState4[0],
      setLeavingChildrenKeys = _useState4[1];

  var mountedRef = useMounted(); // Child add/remove logic

  useEffect(function () {
    var visibleChildrenKeys = visibleChildren.reduce(function (acc, visibleChild) {
      acc[visibleChild.key] = true;
      return acc;
    }, {});
    var removedChildrenKeys = Object.assign({}, visibleChildrenKeys); // Merge our existing set of visible children with any new children

    Children.forEach(children, function (child) {
      var childKey = child && child.key;
      if (!childKey) return;

      if (!visibleChildrenKeys[childKey]) {
        // A new child has been added
        setVisibleChildren(function (prevVisibleChildren) {
          return prevVisibleChildren.concat(renderWrappedChild(child, false));
        }); // Start "enter" animation

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            if (!mountedRef.current) return;
            setVisibleChildren(function (prevVisibleChildren) {
              return prevVisibleChildren.map(function (c) {
                return c.key === childKey ? /*#__PURE__*/cloneElement(c, {
                  open: true
                }) : c;
              });
            });
          });
        });
      }

      delete removedChildrenKeys[childKey];
    }); // Handle removed children

    Object.keys(removedChildrenKeys).forEach(function (removedKey) {
      if (leavingChildrenKeys[removedKey]) return;
      setLeavingChildrenKeys(function (prevLeavingChildrenKeys) {
        return Object.assign({}, prevLeavingChildrenKeys, _defineProperty({}, removedKey, true));
      }); // Start "leave" animation, then remove the item completely afterward.

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (!mountedRef.current) return;
          setVisibleChildren(function (prevVisibleChildren) {
            return prevVisibleChildren.map(function (c) {
              return c.key === removedKey ? /*#__PURE__*/cloneElement(c, {
                open: false
              }) : c;
            });
          });
          setTimeout(function () {
            if (!mountedRef.current) return;
            setVisibleChildren(function (prevVisibleChildren) {
              return prevVisibleChildren.filter(function (c) {
                return c.key !== removedKey;
              });
            });
            setLeavingChildrenKeys(function (prevLeavingChildrenKeys) {
              return Object.assign({}, prevLeavingChildrenKeys, _defineProperty({}, removedKey, false));
            });
          }, parseInt(FLOATING_ALERT_TIMING, 10));
        });
      });
    });
  }, [children]); // eslint-disable-line react-hooks/exhaustive-deps

  return visibleChildren;
};

var AlertListTransition = function AlertListTransition(props) {
  return /*#__PURE__*/_jsx(PopTransition, Object.assign({}, props));
};

AlertListTransition.displayName = 'AlertListTransition';
export default AlertListTransition;