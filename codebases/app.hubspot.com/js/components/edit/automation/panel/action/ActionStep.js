'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { withFlowEditorContext } from '../FlowEditorContext';
import { getActionTypeFromAction, isEnrollInSequenceAction } from '../../lib/Actions';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UISection from 'UIComponents/section/UISection';
import ActionTypeSelect from './ActionTypeSelect';
import EnrollInSequenceActionConfig from './EnrollInSequenceActionConfig';
export var ActionStep = function ActionStep(_ref) {
  var stagedAction = _ref.stagedAction;
  var actionType = getActionTypeFromAction(stagedAction);
  var showEnrollActionConfig = isEnrollInSequenceAction(stagedAction);
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(UISection, {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequencesAutomation.panel.actionStep.description"
      })
    }), /*#__PURE__*/_jsx(ActionTypeSelect, {
      actionType: actionType
    }), showEnrollActionConfig && /*#__PURE__*/_jsx(EnrollInSequenceActionConfig, {})]
  });
};
ActionStep.propTypes = {
  stagedAction: PropTypes.object.isRequired
};
export default withFlowEditorContext(ActionStep);