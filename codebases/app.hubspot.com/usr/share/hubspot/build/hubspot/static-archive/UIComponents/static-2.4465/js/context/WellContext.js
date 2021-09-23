'use es6';

import { createContext } from 'react';
export var defaultWellContext = {
  WellItemComponent: 'div'
};
var WellContext = /*#__PURE__*/createContext(defaultWellContext);
var WellContextConsumer = WellContext.Consumer,
    WellContextProvider = WellContext.Provider;
export { WellContextConsumer, WellContextProvider };