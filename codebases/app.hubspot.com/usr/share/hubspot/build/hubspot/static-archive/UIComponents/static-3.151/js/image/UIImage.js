'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import memoWithDisplayName from '../utils/memoWithDisplayName';
import validHref from '../utils/propTypes/validHref';
import { throwErrorAsync } from '../utils/ThrowError';
import { isUnsafeUrl } from '../utils/UnsafeUrl';
var SHAPE_CLASSES = {
  default: '',
  circle: 'img-circle private-image--circle',
  rounded: 'img-rounded private-image--rounded',
  thumbnail: 'img-thumbnail private-image--thumbnail'
};
var OBJECT_FIT_CLASSES = {
  fill: '',
  contain: 'private-image--object-fit-contain'
};
var UIImage = memoWithDisplayName('UIImage', /*#__PURE__*/forwardRef(function (props, ref) {
  var bordered = props.bordered,
      className = props.className,
      objectFit = props.objectFit,
      onError = props.onError,
      onLoad = props.onLoad,
      responsive = props.responsive,
      shape = props.shape,
      src = props.src,
      style = props.style,
      rest = _objectWithoutProperties(props, ["bordered", "className", "objectFit", "onError", "onLoad", "responsive", "shape", "src", "style"]);

  if (isUnsafeUrl(src)) {
    throwErrorAsync(new Error("UIImage: Detected XSS attempt! src=\"" + src + "\""));
  }

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      loadFailed = _useState2[0],
      setLoadFailed = _useState2[1];

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      styleOverrides = _useState4[0],
      setStyleOverrides = _useState4[1];
  /** A ref to the <img> element */


  var imgRef = useRef(null);
  var img = imgRef.current;
  var needsPolyfill = !('objectFit' in document.documentElement.style || objectFit !== 'contain');

  var polyfillObjectFit = function polyfillObjectFit() {
    // If style overrides already exist, do nothing
    if (styleOverrides && Object.keys(styleOverrides).length !== 0) return; // Compute the natural image ratio

    var naturalWidth = img.naturalWidth,
        naturalHeight = img.naturalHeight;
    if (!naturalWidth || !naturalHeight) return;
    var imgAspectRatio = naturalWidth / naturalHeight;
    var renderedWidth = img.clientWidth;
    var renderedHeight = img.clientHeight;
    var fittedHeight = renderedWidth / imgAspectRatio;
    var fittedWidth = renderedHeight * imgAspectRatio;

    if (renderedHeight > fittedHeight) {
      setStyleOverrides({
        height: fittedHeight
      });
    } else if (renderedWidth > fittedWidth) {
      setStyleOverrides({
        width: fittedWidth
      });
    }
  };
  /** Re-render without any style overrides, then recompute style overrides */


  var resetOverrides = function resetOverrides() {
    setStyleOverrides({});
  };

  useLayoutEffect(function () {
    if (!needsPolyfill || !img) return undefined;
    polyfillObjectFit();
    addEventListener('resize', resetOverrides);
    return function () {
      removeEventListener('resize', resetOverrides);
    };
  });

  var handleImageError = function handleImageError(evt) {
    if (onError) onError(evt);
    setLoadFailed(true);
  };

  var handleImageLoad = function handleImageLoad(evt) {
    if (onLoad) onLoad(evt);
    imgRef.current = evt.target;
    setLoadFailed(false);
    if (needsPolyfill) resetOverrides();
  };
  /* eslint-disable jsx-a11y/alt-text */


  return /*#__PURE__*/_jsx("img", Object.assign({}, rest, {
    className: classNames('private-image', SHAPE_CLASSES[shape], OBJECT_FIT_CLASSES[objectFit], className, responsive && 'img-responsive private-image--responsive', loadFailed && 'image-load-failed', bordered && 'private-image--bordered'),
    onError: handleImageError,
    onLoad: handleImageLoad,
    ref: ref,
    src: isUnsafeUrl(src) ? null : src,
    style: Object.assign({}, style, {}, styleOverrides)
  }));
  /* eslint-enable jsx-a11y/alt-text */
}));
UIImage.propTypes = {
  alt: PropTypes.string.isRequired,
  bordered: PropTypes.bool.isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onError: PropTypes.func,
  onLoad: PropTypes.func,
  objectFit: PropTypes.oneOf(Object.keys(OBJECT_FIT_CLASSES)).isRequired,
  responsive: PropTypes.bool.isRequired,
  shape: PropTypes.oneOf(Object.keys(SHAPE_CLASSES)).isRequired,
  src: validHref.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
UIImage.defaultProps = {
  alt: '',
  bordered: false,
  objectFit: 'fill',
  responsive: true,
  shape: 'default'
};
export default UIImage;