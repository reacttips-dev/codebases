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

var useRefetchableFragmentNode = require('./useRefetchableFragmentNode');

var useStaticFragmentNodeWarning = require('./useStaticFragmentNodeWarning');

var _require = require('react'),
    useDebugValue = _require.useDebugValue;

var _require2 = require('relay-runtime'),
    getFragment = _require2.getFragment;

function useRefetchableFragment(fragmentInput, fragmentRef) {
  var fragmentNode = getFragment(fragmentInput);
  useStaticFragmentNodeWarning(fragmentNode, 'first argument of useRefetchableFragment()');

  var _useRefetchableFragme = useRefetchableFragmentNode(fragmentNode, fragmentRef, 'useRefetchableFragment()'),
      fragmentData = _useRefetchableFragme.fragmentData,
      refetch = _useRefetchableFragme.refetch;

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDebugValue({
      fragment: fragmentNode.name,
      data: fragmentData
    });
  }
  /* $FlowExpectedError[prop-missing] : Exposed options is a subset of internal
   * options */


  return [fragmentData, refetch];
}

module.exports = useRefetchableFragment;