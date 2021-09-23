import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";

/* Copied from growth-onboarding-shared-components/blob/master/growth-onboarding-shared-components/static/js/transitions/Confetti.js */
import { memo, useState, useLayoutEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { CALYPSO, CANDY_APPLE, LORAX } from 'HubStyleTokens/colors';
var CONFETTI_DURATION = 3000;
var CONFETTI_PIECES = 60;

var randomNum = function randomNum(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
};

var rain = keyframes(["from{opacity:0;}25%{opacity:1;}to{bottom:0;}"]);
var confettiStyle = css(["animation:", " ease-out forwards;background:", ";border-radius:2px;bottom:100%;height:16px;opacity:0;position:absolute;width:5px;z-index:3;&:nth-child(odd){background:", ";}&:nth-child(even){z-index:1;}&:nth-child(3n){animation-duration:", "ms;height:25px;width:7px;}&:nth-child(4n){animation-duration:", "ms;border-radius:50%;height:10px;width:10px;}&:nth-child(4n-7){background:", ";}&:nth-child(8n){height:30px;width:4px;}"], rain, LORAX, CALYPSO, function (props) {
  return props.duration * 2;
}, function (props) {
  return props.duration * 1.8;
}, CANDY_APPLE);

var getConfettiPieceStyle = function getConfettiPieceStyle(duration) {
  var randomDuration = randomNum(duration * 0.6, duration * 1.3);
  var randomDelay = randomNum(0, duration * 0.75);
  return {
    animationDelay: randomDelay + "ms",
    animationDuration: randomDuration + "ms",
    left: randomNum(0, 100) + "%",
    transform: "rotate(" + randomNum(-80, 80) + "deg)"
  };
};

var Confetti = /*#__PURE__*/memo(styled(function (_ref) {
  var className = _ref.className;

  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      confettiPieces = _useState2[0],
      setConfettiPieces = _useState2[1];

  useLayoutEffect(function () {
    if (!confettiPieces) {
      return function () {};
    }

    if (confettiPieces.length >= CONFETTI_PIECES) {
      var timeoutId = setTimeout(function () {
        return setConfettiPieces(null);
      }, CONFETTI_DURATION * 2);
      return function () {
        return clearTimeout(timeoutId);
      };
    }

    var newConfettiPieces = _toConsumableArray(confettiPieces);

    for (var index = 0; index < 10; index += 1) {
      newConfettiPieces.push( /*#__PURE__*/_jsx("div", {
        className: className,
        style: getConfettiPieceStyle(CONFETTI_DURATION)
      }, confettiPieces.length + index));
    }

    var requestId = requestAnimationFrame(function () {
      return setConfettiPieces(newConfettiPieces);
    });
    return function () {
      return cancelAnimationFrame(requestId);
    };
  }, [className, confettiPieces, setConfettiPieces]);
  return confettiPieces;
}).withConfig({
  displayName: "Confetti",
  componentId: "sc-1ipyabw-0"
})(["", ""], confettiStyle));
export default Confetti;