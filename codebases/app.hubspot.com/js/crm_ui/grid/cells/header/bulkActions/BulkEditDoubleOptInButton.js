'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import BulkActionButton from './BulkActionButton';
import { edit } from '../../../permissions/bulkActionPermissions';
import { getObjectTypeLabel } from '../../../utils/BulkActionPropsRecord';
import BulkActionPropsType from '../../../utils/BulkActionPropsType';
import BulkEditDoubleOptInPrompt from '../../../../prompts/grid/BulkEditDoubleOptInPrompt';
import { CrmLogger } from 'customer-data-tracking/loggers';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import PropTypes from 'prop-types';

var BulkEditDoubleOptInButton = function BulkEditDoubleOptInButton(_ref) {
  var bulkActionProps = _ref.bulkActionProps,
      _ref$Prompt = _ref.Prompt,
      Prompt = _ref$Prompt === void 0 ? BulkEditDoubleOptInPrompt : _ref$Prompt,
      options = _ref.options;
  var canBulkEditAll = bulkActionProps.get('canBulkEditAll');
  var objectTypeLabel = getObjectTypeLabel(bulkActionProps);
  var objectType = bulkActionProps.get('objectType');

  var onClick = function onClick() {
    CrmLogger.log('use-bulk-double-opt-in');
    Prompt({
      bulkActionProps: bulkActionProps
    });
  };

  var _edit = edit({
    canBulkEditAll: canBulkEditAll,
    objectTypeLabel: objectTypeLabel,
    objectType: objectType
  }),
      disabled = _edit.disabled,
      disabledTooltip = _edit.disabledTooltip;

  return /*#__PURE__*/_jsx(BulkActionButton, {
    "data-selenium-test": "bulk-edit-double-opt-in",
    disabled: disabled,
    disabledTooltip: disabledTooltip,
    icon: "bulletList",
    onClick: onClick,
    options: options,
    title: /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: "topbarContents.doubleOptIn.buttonTitle"
    })
  });
};

BulkEditDoubleOptInButton.propTypes = {
  bulkActionProps: BulkActionPropsType.isRequired,
  options: PropTypes.object,
  Prompt: PropTypes.func
};
export default BulkEditDoubleOptInButton;