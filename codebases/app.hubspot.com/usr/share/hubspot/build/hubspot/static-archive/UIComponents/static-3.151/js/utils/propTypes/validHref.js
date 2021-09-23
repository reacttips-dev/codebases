'use es6';

import createChainablePropType from './createChainablePropType';
import { isUnsafeUrl } from '../UnsafeUrl';

function validHrefValidator(props, propName, componentName) {
  if (props[propName]) {
    var value = props[propName];

    if (typeof value !== 'string' || value === '#') {
      return new Error(componentName + ": Invalid href \"" + value + "\". If provided, the href " + 'prop must be a valid URL.');
    }

    if (isUnsafeUrl(value)) {
      return new Error(componentName + ": href \"" + value + "\" could be an XSS attack and will be ignored. " + 'See https://git.hubteam.com/HubSpot/UIComponents/issues/2599');
    }
  }

  return null;
}

var validHref = createChainablePropType(validHrefValidator, 'validHref');
export default validHref;