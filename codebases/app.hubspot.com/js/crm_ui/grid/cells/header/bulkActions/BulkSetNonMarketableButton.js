'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import BulkActionButton from './BulkActionButton';
import BulkActionPropsType from '../../../utils/BulkActionPropsType';
import BulkSetNonMarketingContactsPrompt from 'marketing-contacts-ui/BulkSetNonMarketingContactsPrompt';
import { edit } from '../../../permissions/bulkActionPermissions';
import { CrmLogger } from 'customer-data-tracking/loggers';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import PropTypes from 'prop-types';
import ScopesContainer from '../../../../../containers/ScopesContainer';
import { isScoped } from '../../../../../containers/ScopeOperators';
import FormattedMessage from 'I18n/components/FormattedMessage';

var BulkSetNonMarketableButton = function BulkSetNonMarketableButton(_ref) {
  var bulkActionProps = _ref.bulkActionProps,
      options = _ref.options,
      _ref$Prompt = _ref.Prompt,
      Prompt = _ref$Prompt === void 0 ? BulkSetNonMarketingContactsPrompt : _ref$Prompt;
  var objectType = bulkActionProps.objectType,
      selectionCount = bulkActionProps.selectionCount,
      isFilterApplied = bulkActionProps.isFilterApplied,
      allSelected = bulkActionProps.allSelected,
      isSelectionGreaterThanView = bulkActionProps.isSelectionGreaterThanView,
      checked = bulkActionProps.checked,
      query = bulkActionProps.query,
      canBulkEditAll = bulkActionProps.canBulkEditAll,
      objectTypeLabel = bulkActionProps.objectTypeLabel;

  var _edit = edit({
    canBulkEditAll: canBulkEditAll,
    objectTypeLabel: objectTypeLabel,
    objectType: objectType
  }),
      disabled = _edit.disabled,
      disabledTooltip = _edit.disabledTooltip;

  if (!isScoped(ScopesContainer.get(), 'marketable-contacts-write')) {
    disabled = true;
    disabledTooltip = /*#__PURE__*/_jsx(FormattedMessage, {
      message: "bulkActions.noPermissionNonMarketingContacts"
    });
  }

  var onClick = function onClick() {
    CrmLogger.log('indexUsage', {
      action: 'use set non-marketing contacts',
      type: objectType
    });
    var jsQuery = ImmutableMap.isMap(query) ? query.toJS() : query;
    Prompt({
      selectionCount: selectionCount,
      isFilterApplied: isFilterApplied,
      allSelected: allSelected,
      query: isSelectionGreaterThanView ? jsQuery : checked.toArray(),
      source: 'CRM_UI'
    });
  };

  return /*#__PURE__*/_jsx(BulkActionButton, {
    disabled: disabled,
    disabledTooltip: disabledTooltip,
    onClick: onClick,
    options: options,
    icon: "edit",
    "data-selenium-test": "bulk-set-non-marketable",
    title: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "topbarContents.setNonMarketable"
    })
  });
};

BulkSetNonMarketableButton.propTypes = {
  bulkActionProps: BulkActionPropsType,
  options: PropTypes.object,
  Prompt: PropTypes.func
};
export default BulkSetNonMarketableButton;