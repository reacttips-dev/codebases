'use es6';

import { makeOperator } from './Operator';
export default makeOperator({
  name: 'PrivacyConsentNotCompleted',
  values: [{
    name: 'value',
    isValid: function isValid(value) {
      return value != null;
    }
  }],
  isRefinable: true
});