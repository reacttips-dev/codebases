'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useHasCreateViewBERedesignGate } from '../hooks/useHasCreateViewBERedesignGate';
import styled from 'styled-components';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner'; // HACK: Look for a better method of positioning the loader/icon

var Container = styled.div.withConfig({
  displayName: "ViewNameEditorLoader__Container",
  componentId: "sc-1n11ha8-0"
})(["margin-top:36px;width:48px;"]);

var ViewNameEditorLoader = function ViewNameEditorLoader(_ref) {
  var loading = _ref.loading,
      hasError = _ref.hasError;
  var hasViewsBERedesignGate = useHasCreateViewBERedesignGate();

  if (!hasViewsBERedesignGate) {
    return null;
  }

  if (loading || !hasError) {
    return /*#__PURE__*/_jsx(Container, {
      children: /*#__PURE__*/_jsx(UILoadingSpinner, {
        showResult: !loading && !hasError
      })
    });
  }

  return /*#__PURE__*/_jsx(Container, {});
};

export default ViewNameEditorLoader;