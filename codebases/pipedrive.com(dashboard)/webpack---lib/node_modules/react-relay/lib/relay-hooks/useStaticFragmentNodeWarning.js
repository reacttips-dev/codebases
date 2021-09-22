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

var warning = require("fbjs/lib/warning");

var _require = require('react'),
    useRef = _require.useRef;

function useStaticFragmentNodeWarning(fragmentNode, warningContext) {
  if (process.env.NODE_ENV !== "production") {
    // This is calling `useRef` conditionally, but based on the environment
    // __DEV__ setting which shouldn't change. This allows us to only pay the
    // cost of `useRef` in development mode to produce the warning.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var initialPropRef = useRef(fragmentNode.name);
    process.env.NODE_ENV !== "production" ? warning(initialPropRef.current === fragmentNode.name, 'Relay: The %s has to remain the same over the lifetime of a component. ' + 'Changing it is not supported and will result in unexpected behavior.', warningContext) : void 0;
  }
}

module.exports = useStaticFragmentNodeWarning;