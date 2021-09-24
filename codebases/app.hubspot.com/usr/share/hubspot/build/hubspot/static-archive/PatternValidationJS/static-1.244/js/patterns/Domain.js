'use es6';

import BasePatternFactory from '../lib/BasePatternFactory';
import DomainRegex from '../regex/DomainRegex';
export default BasePatternFactory({
  name: 'Domain',
  validator: function validator(input) {
    return DomainRegex.test(input);
  }
});