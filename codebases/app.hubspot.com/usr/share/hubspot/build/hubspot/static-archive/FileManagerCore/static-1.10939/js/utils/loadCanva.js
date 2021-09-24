'use es6';

import loadScript from './loadScript';
var CANVA_SCRIPT_URL = 'https://sdk.canva.com/v2/beta/api.js';
export default function loadCanva() {
  try {
    return loadScript(CANVA_SCRIPT_URL);
  } catch (e) {
    return Promise.reject('Error loading Canva via loadScript');
  }
}