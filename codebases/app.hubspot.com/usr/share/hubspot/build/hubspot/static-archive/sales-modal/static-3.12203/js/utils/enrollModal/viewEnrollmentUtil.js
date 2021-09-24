'use es6';

import { EnrollTypes } from 'sales-modal/constants/EnrollTypes';
export function enrollSequencePropTypeChecker(props, propName, componentName) {
  if (props.enrollType === EnrollTypes.VIEW) {
    return;
  } else {
    var propValue = props[propName];

    if (typeof propValue !== 'function') {
      // eslint-disable-next-line consistent-return
      return new Error("The prop `" + propName + "` is marked as required in" + (" `" + componentName + "`, but its value is `" + propValue + "`."));
    }
  }
}