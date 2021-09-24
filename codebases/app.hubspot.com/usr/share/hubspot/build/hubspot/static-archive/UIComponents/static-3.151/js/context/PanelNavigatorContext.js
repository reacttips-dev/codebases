'use es6';

import { createContext } from 'react';
export var defaultPanelNavigatorContext = {};
export var PanelNavigatorContext = /*#__PURE__*/createContext(defaultPanelNavigatorContext);
var Consumer = PanelNavigatorContext.Consumer,
    Provider = PanelNavigatorContext.Provider;
export { Consumer, Provider };