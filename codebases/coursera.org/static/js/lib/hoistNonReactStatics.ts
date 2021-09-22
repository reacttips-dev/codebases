/* eslint-disable */
/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';

var REACT_STATICS = {
  childContextTypes: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  mixins: true,
  propTypes: true,
  type: true,
};

var KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  arguments: true,
  arity: true,
};

var isGetOwnPropertySymbolsAvailable = typeof Object.getOwnPropertySymbols === 'function';

function hoistNonReactStatics<
  T extends React.ComponentType<any>,
  S extends React.ComponentType<any>,
  C extends {
    [key: string]: true;
  } = {}
>(TargetComponent: T, SourceComponent: S, customStatic?: C): T;
function hoistNonReactStatics(targetComponent: any, sourceComponent: any, customStatics: { [key: string]: any } = {}) {
  // Coursera custom modification to support Apollo client. Apollo traverses the tree and expects
  // to find components with the static `fetchData` attribute as components that should fetch
  // data. This should not be hoisted ever.
  customStatics.fetchData = true;

  if (typeof sourceComponent !== 'string') {
    // don't hoist over string (html) components
    var keys: (string | symbol)[] = Object.getOwnPropertyNames(sourceComponent);

    /* istanbul ignore else */
    if (isGetOwnPropertySymbolsAvailable) {
      const symbols = Object.getOwnPropertySymbols(sourceComponent);
      keys = [...keys, ...symbols];
    }

    for (var i = 0; i < keys.length; ++i) {
      // NOTE: Coursera custom modification to support NaptimeJS in the 'if' block below
      if (keys[i] === 'getWrappedComponentProps' || keys[i] === 'naptimeConnectorComponent') {
        // For NaptimeJS components, we hoist our `naptimeConnectorComponent` function so that we
        // can statically determine data dependencies.
        // If the target component is also a NaptimeJS container, hoisting is handled in Naptime.createContainer.
        if (!targetComponent['naptimeConnectorComponent'] && !targetComponent['getWrappedComponentProps']) {
          targetComponent['naptimeConnectorComponent'] =
            sourceComponent['naptimeConnectorComponent'] || sourceComponent;
        }
      } else if (
        !REACT_STATICS[keys[i] as keyof typeof REACT_STATICS] &&
        !KNOWN_STATICS[keys[i] as keyof typeof KNOWN_STATICS] &&
        (!customStatics || !customStatics[keys[i] as string])
      ) {
        try {
          targetComponent[keys[i]] = sourceComponent[keys[i]];
        } catch (error) {}
      }
    }
  }

  return targetComponent;
}

export default hoistNonReactStatics;
