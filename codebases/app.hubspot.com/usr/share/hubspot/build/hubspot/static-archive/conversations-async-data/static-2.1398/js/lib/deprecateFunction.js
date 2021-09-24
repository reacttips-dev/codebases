'use es6';

import uniqueId from 'transmute/uniqueId';
import { warn } from 'react-utils/devLogger';
export default function deprecateFunction() {
  var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var fn = arguments.length > 1 ? arguments[1] : undefined;
  var key = uniqueId('deprecated-function-');
  return function () {
    warn({
      message: "Deprecation Warning: " + message,
      key: key
    });
    return fn.apply(void 0, arguments);
  };
}