'use es6';

import { createContext } from 'react';
var SocialContext = /*#__PURE__*/createContext({
  trackInteraction: function trackInteraction() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    console.warn('Called trackInteraction with no context provider:', args);
  },
  onClickMessageText: function onClickMessageText() {// this is optional, effect should just be that links opening the network in a new tab, no intercepting with native panels
  }
});
export default SocialContext;