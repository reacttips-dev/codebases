'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIToggle from 'UIComponents/input/UIToggle';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import EditSequenceTooltip from 'SequencesUI/components/edit/EditSequenceTooltip';
import { canWrite } from 'SequencesUI/lib/permissions';

function wrapWithTooltip(childNode, forDisplayPurposesOnly) {
  if (!canWrite()) {
    return /*#__PURE__*/_jsx(EditSequenceTooltip, {
      children: childNode
    });
  }

  if (forDisplayPurposesOnly) {
    return /*#__PURE__*/_jsx(UITooltip, {
      disabled: false,
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "edit.automation.unenroll.cannotEditTooltip"
      }),
      "data-test-id": "trigger-cannot-be-edited-tooltip",
      children: childNode
    });
  }

  return childNode;
}

var DefaultSequenceAutomationTableRow = function DefaultSequenceAutomationTableRow(props) {
  var _props$forDisplayPurp = props.forDisplayPurposesOnly,
      forDisplayPurposesOnly = _props$forDisplayPurp === void 0 ? false : _props$forDisplayPurp,
      triggerLabel = props.triggerLabel,
      actionLabel = props.actionLabel,
      toggleProps = _objectWithoutProperties(props, ["forDisplayPurposesOnly", "triggerLabel", "actionLabel"]);

  if (forDisplayPurposesOnly) {
    toggleProps.checked = true;
    toggleProps.readOnly = true;
  }

  var toggleNode = /*#__PURE__*/_jsx(UIToggle, Object.assign({
    "aria-label": I18n.text('sequencesAutomation.aria.flowToggle'),
    size: "xs",
    "data-test-id": toggleProps.id
  }, toggleProps));

  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx("td", {
      children: triggerLabel
    }), /*#__PURE__*/_jsx("td", {
      children: actionLabel
    }), /*#__PURE__*/_jsx("td", {
      children: wrapWithTooltip(toggleNode, forDisplayPurposesOnly)
    })]
  });
};

DefaultSequenceAutomationTableRow.propTypes = {
  forDisplayPurposesOnly: PropTypes.bool,
  triggerLabel: PropTypes.node.isRequired,
  actionLabel: PropTypes.node.isRequired,
  readOnly: PropTypes.bool,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  id: PropTypes.string
};
export default DefaultSequenceAutomationTableRow;