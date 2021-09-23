'use es6';

import { createContext } from 'react';
import PropTypes from 'prop-types';
export var types = {
  inPanel: PropTypes.bool.isRequired
};
export var defaultPanelContext = {
  inPanel: false
};
export var PanelContext = /*#__PURE__*/createContext(defaultPanelContext);
var Consumer = PanelContext.Consumer,
    Provider = PanelContext.Provider;
export { Consumer, Provider };
export var propType = PropTypes.shape(types);