'use es6';

import useActive from '../hooks/useActive';

var ActiveProvider = function ActiveProvider(props) {
  return props.children(useActive(props));
};

ActiveProvider.displayName = 'ActiveProvider';
export default ActiveProvider;