'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { hasSomeEditScopes } from 'crm_data/permissions/canEdit';
import ScopesContainer from '../../../containers/ScopesContainer';
import { isScoped } from '../../../containers/ScopeOperators';

var _makeTooltip = function _makeTooltip(key, objectTypeLabel) {
  return /*#__PURE__*/_jsx("span", {
    children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "customerDataObjectsUiComponents.Permissions." + key,
      options: {
        objectTypeLabel: objectTypeLabel
      }
    })
  });
};

export var edit = function edit(_ref) {
  var canBulkEditAll = _ref.canBulkEditAll,
      objectTypeLabel = _ref.objectTypeLabel,
      objectType = _ref.objectType;
  var scopes = ScopesContainer.get();
  var disabled = false;
  var disabledTooltip;

  if (!hasSomeEditScopes(scopes, objectType)) {
    disabled = true;
    disabledTooltip = _makeTooltip('editDisabled', objectTypeLabel);
  } else if (!canBulkEditAll) {
    disabled = true;
    disabledTooltip = _makeTooltip('editUnownedDisabled', objectTypeLabel);
  }

  return {
    disabled: disabled,
    disabledTooltip: disabledTooltip
  };
};
export var del = function del(_ref2) {
  var canBulkEditAll = _ref2.canBulkEditAll,
      objectTypeLabel = _ref2.objectTypeLabel;
  var disabled = false;
  var disabledTooltip;

  if (isScoped(ScopesContainer.get(), 'bet-has-delete-restriction') && !isScoped(ScopesContainer.get(), 'bet-single-delete-access')) {
    disabled = true;
    disabledTooltip = _makeTooltip('deletePropertyDisabled', objectTypeLabel);
  } else if (!canBulkEditAll) {
    disabled = true;
    disabledTooltip = _makeTooltip('editUnownedDisabled', objectTypeLabel);
  } else if (!ScopesContainer.get()['crm-bulk-delete'] && ScopesContainer.get()['crm-access']) {
    disabled = true;
    disabledTooltip = _makeTooltip('deletePropertyDisabled', objectTypeLabel);
  }

  return {
    disabled: disabled,
    disabledTooltip: disabledTooltip
  };
};
export { del as delete };
export var assign = function assign(_ref3) {
  var canBulkEditAll = _ref3.canBulkEditAll,
      _ref3$canEditOwnerPro = _ref3.canEditOwnerProperty,
      canEditOwnerProperty = _ref3$canEditOwnerPro === void 0 ? true : _ref3$canEditOwnerPro,
      objectTypeLabel = _ref3.objectTypeLabel,
      objectType = _ref3.objectType;
  var scopes = ScopesContainer.get();
  var disabled = false;
  var disabledTooltip;

  if (!hasSomeEditScopes(scopes, objectType)) {
    disabled = true;
    disabledTooltip = _makeTooltip('editDisabled', objectTypeLabel);
  }

  if (!canBulkEditAll) {
    disabled = true;
    disabledTooltip = _makeTooltip('editUnownedDisabled', objectTypeLabel);
  }

  if (!canEditOwnerProperty) {
    disabled = true;
    disabledTooltip = _makeTooltip('assignOwnerDisabled', objectTypeLabel);
  }

  return {
    disabled: disabled,
    disabledTooltip: disabledTooltip
  };
};