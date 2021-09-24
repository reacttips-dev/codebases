'use es6';

import { ROOT_FONT_SIZE } from 'HubStyleTokens/sizes';
export function remCalc(size) {
  return parseInt(size, 10) + "px";
}
export function emCalc(size) {
  return parseInt(size, 10) / parseInt(ROOT_FONT_SIZE, 10) + "em";
}