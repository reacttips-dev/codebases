'use strict';

var callbacks = [];

function report(promise, metadata) {
  callbacks.forEach(function(callback) {
    callback(metadata);
  });

  return promise;
}

function inspect(callback) {
  var index = callbacks.push(callback) - 1;

  return function stopInspecting() {
    callbacks.splice(index, 1);
  };
}

exports.report = report;
exports.inspect = inspect;
