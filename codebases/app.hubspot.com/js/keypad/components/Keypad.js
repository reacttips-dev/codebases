'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import get from 'transmute/get';
import uniqueId from 'transmute/uniqueId';
import UIGrid from 'UIComponents/grid/UIGrid';
import UIGridItem from 'UIComponents/grid/UIGridItem';
import UITextInput from 'UIComponents/input/UITextInput';
import partial from 'transmute/partial';
import styled from 'styled-components';
import { OLAF, CIRRUS, OZ, BATTLESHIP } from 'HubStyleTokens/colors';
import CallClientContext from 'calling-client-interface/context/CallClientContext';
import FullscreenModal from 'calling-communicator-ui/fullscreen-modal/components/FullscreenModal';
import { getCallSidFromState } from '../../record/selectors/getRecordState';
import { getSelectedCallMethodFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { getSelectedCallProviderFromState } from '../../calling-providers/selectors/getCallingProviders';
var numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
var letters = ['', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ', '', '', ''];
var StyledUIGrid = styled(UIGrid).withConfig({
  displayName: "Keypad__StyledUIGrid",
  componentId: "eunwy5-0"
})([".keypad-button{border-radius:50%;height:40px;width:40px;cursor:pointer;margin:0 auto;margin-bottom:8px;}.keypad-button .button-letters{height:20px;font-size:12px;}.button-number{line-height:11px;font-size:22px;height:20px;font-weight:600;}.bottom-row-keys{line-height:34px;height:34px;}.bottom-row{margin-top:-8px !important;}.keypad-button:hover{background-color:", ";}.keypad-button:active{background-color:", ";color:", ";}"], CIRRUS, OZ, OLAF);
var StyledTextInput = styled(UITextInput).withConfig({
  displayName: "Keypad__StyledTextInput",
  componentId: "eunwy5-1"
})(["font-size:18px !important;margin:0;border-color:", " !important;"], BATTLESHIP);
var FullscreenBody = styled.div.withConfig({
  displayName: "Keypad__FullscreenBody",
  componentId: "eunwy5-2"
})(["width:200px;margin:0 auto;"]);

var getWrapperClassForKey = function getWrapperClassForKey(keyNumber) {
  return 'keypad-button text-center justify-center flex-column pointer' + ("0 * #".includes(keyNumber) ? " bottom-row" : "");
};

var getClassForKey = function getClassForKey(keyNumber) {
  return "m-top-1 button-number" + ("0 * #".includes(keyNumber) ? " bottom-row-keys" : "");
};

var Keypad = function Keypad(_ref) {
  var onReject = _ref.onReject;

  var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      keypadTypedNums = _useState2[0],
      setKeypadTypedNums = _useState2[1];

  var callSid = useSelector(getCallSidFromState);
  var selectedCallProvider = useSelector(getSelectedCallProviderFromState);
  var provider = get('name', selectedCallProvider);
  var method = useSelector(getSelectedCallMethodFromState);
  var context = useContext(CallClientContext);
  var handleNumberPress = useCallback(function (number) {
    if (number >= '0' && number <= '9') {
      setKeypadTypedNums(keypadTypedNums + number);
    }

    context.sendDigits(number, {
      method: method,
      provider: provider,
      callSid: callSid,
      number: number
    });
  }, [callSid, context, keypadTypedNums, method, provider]);

  var renderKeys = function renderKeys(keys) {
    return keys.map(function (index) {
      var keyNumber = numbers[index];
      var keyLetter = letters[index];
      return /*#__PURE__*/_jsxs("div", {
        className: getWrapperClassForKey(keyNumber),
        onClick: partial(handleNumberPress, keyNumber),
        "data-selenium-test": "keypad-" + keyNumber,
        children: [/*#__PURE__*/_jsx("div", {
          className: getClassForKey(keyNumber),
          children: keyNumber
        }), /*#__PURE__*/_jsx("div", {
          className: "button-letters",
          children: keyLetter
        })]
      }, uniqueId(keyLetter));
    });
  };

  var renderColumn = function renderColumn(column) {
    return /*#__PURE__*/_jsx(UIGridItem, {
      size: 4,
      className: "p-x-0",
      children: renderKeys(column)
    });
  };

  return /*#__PURE__*/_jsx(FullscreenModal, {
    hideConfirmButton: true,
    onReject: onReject,
    cancelUse: "transparent",
    minHeight: '120px',
    cancelButtonSize: "default",
    children: /*#__PURE__*/_jsxs(FullscreenBody, {
      children: [/*#__PURE__*/_jsx("bdo", {
        children: /*#__PURE__*/_jsx(StyledTextInput, {
          readOnly: true,
          value: keypadTypedNums
        })
      }), /*#__PURE__*/_jsxs(StyledUIGrid, {
        className: "p-all-0 m-top-3",
        children: [renderColumn([0, 3, 6, 9]), renderColumn([1, 4, 7, 10]), renderColumn([2, 5, 8, 11])]
      })]
    })
  });
};

Keypad.displayName = 'Keypad';
Keypad.propTypes = {
  onReject: PropTypes.func.isRequired
};
export default Keypad;