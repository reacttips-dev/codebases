'use es6';

import { makeOperator } from './Operator';
export default makeOperator({
  name: 'PrivacyConsentCompleted',
  values: [{
    name: 'value',
    isValid: function isValid(value) {
      return value != null;
    }
  }],
  isRefinable: true
});