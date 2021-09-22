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
'use strict';

var React = require('react');

var ReactRelayContext = require('react-relay/ReactRelayContext');

var useMemo = React.useMemo;

function RelayEnvironmentProvider(props) {
  var children = props.children,
      environment = props.environment;
  var context = useMemo(function () {
    return {
      environment: environment
    };
  }, [environment]);
  return /*#__PURE__*/React.createElement(ReactRelayContext.Provider, {
    value: context
  }, children);
}

module.exports = RelayEnvironmentProvider;