'use es6';

import { EmailLinkDisplayType } from '../DisplayTypes';
import { EmailLinkInputType } from '../InputTypes';
import { makeOperator } from './Operator';
import isString from 'transmute/isString';
export default makeOperator({
  displayType: EmailLinkDisplayType,
  inputType: EmailLinkInputType,
  name: 'EmailLinkClicked',
  isRefinable: true,
  values: [{
    name: 'value',
    isValid: isString
  }]
});