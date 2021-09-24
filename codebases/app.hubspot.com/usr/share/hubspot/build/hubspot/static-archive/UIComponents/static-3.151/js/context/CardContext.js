'use es6';

import { createContext } from 'react';
export var defaultCardContext = {
  compact: false
};
export var compactCardContext = {
  compact: true
};
export var CardContext = /*#__PURE__*/createContext(defaultCardContext);
var Provider = CardContext.Provider;
export { Provider as CardContextProvider };