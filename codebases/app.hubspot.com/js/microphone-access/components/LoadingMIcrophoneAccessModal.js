'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import H5 from 'UIComponents/elements/headings/H5';
import FormattedMessage from 'I18n/components/FormattedMessage';
var DELAY_MS = 200;
export default function LoadingMicrophoneAccessModal() {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      pastDelay = _useState2[0],
      setPastDelay = _useState2[1];

  var isMountedRef = useRef(false);
  useEffect(function () {
    isMountedRef.current = true;
    setTimeout(function () {
      if (isMountedRef.current) {
        setPastDelay(true);
      }
    }, DELAY_MS);
    return function () {
      isMountedRef.current = false;
    };
  }, []);
  return pastDelay && /*#__PURE__*/_jsx(UIModal, {
    children: /*#__PURE__*/_jsxs(UIDialogBody, {
      className: "justify-center align-center flex-column",
      children: [/*#__PURE__*/_jsx(UILoadingSpinner, {
        label: /*#__PURE__*/_jsx(H5, {
          className: "m-bottom-0",
          "aria-level": 1,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "microphoneAccess.processing.title"
          })
        }),
        layout: "inline",
        showLabel: true
      }), /*#__PURE__*/_jsx("div", {
        className: "text-center m-bottom-3",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "microphoneAccess.processing.body"
        })
      })]
    })
  });
}