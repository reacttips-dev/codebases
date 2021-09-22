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

var useFragmentNode = require('./useFragmentNode');

var useStaticFragmentNodeWarning = require('./useStaticFragmentNodeWarning');

var _require = require('./loadQuery'),
    useTrackLoadQueryInRender = _require.useTrackLoadQueryInRender;

var _require2 = require('react'),
    useDebugValue = _require2.useDebugValue;

var _require3 = require('relay-runtime'),
    getFragment = _require3.getFragment;

function useFragment(fragmentInput, fragmentRef) {
  // We need to use this hook in order to be able to track if
  // loadQuery was called during render
  useTrackLoadQueryInRender();
  var fragmentNode = getFragment(fragmentInput);
  useStaticFragmentNodeWarning(fragmentNode, 'first argument of useFragment()');

  var _useFragmentNode = useFragmentNode(fragmentNode, fragmentRef, 'useFragment()'),
      data = _useFragmentNode.data;

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDebugValue({
      fragment: fragmentNode.name,
      data: data
    });
  }

  return data;
}

module.exports = useFragment;