'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import BulkActionButton from './BulkActionButton';
import BulkActionPropsType from '../../../utils/BulkActionPropsType';
import BulkEnrollInWorkflowPrompt from '../../../../prompts/grid/BulkEnrollInWorkflowPrompt';
import { CrmLogger } from 'customer-data-tracking/loggers';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import PropTypes from 'prop-types';

var BulkEnrollInWorkflowButton = function BulkEnrollInWorkflowButton(_ref) {
  var bulkActionProps = _ref.bulkActionProps,
      _ref$Prompt = _ref.Prompt,
      Prompt = _ref$Prompt === void 0 ? BulkEnrollInWorkflowPrompt : _ref$Prompt,
      options = _ref.options;
  var allSelected = bulkActionProps.allSelected,
      listId = bulkActionProps.listId;
  var disabled = allSelected && !listId;

  var onClick = function onClick() {
    CrmLogger.log('indexInteractions', {
      action: 'open bulk enroll in workflow modal'
    });
    Prompt({
      bulkActionProps: bulkActionProps
    });
  };

  return /*#__PURE__*/_jsx(BulkActionButton, {
    disabled: disabled,
    disabledTooltip: /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: "topbarContents.enrollInWorkflowDisabled"
    }),
    icon: "workflows",
    onClick: onClick,
    options: options,
    title: /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: "topbarContents.enrollInWorkflow"
    })
  });
};

BulkEnrollInWorkflowButton.propTypes = {
  bulkActionProps: BulkActionPropsType.isRequired,
  options: PropTypes.object,
  Prompt: PropTypes.func
};
export default BulkEnrollInWorkflowButton;