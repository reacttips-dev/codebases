/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
// flowlint ambiguous-object-type:error
'use strict';

var RelayRecordSourceMapImpl = require('./RelayRecordSourceMapImpl');

var RelayRecordSource = /*#__PURE__*/function () {
  function RelayRecordSource(records) {
    return RelayRecordSource.create(records);
  }

  RelayRecordSource.create = function create(records) {
    return new RelayRecordSourceMapImpl(records);
  };

  return RelayRecordSource;
}();

module.exports = RelayRecordSource;