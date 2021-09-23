'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import BatchMutateAPI from 'crm_data/batch/BatchMutateAPI';
import ObjectsActions from 'crm_data/objects/ObjectsActions';
import UserStore from 'crm_data/user/UserStore';
import ScopesContainer from '../../../../../containers/ScopesContainer';
import { clearSelected, temporarilyExcludeIds } from '../../../../flux/grid/GridUIActions';
import BulkActionButton from './BulkActionButton';
import { del } from '../../../permissions/bulkActionPermissions';
import { isObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
import { getObjectTypeLabel } from '../../../utils/BulkActionPropsRecord';
import BulkActionPropsType from '../../../utils/BulkActionPropsType';
import WithClassWrapper from 'customer-data-objects-ui-components/hoc/WithClassWrapper';
import DeleteObjectPrompt from 'customer-data-objects-ui-components/prompt/DeleteObjectPrompt';
import { CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import { CrmLogger } from 'customer-data-tracking/loggers';
import enviro from 'enviro';
import { connect } from 'general-store';
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { Set as ImmutableSet } from 'immutable';
import PropTypes from 'prop-types';
import Raven from 'Raven';
import invariant from 'react-utils/invariant';
import { isScoped } from '../../../../../containers/ScopeOperators';
import emptyFunction from 'react-utils/emptyFunction';
import { useSelectedObjectTypeDef } from 'crm-index-ui/crmObjects/hooks/useSelectedObjectTypeDef';
import { doSuccessAlert } from 'crm-index-ui/rewrite/crmObjects/components/BulkDeleteModalAlerts';

var BulkDeleteButton = function BulkDeleteButton(_ref) {
  var bulkActionProps = _ref.bulkActionProps,
      options = _ref.options,
      userEmail = _ref.userEmail,
      _ref$Prompt = _ref.Prompt,
      Prompt = _ref$Prompt === void 0 ? DeleteObjectPrompt : _ref$Prompt,
      _ref$onSuccess = _ref.onSuccess,
      onSuccess = _ref$onSuccess === void 0 ? emptyFunction : _ref$onSuccess;
  var allSelected = bulkActionProps.allSelected,
      canBulkEditAll = bulkActionProps.canBulkEditAll,
      objectType = bulkActionProps.objectType,
      objectTypeLabel = bulkActionProps.objectTypeLabel,
      clearSelection = bulkActionProps.clearSelection;
  var typeDef = useSelectedObjectTypeDef();

  var _del = del({
    canBulkEditAll: canBulkEditAll,
    objectTypeLabel: objectTypeLabel
  }),
      disabled = _del.disabled,
      disabledTooltip = _del.disabledTooltip;

  var deleteCleanUp = function deleteCleanUp() {
    var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableSet();
    ObjectsActions.bulkUpdateStoresLocal(objectType, ids, null);

    if (clearSelection) {
      clearSelection();
    }

    temporarilyExcludeIds(ids);
    clearSelected();
  };

  var deleteConfirm = function deleteConfirm(ids, selectionCount, action) {
    var gdprEnabled = bulkActionProps.gdprEnabled,
        isFilterApplied = bulkActionProps.isFilterApplied;

    if (gdprEnabled === undefined) {
      if (!enviro.deployed()) {
        invariant(gdprEnabled, 'Bulk action - delete - gdprEnabled is undefined');
      }

      Raven.captureException('Bulk action - delete - gdprEnabled is undefined');
    }

    if (ids.size !== 0 || allSelected) {
      var confirmLabel = I18n.text('deleteModal.buttonText');
      var msgOptions = {
        type: getObjectTypeLabel(bulkActionProps),
        singular: getObjectTypeLabel(bulkActionProps, {
          singular: true
        }),
        count: selectionCount
      };
      var title = allSelected ? /*#__PURE__*/_jsx(FormattedMessage, {
        message: "deleteModal.titleAll",
        options: msgOptions
      }) : /*#__PURE__*/_jsx(FormattedMessage, {
        message: "deleteModal.title",
        options: msgOptions
      });

      var message = /*#__PURE__*/_jsx(FormattedMessage, {
        message: 'deleteModal.boldMove',
        options: msgOptions
      });

      var match = "" + selectionCount;

      var matchLabel = /*#__PURE__*/_jsx(FormattedMessage, {
        message: "deleteModal.matchLabel",
        options: {
          type: objectTypeLabel
        }
      });

      var isScopedForGdprDelete = isScoped(ScopesContainer.get(), 'contacts-gdpr-delete');
      var dialogNote = gdprEnabled && objectType === CONTACT ? /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        "data-selenium-test": "gdpr-information-note",
        message: "deleteModal.gdprInformation"
      }) : null;
      var hasNoFilters = allSelected ? !isFilterApplied : false;
      Prompt({
        confirmLabel: confirmLabel,
        message: message,
        title: title,
        match: match,
        matchLabel: matchLabel,
        gdprEnabled: gdprEnabled,
        isScopedForGdprDelete: isScopedForGdprDelete,
        objectType: objectType,
        dialogNote: dialogNote,
        hasNoFilters: hasNoFilters,
        // GDPR bulk deletes are currently not supported
        gdprDeletePossible: false,
        callback: action
      });
    }
  };

  var onDelete = function onDelete() {
    var checked = bulkActionProps.get('checked');
    var selectionCount = bulkActionProps.get('selectionCount');
    CrmLogger.log('indexInteractions', {
      action: 'open bulk delete modal',
      type: objectType
    });
    deleteConfirm(checked, selectionCount, function (_ref2) {
      var applyToAll = _ref2.applyToAll;
      var deleteObj = {
        objectType: objectType,
        applyToAll: applyToAll,
        selectedCount: selectionCount,
        email: userEmail
      };

      if (allSelected) {
        deleteObj.query = bulkActionProps.get('query');
      } else {
        deleteObj.query = checked.toArray();
      }

      BatchMutateAPI.delete(deleteObj).then(function () {
        onSuccess();
        deleteCleanUp(checked);
        doSuccessAlert({
          count: selectionCount,
          typeDef: typeDef
        });
      }).done();
      CrmLogger.log('bulkDelete', {
        subscreen2: 'bulk-delete-modal'
      });
    });
  };

  if (!disabled && isObjectTypeId(objectType) && allSelected) {
    disabled = true;
    disabledTooltip = /*#__PURE__*/_jsx(FormattedMessage, {
      message: "bulkActions.disabledForCrmObjects.delete"
    });
  }

  return /*#__PURE__*/_jsx(BulkActionButton, {
    "data-selenium-test": "bulk-action-delete",
    disabled: disabled,
    disabledTooltip: disabledTooltip,
    icon: "delete",
    onClick: onDelete,
    options: options,
    title: I18n.text('topbarContents.deleteProperty')
  });
};

var deps = {
  userEmail: {
    stores: [UserStore],
    deref: function deref() {
      return UserStore.get('email');
    }
  }
};
BulkDeleteButton.propTypes = {
  bulkActionProps: BulkActionPropsType.isRequired,
  options: PropTypes.object,
  Prompt: PropTypes.func,
  userEmail: PropTypes.string.isRequired,
  onSuccess: PropTypes.func
};
export default connect(deps)(WithClassWrapper(BulkDeleteButton));