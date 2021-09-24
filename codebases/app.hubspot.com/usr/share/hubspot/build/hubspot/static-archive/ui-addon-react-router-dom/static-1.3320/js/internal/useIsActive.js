'use es6';

import { useRouteMatch } from 'react-router-dom';

var useIsActive = function useIsActive(to, exact) {
  var path = typeof to === 'object' ? to.pathname : to; // borrowed from https://github.com/ReactTraining/react-router/blob/2d3c68b337347abd1291ea53f9ab8cb44a8a1da8/packages/react-router-dom/modules/NavLink.js#L24

  var escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
  var match = useRouteMatch({
    path: escapedPath,
    exact: exact
  });
  return match !== null;
};

export default useIsActive;