'use es6';

import ReferenceRecord from '../schema/ReferenceRecord';
import { makeKeyedResolver } from './Strategy';
import isString from 'transmute/isString';
import isNumber from 'transmute/isNumber';
import invariant from 'react-utils/invariant';
import { createEnforceResolverValue } from '../lib/enforce';
export var makeIdResolver = makeKeyedResolver({
  idTransform: function idTransform(id) {
    invariant(isString(id) || isNumber(id), 'expected reference id to be a string but found `%s`', id);
    return String(id);
  },
  valueTransform: createEnforceResolverValue('ReferenceRecord', ReferenceRecord.isReferenceRecord)
});