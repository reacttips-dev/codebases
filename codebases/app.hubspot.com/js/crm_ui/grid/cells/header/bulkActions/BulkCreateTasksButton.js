'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import BulkActionButton from './BulkActionButton';
import BulkActionPropsType from '../../../utils/BulkActionPropsType';
import { CrmLogger } from 'customer-data-tracking/loggers';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import PropTypes from 'prop-types';

var BulkCreateTasksButton = function BulkCreateTasksButton(props) {
  var bulkActionProps = props.bulkActionProps,
      options = props.options;
  var objectType = bulkActionProps.objectType,
      isSelectionGreaterThanView = bulkActionProps.isSelectionGreaterThanView;

  var onClick = function onClick() {
    var openBulkCreateModal = props.openBulkCreateModal;
    CrmLogger.log('indexInteractions', {
      action: 'open bulk create tasks modal',
      type: objectType
    });
    openBulkCreateModal();
  };

  return /*#__PURE__*/_jsx(BulkActionButton, {
    disabled: isSelectionGreaterThanView,
    "data-selenium-test": "bulk-action-create-tasks",
    disabledTooltip: /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: "topbarContents.createTaskDisabledNumberSelected"
    }),
    icon: "add",
    onClick: onClick,
    options: options,
    title: /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: "topbarContents.createTasks"
    }),
    "data-onboarding": "bulk-create-tasks"
  });
};

BulkCreateTasksButton.propTypes = {
  bulkActionProps: BulkActionPropsType.isRequired,
  openBulkCreateModal: PropTypes.func.isRequired,
  options: PropTypes.object
};
export default BulkCreateTasksButton;