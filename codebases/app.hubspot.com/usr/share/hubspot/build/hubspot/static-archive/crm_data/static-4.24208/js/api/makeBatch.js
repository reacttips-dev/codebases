'use es6';

import { Map as ImmutableMap } from 'immutable';
import Raven from 'Raven';
import enviro from 'enviro';
import allSettled from 'hs-promise-utils/allSettled';
var showDevOutput = !enviro.deployed();

var makeBatch = function makeBatch(fetchById, apiName) {
  return function (ids) {
    var numIds = ids.size || ids.length;

    if (numIds > 2) {
      var error = new Error("makeBatch(" + apiName + ") called with more than 2 IDs. This can cause performance issues waiting for the requests to resolve. Look into a batch endpoint.");

      if (showDevOutput) {
        // eslint-disable-next-line no-console
        console.error(error, ids.toJSON());
      } else {
        Raven.captureException(error, {
          extra: {
            ids: ids.toJSON()
          }
        });
      }
    }

    var requests = ids.valueSeq().toArray().map(fetchById);
    return allSettled(requests).then(function (result) {
      return result.reduce(function (acc, imp, index) {
        var id = ids.get(index);
        var value;

        if (imp.status === 'fulfilled') {
          value = imp.value;
        }

        return acc.set(id, value);
      }, ImmutableMap());
    });
  };
};

export default makeBatch;