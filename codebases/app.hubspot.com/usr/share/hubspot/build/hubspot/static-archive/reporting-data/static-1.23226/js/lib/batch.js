'use es6';

import { List } from 'immutable';
import { Promise } from './promise';
var BATCH_SIZE = 50;

var length = function length(batch) {
  return List.isList(batch) ? batch.size : batch.length;
};

export var reduce = function reduce(data, fn, initial) {
  return new Promise(function (resolve) {
    var results = initial;

    var process = function process(offset) {
      var batch = data.slice(offset, offset + BATCH_SIZE);

      if (length(batch)) {
        results = batch.reduce(fn, results);
        window.requestAnimationFrame(process.bind(null, offset + BATCH_SIZE));
      } else {
        resolve(results);
      }
    };

    process(0);
  });
};