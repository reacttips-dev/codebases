'use es6';

import { createContext } from 'react';
export var defaultPopoverContext = {
  use: 'default'
};
export var PopoverContext = /*#__PURE__*/createContext(defaultPopoverContext);
var Consumer = PopoverContext.Consumer,
    Provider = PopoverContext.Provider;
export { Consumer, Provider };