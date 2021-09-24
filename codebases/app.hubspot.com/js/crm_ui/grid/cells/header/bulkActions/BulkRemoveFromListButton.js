'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import BulkActionButton from './BulkActionButton';
import { edit } from '../../../permissions/bulkActionPermissions';
import { getObjectTypeLabel } from '../../../utils/BulkActionPropsRecord';
import BulkActionPropsType from '../../../utils/BulkActionPropsType';
import BulkRemoveFromListPrompt from '../../../../prompts/grid/BulkRemoveFromListPrompt';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import PropTypes from 'prop-types';

var BulkRemoveFromListButton = function BulkRemoveFromListButton(props) {
  var options = props.options,
      bulkActionProps = props.bulkActionProps,
      onFetchData = props.onFetchData,
      _props$Prompt = props.Prompt,
      Prompt = _props$Prompt === void 0 ? BulkRemoveFromListPrompt : _props$Prompt;
  var canBulkEditAll = bulkActionProps.get('canBulkEditAll');
  var objectTypeLabel = getObjectTypeLabel(bulkActionProps);
  var objectType = bulkActionProps.get('objectType');

  var _edit = edit({
    canBulkEditAll: canBulkEditAll,
    objectTypeLabel: objectTypeLabel,
    objectType: objectType
  }),
      disabled = _edit.disabled,
      disabledTooltip = _edit.disabledTooltip;

  var onClick = function onClick() {
    Prompt({
      bulkActionProps: bulkActionProps,
      onFetchData: onFetchData
    });
  };

  return /*#__PURE__*/_jsx(BulkActionButton, {
    "data-selenium-test": "remove-from-list-button",
    disabled: disabled,
    disabledTooltip: disabledTooltip,
    icon: "minus",
    onClick: onClick,
    options: options,
    title: /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: "topbarContents.removeFromList"
    })
  });
};

BulkRemoveFromListButton.propTypes = {
  bulkActionProps: BulkActionPropsType.isRequired,
  onFetchData: PropTypes.func,
  options: PropTypes.object,
  Prompt: PropTypes.func
};
export default BulkRemoveFromListButton;