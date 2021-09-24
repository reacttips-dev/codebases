'use es6';

import BasePatternFactory from '../lib/BasePatternFactory';
import EmailAddressRegex from '../regex/EmailAddressRegex';
export default BasePatternFactory({
  name: 'EmailAddress',
  validator: function validator(input) {
    return EmailAddressRegex.test(input);
  }
});