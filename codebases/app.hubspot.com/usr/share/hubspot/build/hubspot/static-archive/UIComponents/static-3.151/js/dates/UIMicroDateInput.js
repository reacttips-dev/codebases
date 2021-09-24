'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { microInputMixin } from '../input/internal/inputMixins';
import { fontsLoadedPromise } from '../utils/Fonts';
import { getDatePlaceholder } from '../utils/Locale';
import { getTextWidth } from '../utils/MeasureText';
import UIDateInput from './UIDateInput';
var DateInputWrapper = styled(UIDateInput).withConfig({
  displayName: "UIMicroDateInput__DateInputWrapper",
  componentId: "aai41r-0"
})(["display:inline-block;"]);
var MicroInput = styled(UIDateInput.defaultProps.Input).withConfig({
  displayName: "UIMicroDateInput__MicroInput",
  componentId: "aai41r-1"
})(["&&{", ";}"], microInputMixin);

var UIMicroDateInput = function UIMicroDateInput(props) {
  var format = props.format,
      inputRef = props.inputRef,
      rest = _objectWithoutProperties(props, ["format", "inputRef"]);

  var defaultInputRef = useRef(null);
  var computedInputRef = inputRef || defaultInputRef;

  var _useState = useState(137),
      _useState2 = _slicedToArray(_useState, 2),
      measuredWidth = _useState2[0],
      setMeasuredWidth = _useState2[1];

  useEffect(function () {
    var isMounted = true;

    var measureInput = function measureInput() {
      setMeasuredWidth(Math.ceil(getTextWidth(computedInputRef.current, getDatePlaceholder(format))));
    };

    measureInput();
    fontsLoadedPromise.then(function () {
      if (isMounted) measureInput();
    });
    return function () {
      isMounted = false;
    };
  }, [format]); // eslint-disable-line react-hooks/exhaustive-deps

  return /*#__PURE__*/_jsx(DateInputWrapper, Object.assign({}, rest, {
    format: format,
    iconSize: 14,
    inputRef: computedInputRef,
    inputWidth: measuredWidth
  }));
};

UIMicroDateInput.propTypes = UIDateInput.propTypes;
UIMicroDateInput.defaultProps = Object.assign({}, UIDateInput.defaultProps, {
  Input: MicroInput
});
UIMicroDateInput.displayName = 'UIMicroDateInput';
export default UIMicroDateInput;