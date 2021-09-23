'use es6';

import styled, { css, keyframes } from 'styled-components';
import { LORAX, CALYPSO, CANDY_APPLE } from 'HubStyleTokens/colors';
var DURATION = 3000;

var randomNum = function randomNum(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
};

var makeItRain = keyframes(["from{opacity:0;}25%{opacity:1;}to{top:100%;}"]);
export default styled.div.withConfig({
  displayName: "Confetti",
  componentId: "sc-1us4fq4-0"
})(["", ""], function (_ref) {
  var index = _ref.index,
      amount = _ref.amount;
  return css(["position:absolute;width:5px;height:16px;background:", ";top:0;opacity:0;z-index:3;border-radius:2px;left:", "%;transform:rotate(", "deg);animation:", " ", "ms forwards ease-out;animation-duration:", "ms;animation-delay:", "ms;&:nth-child(odd){background:", ";}&:nth-child(even){z-index:1;}&:nth-child(3n){width:7px;height:25px;animation-duration:", "ms;}&:nth-child(4n){width:10px;height:10px;border-radius:50%;animation-duration:", "ms;}&:nth-child(4n-7){background:", ";}&:nth-child(8n){width:4px;height:30px;}"], LORAX, index * (100 / amount), randomNum(-80, 80), makeItRain, DURATION, randomNum(DURATION * 0.6, DURATION * 1.3), randomNum(0, DURATION * 0.75), CALYPSO, DURATION * 2, DURATION * 1.8, CANDY_APPLE);
});