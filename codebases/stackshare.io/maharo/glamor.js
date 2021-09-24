const log = require('debug')('ssr');
import {rehydrate} from 'glamor';

export default function rehydrateGlamor(name, styleId) {
  if (styleId) {
    const glamorPayload = document.getElementById(styleId);
    if (glamorPayload) {
      log(`Rehydrating "${name}" styles...`);
      rehydrate(JSON.parse(glamorPayload.innerHTML));
    } else {
      log(`Styles payload for "${name}" not found!`);
    }
  }
}
