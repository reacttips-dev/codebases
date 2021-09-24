'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getIsPrimarySequence } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
var OpacityContainer = styled.div.withConfig({
  displayName: "StepEditorDetailsSection__OpacityContainer",
  componentId: "sc-17ocfzl-0"
})(["opacity:", ";.task-step-editor,.template-editor{opacity:", ";}"], function (props) {
  return props.isDisabled ? 0.5 : 1.0;
}, function (props) {
  return props.isPrimarySequence && !props.isDisabled ? 0.5 : 1.0;
});

function StepEditorDetailsSection(_ref) {
  var children = _ref.children,
      isDisabled = _ref.isDisabled,
      isPrimarySequence = _ref.isPrimarySequence;
  return /*#__PURE__*/_jsx(OpacityContainer, {
    isDisabled: isDisabled,
    isPrimarySequence: isPrimarySequence,
    children: children
  });
}

export default connect(function (state) {
  return {
    isPrimarySequence: getIsPrimarySequence(state)
  };
})(StepEditorDetailsSection);