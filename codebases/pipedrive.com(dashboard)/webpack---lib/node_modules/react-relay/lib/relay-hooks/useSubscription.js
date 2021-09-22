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

var React = require('react');

var useRelayEnvironment = require('./useRelayEnvironment');

var _require = require('relay-runtime'),
    requestSubscription = _require.requestSubscription;

function useSubscription(config, requestSubscriptionFn) {
  // N.B. this will re-subscribe every render if config or requestSubscriptionFn
  // are not memoized.
  // Please do not pass an object defined in-line.
  var actualRequestSubscription = requestSubscriptionFn !== null && requestSubscriptionFn !== void 0 ? requestSubscriptionFn : requestSubscription;
  var environment = useRelayEnvironment();
  React.useEffect(function () {
    var _requestSubscription = requestSubscription(environment, config),
        dispose = _requestSubscription.dispose;

    return dispose;
  }, [environment, config, actualRequestSubscription]);
}

module.exports = useSubscription;