'use es6';

import { createContext } from 'react';
export var defaultFieldsetContext = {
  disabled: false,
  size: 'default'
};
export var FieldsetContext = /*#__PURE__*/createContext(defaultFieldsetContext);
var Consumer = FieldsetContext.Consumer,
    Provider = FieldsetContext.Provider;
export { Consumer as FieldsetContextConsumer, Provider as FieldsetContextProvider };
export { Consumer }; // Used downstream in FileManagerUI