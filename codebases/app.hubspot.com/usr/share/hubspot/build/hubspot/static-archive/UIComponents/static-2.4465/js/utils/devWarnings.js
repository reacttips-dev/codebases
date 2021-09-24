'use es6';

import { isFragment } from 'react-is';
import devLogger from 'react-utils/devLogger';
export var warnIfFragment = function warnIfFragment(node, componentName) {
  var propName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'children';

  if (process.env.NODE_ENV !== 'production' && isFragment(node)) {
    devLogger.warn({
      message: componentName + ": " + propName + " cannot be a React.Fragment. Please refactor to use a DOM node.",
      key: componentName + ": fragment not supported"
    });
  }
};