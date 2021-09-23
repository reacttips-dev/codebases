'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import BulkActionButton from './BulkActionButton';
import { edit } from '../../../permissions/bulkActionPermissions';
import BulkActionPropsType from '../../../utils/BulkActionPropsType';
import BulkEditPrompt from '../../../../prompts/grid/BulkEditPrompt';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { isObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import PropTypes from 'prop-types';
import get from 'transmute/get';

var BulkEditButton = function BulkEditButton(_ref) {
  var bulkActionProps = _ref.bulkActionProps,
      _ref$options = _ref.options,
      options = _ref$options === void 0 ? {} : _ref$options,
      _ref$Prompt = _ref.Prompt,
      Prompt = _ref$Prompt === void 0 ? BulkEditPrompt : _ref$Prompt,
      onSuccess = _ref.onSuccess;
  var allSelected = bulkActionProps.allSelected,
      canBulkEditAll = bulkActionProps.canBulkEditAll,
      objectTypeLabel = bulkActionProps.objectTypeLabel,
      objectType = bulkActionProps.objectType;

  var _edit = edit({
    canBulkEditAll: canBulkEditAll,
    objectTypeLabel: objectTypeLabel,
    objectType: objectType
  }),
      disabled = _edit.disabled,
      disabledTooltip = _edit.disabledTooltip;

  var onClick = function onClick() {
    CrmLogger.log('indexInteractions', {
      action: 'open bulk edit modal',
      type: objectType
    });
    Prompt({
      bulkActionProps: bulkActionProps,
      onSuccess: onSuccess,
      isIKEA: get('isIKEA', options) || false
    });
  };

  if (!disabled && isObjectTypeId(objectType) && allSelected) {
    disabled = true;
    disabledTooltip = /*#__PURE__*/_jsx(FormattedMessage, {
      message: "bulkActions.disabledForCrmObjects.edit"
    });
  }

  return /*#__PURE__*/_jsx(BulkActionButton, {
    disabled: disabled,
    disabledTooltip: disabledTooltip,
    icon: "edit",
    onClick: onClick,
    options: options,
    "data-selenium-test": "bulk-action-edit",
    title: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "topbarContents.editSelection"
    })
  });
};

BulkEditButton.propTypes = {
  bulkActionProps: BulkActionPropsType,
  options: PropTypes.object,
  Prompt: PropTypes.func,
  onSuccess: PropTypes.func
};
export default BulkEditButton;