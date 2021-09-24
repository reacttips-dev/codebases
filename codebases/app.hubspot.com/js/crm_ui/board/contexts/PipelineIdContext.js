'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import emptyFunction from 'react-utils/emptyFunction';
import { useContext, createContext, useMemo } from 'react'; // These values are used to create no-ops in situations where the context is not
// provided (i.e. contacts and companies pages). Changing them can impact pages
// that do not have pipelines so be cautious when doing so.

var PipelineIdContext = /*#__PURE__*/createContext({
  pipelineId: null,
  setPipelineId: emptyFunction
});
export var PipelineIdProvider = function PipelineIdProvider(_ref) {
  var children = _ref.children,
      pipelineId = _ref.pipelineId,
      setPipelineId = _ref.setPipelineId;
  var contextValue = useMemo(function () {
    return {
      pipelineId: pipelineId,
      setPipelineId: setPipelineId
    };
  }, [pipelineId, setPipelineId]);
  return /*#__PURE__*/_jsx(PipelineIdContext.Provider, {
    value: contextValue,
    children: children
  });
};
export var usePipelineId = function usePipelineId() {
  return useContext(PipelineIdContext);
};