/**
 * waitForProps
 *
 * Higher order component that blocks rendering the component until all given props evaluate to a truthy value.
 */

import * as React from 'react';
import waitFor from 'js/lib/waitFor';

export default function waitForProps(
  propNames: string[] | Record<string, null | false | undefined>,
  loadingComponent: React.ReactNode = null
) {
  return waitFor((props) => {
    if (propNames instanceof Array) {
      // "waitForProps to not be falsy":
      // waitForProps(['one', 'two'])
      return propNames.every((propName) => !!props[propName]);
    } else if (typeof propNames === 'object') {
      // "waitForProps to not be these initial values":
      // waitForProps({
      //   one: null,
      //   two: false
      // });
      return Object.keys(propNames).every((propName) => props[propName] !== propNames[propName]);
    }

    return undefined;
  }, loadingComponent);
}
