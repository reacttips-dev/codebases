'use es6';

import { CtaDisplayType } from '../DisplayTypes';
import { CtaInputType } from '../InputTypes';
import { __ANY_CTA } from 'customer-data-filters/converters/listSegClassic/ListSegConstants';
import { makeOperator } from './Operator';
import isString from 'transmute/isString';
export default makeOperator({
  displayType: CtaDisplayType,
  inputType: CtaInputType,
  name: 'CtaHasNotClicked',
  values: [{
    name: 'value',
    isValid: isString,
    defaultValue: __ANY_CTA
  }],
  isRefinable: true,
  isRefinableExtra: true
});