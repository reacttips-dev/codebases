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

var areEqual = require("fbjs/lib/areEqual");

var useMemo = React.useMemo,
    useRef = React.useRef,
    useState = React.useState;

function useMemoVariables(variables) {
  var _variablesChangedGene2;

  // The value of this ref is a counter that should be incremented when
  // variables change. This allows us to use the counter as a
  // memoization value to indicate if the computation for useMemo
  // should be re-executed.
  var variablesChangedGenerationRef = useRef(0); // We mirror the variables to check if they have changed between renders

  var _useState = useState(variables),
      mirroredVariables = _useState[0],
      setMirroredVariables = _useState[1];

  var variablesChanged = !areEqual(variables, mirroredVariables);

  if (variablesChanged) {
    var _variablesChangedGene;

    variablesChangedGenerationRef.current = ((_variablesChangedGene = variablesChangedGenerationRef.current) !== null && _variablesChangedGene !== void 0 ? _variablesChangedGene : 0) + 1;
    setMirroredVariables(variables);
  } // NOTE: We disable react-hooks-deps warning because we explicitly
  // don't want to memoize on object identity
  // eslint-disable-next-line react-hooks/exhaustive-deps


  var memoVariables = useMemo(function () {
    return variables;
  }, [variablesChangedGenerationRef.current]);
  return [memoVariables, (_variablesChangedGene2 = variablesChangedGenerationRef.current) !== null && _variablesChangedGene2 !== void 0 ? _variablesChangedGene2 : 0];
}

module.exports = useMemoVariables;