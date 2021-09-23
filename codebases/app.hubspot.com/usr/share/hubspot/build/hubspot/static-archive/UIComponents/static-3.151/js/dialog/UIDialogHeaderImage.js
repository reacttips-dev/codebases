'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useContext, useEffect, useRef } from 'react';
import { ModalContext } from '../context/ModalContext';

var UIDialogHeaderImage = function UIDialogHeaderImage(props) {
  var className = props.className,
      offsetBottom = props.offsetBottom,
      offsetTop = props.offsetTop,
      style = props.style,
      rest = _objectWithoutProperties(props, ["className", "offsetBottom", "offsetTop", "style"]);

  var _useContext = useContext(ModalContext),
      headerCallback = _useContext.headerCallback;

  var elRef = useRef(null);
  useEffect(function () {
    var updateHeaderOffset = function updateHeaderOffset() {
      // Measuring offsetTop in the DOM is more accurate than using the offsetTop prop, because it
      // accounts for the padding above the element.
      var overflow = -1 * elRef.current.offsetTop;

      if (overflow > 0) {
        headerCallback(overflow);
      }
    };

    updateHeaderOffset();
    addEventListener('resize', updateHeaderOffset);
    return function () {
      removeEventListener('resize', updateHeaderOffset);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return /*#__PURE__*/_jsx("div", Object.assign({}, rest, {
    className: classNames('private-modal__header-image', className),
    ref: elRef,
    style: Object.assign({
      marginBottom: offsetBottom,
      marginTop: offsetTop != null && offsetTop * -1
    }, style)
  }));
};

UIDialogHeaderImage.propTypes = {
  children: PropTypes.node,
  offsetBottom: PropTypes.number,
  offsetTop: PropTypes.number
};
UIDialogHeaderImage.displayName = 'UIDialogHeaderImage';
export default UIDialogHeaderImage;