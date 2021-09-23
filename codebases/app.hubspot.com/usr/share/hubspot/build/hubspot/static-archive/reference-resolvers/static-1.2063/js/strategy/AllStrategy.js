'use es6';

import ReferenceRecord from '../schema/ReferenceRecord';
import { bridgeAtom, enforceRemoveFunction } from './Strategy';
import { createEnforceResolverValue } from '../lib/enforce';
var enforceResolverValue = createEnforceResolverValue('Immutable.Iterable of ReferenceRecords', ReferenceRecord.isReferenceIterable);
export function makeAllResolver(getSubscription) {
  var all = null;
  return function () {
    if (!all) {
      all = bridgeAtom(function (next) {
        var remove = enforceRemoveFunction(getSubscription(function (records) {
          return next(enforceResolverValue(records));
        }));
        return function () {
          remove();
          all = null;
        };
      });
    }

    return all;
  };
}