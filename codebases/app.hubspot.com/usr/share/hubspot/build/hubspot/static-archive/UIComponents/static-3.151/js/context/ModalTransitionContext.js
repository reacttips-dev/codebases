'use es6';

import { createContext } from 'react';
export var defaultModalTransitionContext = {
  transitioning: false
};
export var ModalTransitionContext = /*#__PURE__*/createContext(defaultModalTransitionContext);
var ModalTransitionContextConsumer = ModalTransitionContext.Consumer,
    ModalTransitionContextProvider = ModalTransitionContext.Provider;
export { ModalTransitionContextConsumer, ModalTransitionContextProvider };