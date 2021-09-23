'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import BulkActionButton from './BulkActionButton';
import { assign } from '../../../permissions/bulkActionPermissions';
import BulkActionPropsType from '../../../utils/BulkActionPropsType';
import BulkAssignToPrompt from '../../../../prompts/grid/BulkAssignToPrompt';
import { CrmLogger } from 'customer-data-tracking/loggers';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import PropTypes from 'prop-types';
import { useStoreDependency } from 'general-store';
import { getPropertyPermissionDependency, isEditable } from '../../../../property/fieldLevelPermissionsUIDependencies';
import get from 'transmute/get';

var BulkAssignButton = function BulkAssignButton(props) {
  var options = props.options,
      bulkActionProps = props.bulkActionProps,
      _props$Prompt = props.Prompt,
      Prompt = _props$Prompt === void 0 ? BulkAssignToPrompt : _props$Prompt,
      onSuccess = props.onSuccess;
  var canBulkEditAll = bulkActionProps.canBulkEditAll,
      objectType = bulkActionProps.objectType,
      objectTypeLabel = bulkActionProps.objectTypeLabel;
  var getPropertyPermission = useStoreDependency(getPropertyPermissionDependency, {
    objectType: objectType
  });
  var canEditOwnerProperty = isEditable(getPropertyPermission('hubspot_owner_id'));

  var _assign = assign({
    canBulkEditAll: canBulkEditAll,
    canEditOwnerProperty: canEditOwnerProperty,
    objectTypeLabel: objectTypeLabel,
    objectType: objectType
  }),
      disabled = _assign.disabled,
      disabledTooltip = _assign.disabledTooltip;

  var onClick = function onClick() {
    CrmLogger.log('indexInteractions', {
      action: 'open bulk assign modal',
      type: objectType
    });
    Prompt({
      bulkActionProps: bulkActionProps,
      onSuccess: onSuccess,
      isIKEA: get('isIKEA', options)
    });
  };

  return /*#__PURE__*/_jsx(BulkActionButton, {
    disabled: disabled || !canEditOwnerProperty,
    disabledTooltip: disabledTooltip,
    icon: "next",
    onClick: onClick,
    options: options,
    "data-selenium-test": "bulk-action-assign",
    title: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "topbarContents.assignProperty"
    })
  });
};

BulkAssignButton.propTypes = {
  bulkActionProps: BulkActionPropsType.isRequired,
  options: PropTypes.object,
  Prompt: PropTypes.func,
  onSuccess: PropTypes.func
};
export default BulkAssignButton;