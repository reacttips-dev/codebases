/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+relay
 * 
 * @format
 */
// flowlint ambiguous-object-type:error
// This contextual profiler can be used to wrap a react sub-tree. It will bind
// the RelayProfiler during the render phase of these components. Allows
// collecting metrics for a specific part of your application.
'use strict';

var React = require('react');

var ProfilerContext = React.createContext({
  wrapPrepareQueryResource: function wrapPrepareQueryResource(cb) {
    return cb();
  }
});
module.exports = ProfilerContext;