'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import TaskPanelContentContainer from 'SequencesUI/components/edit/taskForm/TaskPanelContentContainer';
import H2 from 'UIComponents/elements/headings/H2';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIPanel from 'UIComponents/panel/UIPanel';
import UIPanelHeader from 'UIComponents/panel/UIPanelHeader';

var AddTaskPanel = function AddTaskPanel(props) {
  var closeModal = props.closeModal,
      handleAddTemplateClick = props.handleAddTemplateClick,
      insertCard = props.insertCard,
      width = props.width,
      panelKey = props.panelKey,
      templatesById = props.templatesById,
      updateTaskWithNewTemplate = props.updateTaskWithNewTemplate,
      rest = _objectWithoutProperties(props, ["closeModal", "handleAddTemplateClick", "insertCard", "width", "panelKey", "templatesById", "updateTaskWithNewTemplate"]);

  return /*#__PURE__*/_jsxs(UIPanel, Object.assign({
    width: width,
    panelKey: panelKey
  }, rest, {
    "data-selenium-test": "TASK_FORM",
    children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
      onClick: closeModal
    }), /*#__PURE__*/_jsx(UIPanelHeader, {
      children: /*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "edit.insertCardPanel.title.TASK_FORM"
        })
      })
    }), /*#__PURE__*/_jsx(TaskPanelContentContainer, {
      templatesById: templatesById,
      insertCard: insertCard,
      closeModal: closeModal,
      handleAddTemplateClick: handleAddTemplateClick,
      edit: false,
      updateTaskWithNewTemplate: updateTaskWithNewTemplate
    })]
  }));
};

AddTaskPanel.propTypes = {
  panelKey: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleAddTemplateClick: PropTypes.func.isRequired,
  templatesById: PropTypes.instanceOf(ImmutableMap).isRequired,
  insertCard: PropTypes.func.isRequired,
  updateTaskWithNewTemplate: PropTypes.func.isRequired
};
export default AddTaskPanel;