'use es6';

import { memo } from 'react';
/**
 * Workaround for a React bug where attaching `displayName` to a `memo`'d component doesn't result
 * in that `displayName` being recognized by React (e.g. in Dev Tools).
 *
 * @param {string} displayName The `displayName` to attach to the given `Component`
 * @param {Function} Component A function component to memoize
 */

export default function memoWithDisplayName(displayName, Component) {
  Component.displayName = displayName;
  return /*#__PURE__*/memo(Component);
}