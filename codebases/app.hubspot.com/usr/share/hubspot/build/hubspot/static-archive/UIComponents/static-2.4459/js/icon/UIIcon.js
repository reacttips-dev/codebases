'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import iconAliases from 'icons/iconAliases';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import devLogger from 'react-utils/devLogger';
import memoize from 'react-utils/memoize';
import styled from 'styled-components';
import memoWithDisplayName from '../utils/memoWithDisplayName';
import { getIconNamePropType } from '../utils/propTypes/iconName';
import { ICON_SIZES } from './IconConstants';

var sizeToRes = function sizeToRes(size) {
  return size <= ICON_SIZES.small ? 'low' : 'high';
};

var getIconClassName = function getIconClassName(size, measuredRes) {
  var res = size != null ? sizeToRes(ICON_SIZES[size] || size) : measuredRes;
  return "private-icon__" + res;
};

var getComputedFontSize = function getComputedFontSize(size) {
  if (!size) return null;

  if (ICON_SIZES[size]) {
    return ICON_SIZES[size];
  }

  return size;
};

var IconContent = styled.span.withConfig({
  displayName: "UIIcon__IconContent",
  componentId: "sc-10ghbhs-0"
})(["font:inherit !important;&::before{content:\"", "\";}"], function (_ref) {
  var ligature = _ref.ligature;
  return ligature;
});
var getIconContent = memoize(function (ligature) {
  return /*#__PURE__*/_jsx(IconContent, {
    "aria-hidden": true,
    ligature: ligature
  });
});
var hasPingedNewRelic = false;
var UIIcon = memoWithDisplayName('UIIcon', function (props) {
  var className = props.className,
      color = props.color,
      name = props.name,
      screenReaderText = props.screenReaderText,
      style = props.style,
      size = props.size,
      rest = _objectWithoutProperties(props, ["className", "color", "name", "screenReaderText", "style", "size"]);

  var _useState = useState('low'),
      _useState2 = _slicedToArray(_useState, 2),
      measuredRes = _useState2[0],
      setMeasuredRes = _useState2[1];

  var measureRef = useRef(null);
  useEffect(function () {
    if (size) return; // Measure the `fontSize` in the DOM to determine whether this is high- or low-res.

    var styles = getComputedStyle(measureRef.current, null); // Patch for Firefox < 62: https://bugzilla.mozilla.org/show_bug.cgi?id=1467722

    if (!styles) return;
    var newMeasuredRes = sizeToRes(parseInt(styles.fontSize, 10));
    if (newMeasuredRes !== measuredRes) setMeasuredRes(newMeasuredRes);
  });

  if (iconAliases[name]) {
    if (window.newrelic && !hasPingedNewRelic) {
      hasPingedNewRelic = true;
      window.newrelic.addPageAction('icon-alias', {
        alias: name
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      devLogger.warn({
        message: "UIIcon: \"" + name + "\" is a deprecated alias. Please use the canonical icon name.",
        key: "UIIcon-" + name,
        url: 'https://tools.hubteamqa.com/ui-library/styles/icons'
      });
    }
  }

  var computedName = iconAliases[name] || name;
  var computedClassName = classNames('private-icon', getIconClassName(size, measuredRes), className);
  return /*#__PURE__*/_jsxs("span", Object.assign({}, rest, {
    className: computedClassName,
    "data-icon-name": computedName,
    ref: measureRef,
    style: Object.assign({
      color: color
    }, style, {
      fontSize: getComputedFontSize(size)
    }),
    children: [getIconContent(computedName), screenReaderText &&
    /*#__PURE__*/
    // Spaces around screenReaderText prevents collisions withsiblingtext.
    _jsxs("span", {
      className: "sr-only",
      children: [" ", screenReaderText, " "]
    })]
  }));
});
UIIcon.propTypes = {
  color: PropTypes.string,
  name: getIconNamePropType().isRequired,
  screenReaderText: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.oneOf(Object.keys(ICON_SIZES)), PropTypes.number])
};
export default UIIcon;