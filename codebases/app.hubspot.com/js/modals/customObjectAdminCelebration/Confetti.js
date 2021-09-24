'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import ConfettiItem from '../../crm_ui/components/confetti/Confetti';
var CONFETTI_AMOUNT = 60;
var CONFETTI_INDEXES = Array.from({
  length: CONFETTI_AMOUNT
}, function (_, index) {
  return index++;
});

var getConfetti = function getConfetti() {
  return CONFETTI_INDEXES.map(function (index) {
    return /*#__PURE__*/_jsx(ConfettiItem, {
      index: index,
      amount: CONFETTI_AMOUNT
    }, index);
  });
};

export var Confetti = function Confetti() {
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      confetti = _useState2[0],
      setConfetti = _useState2[1];

  useEffect(function () {
    var startTimer = setTimeout(function () {
      return setConfetti(getConfetti());
    }, 300);
    var endTimer = setTimeout(function () {
      return setConfetti(null);
    }, 8000);
    return function () {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, []);
  return confetti;
};
export default Confetti;