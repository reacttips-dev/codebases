'use es6';

import { createContext } from 'react';
import emptyFunction from 'react-utils/emptyFunction';
export var defaultModalContext = {
  use: 'default',
  headerCallback: emptyFunction
};
export var ModalContext = /*#__PURE__*/createContext(defaultModalContext);
var Provider = ModalContext.Provider;
export { Provider as ModalContextProvider };