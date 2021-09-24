'use es6'; // TODO Can be deleted after Sequences:EmbeddedAutomation is fully ungated

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIFlex from 'UIComponents/layout/UIFlex';
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

var FakeWorkflowTriggerCell = function FakeWorkflowTriggerCell(props) {
  var _props$forDisplayPurp = props.forDisplayPurposesOnly,
      forDisplayPurposesOnly = _props$forDisplayPurp === void 0 ? false : _props$forDisplayPurp,
      labelNode = props.labelNode,
      id = props.id,
      checkboxProps = _objectWithoutProperties(props, ["forDisplayPurposesOnly", "labelNode", "id"]);

  if (forDisplayPurposesOnly) {
    checkboxProps.checked = true;
    checkboxProps.readOnly = true;
  }

  var checkboxNode = /*#__PURE__*/_jsx(UICheckbox, Object.assign({
    "aria-label": I18n.text('edit.automation.unenroll.checkboxAriaLabel'),
    className: "m-right-2",
    alignment: "center",
    "data-test-id": id
  }, checkboxProps));

  return /*#__PURE__*/_jsx("td", {
    children: /*#__PURE__*/_jsxs(UIFlex, {
      align: "center",
      children: [wrapWithTooltip(checkboxNode, forDisplayPurposesOnly), wrapWithTooltip(labelNode, forDisplayPurposesOnly)]
    })
  });
};

FakeWorkflowTriggerCell.propTypes = {
  forDisplayPurposesOnly: PropTypes.bool,
  labelNode: PropTypes.node.isRequired,
  readOnly: PropTypes.bool,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  id: PropTypes.string
};
export default FakeWorkflowTriggerCell;