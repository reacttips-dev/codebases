'use es6';

import useFocused from '../hooks/useFocused';

var FocusProvider = function FocusProvider(props) {
  return props.children(useFocused(props));
};

FocusProvider.displayName = 'FocusProvider';
export default FocusProvider;