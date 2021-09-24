'use es6';

import useHovered from '../hooks/useHovered';

var HoverProvider = function HoverProvider(props) {
  return props.children(useHovered(props));
};

HoverProvider.displayName = 'HoverProvider';
export default HoverProvider;