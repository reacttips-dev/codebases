'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { tracker } from 'SequencesUI/util/UsageTracker';
import { canWrite } from 'SequencesUI/lib/permissions';
import UIFlex from 'UIComponents/layout/UIFlex';
import UILink from 'UIComponents/link/UILink';

var AddEmailTemplateCardSection = function AddEmailTemplateCardSection(_ref) {
  var index = _ref.index,
      payload = _ref.payload,
      openEditTaskPanel = _ref.openEditTaskPanel;

  if (!canWrite()) {
    return null;
  }

  function openAddTemplateModal() {
    tracker.track('createOrEditSequence', {
      action: 'Insert email into task'
    });
    openEditTaskPanel({
      index: index,
      payload: payload,
      showTaskForm: false
    });
  }

  return /*#__PURE__*/_jsxs(UIFlex, {
    className: "editor-list-card-template-info editor-list-card-section",
    align: "center",
    children: [/*#__PURE__*/_jsx("strong", {
      className: "m-right-1",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "edit.templateNode.templateLine.template"
      })
    }), /*#__PURE__*/_jsx(UILink, {
      onClick: openAddTemplateModal,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "edit.taskPanel.emailTemplate.add"
      })
    })]
  });
};

AddEmailTemplateCardSection.propTypes = {
  index: PropTypes.number.isRequired,
  payload: PropTypes.instanceOf(ImmutableMap).isRequired,
  openEditTaskPanel: PropTypes.func.isRequired
};
export default AddEmailTemplateCardSection;