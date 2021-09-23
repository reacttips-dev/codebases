'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { sequenceIdSelector } from 'SequencesUI/selectors/sequenceDataSelectors';
import partial from 'transmute/partial';
import { getActionTypeFromAction } from '../../lib/Actions';
import { getActions } from '../../lib/ActionDefinitions';
import { getActionTypes } from '../../lib/ActionDisplayLib';
import { withFlowEditorContext } from '../FlowEditorContext';
import { canEditSequencesContextualWorkflows } from 'SequencesUI/lib/permissions';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H7 from 'UIComponents/elements/headings/H7';
import UISection from 'UIComponents/section/UISection';
import SelectableBoxWithIcon from '../SelectableBoxWithIcon';
export var ActionTypeSelect = function ActionTypeSelect(_ref) {
  var stagedAction = _ref.stagedAction,
      setStagedAction = _ref.setStagedAction;
  var actionType = getActionTypeFromAction(stagedAction);
  var sequenceId = useSelector(sequenceIdSelector);
  var handleSelectActionType = useCallback(function (_actionType) {
    setStagedAction(getActions(sequenceId)[_actionType]);
  }, [setStagedAction, sequenceId]);
  var readOnly = !canEditSequencesContextualWorkflows();
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(H7, {
      "aria-level": 3,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequencesAutomation.action.section.sequence"
      })
    }), /*#__PURE__*/_jsx(UISection, {
      children: getActionTypes().map(function (option) {
        return /*#__PURE__*/_jsx(SelectableBoxWithIcon, Object.assign({
          onClick: partial(handleSelectActionType, option.value),
          selected: option.value === actionType,
          readOnly: readOnly
        }, option), option.value);
      })
    })]
  });
};
ActionTypeSelect.propTypes = {
  stagedAction: PropTypes.object.isRequired,
  setStagedAction: PropTypes.func.isRequired
};
export default withFlowEditorContext(ActionTypeSelect);