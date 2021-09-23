'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import * as Alerts from 'customer-data-ui-utilities/alerts/Alerts';
import { temporarilyExcludeIds } from '../../flux/grid/GridUIActions';
import FormattedMessage from 'I18n/components/FormattedMessage';
import objectNameDependency from '../../dependencies/objectNameDependency';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { removeFromStaticList } from 'crm_data/lists/ObjectListsAPI';
import { Set as ImmutableSet } from 'immutable';
import UIConfirmModal from 'UIComponents/dialog/UIConfirmModal';
import UserStore from 'crm_data/user/UserStore';
import { useStoreDependency } from 'general-store';
export var userIdDependency = {
  stores: [UserStore],
  deref: function deref() {
    return UserStore.get('user_id');
  }
};

var BulkRemoveFromObjectListModal = function BulkRemoveFromObjectListModal(props) {
  var clearSelection = props.clearSelection,
      listId = props.listId,
      ids = props.ids,
      objectTypeId = props.objectTypeId,
      onReject = props.onReject;
  var userId = useStoreDependency(userIdDependency);
  var singularObjectName = useStoreDependency(objectNameDependency, {
    objectType: objectTypeId
  });
  var pluralObjectName = useStoreDependency(objectNameDependency, {
    isPlural: true,
    objectType: objectTypeId
  });
  var removalCount = ids.size;
  var onConfirmHandler = useCallback(function () {
    removeFromStaticList({
      ids: ids,
      listId: listId,
      objectTypeId: objectTypeId,
      userId: userId
    }).then(function () {
      temporarilyExcludeIds(ids);

      if (clearSelection) {
        clearSelection();
      }

      Alerts.addSuccess('topbarContents.lists.removeFromObjectListModal.successAlert', {
        count: removalCount,
        singularObjectName: singularObjectName,
        pluralObjectName: pluralObjectName
      });
    }, function () {
      onReject();
      Alerts.addDanger('topbarContents.lists.removeFromObjectListModal.failureAlert', {
        count: removalCount,
        singularObjectName: singularObjectName,
        pluralObjectName: pluralObjectName
      });
    });
  }, [ids, clearSelection, listId, objectTypeId, onReject, pluralObjectName, removalCount, singularObjectName, userId]);
  return /*#__PURE__*/_jsx(UIConfirmModal, {
    "data-selenium-test": "bulk-remove-from-object-list-modal",
    confirmLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "topbarContents.lists.removeFromObjectListModal.confirm"
    }),
    description: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "topbarContents.lists.removeFromObjectListModal.message",
      options: {
        count: removalCount,
        singularObjectName: singularObjectName,
        pluralObjectName: pluralObjectName
      }
    }),
    message: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "topbarContents.lists.removeFromObjectListModal.title",
      options: {
        count: removalCount,
        singularObjectName: singularObjectName,
        pluralObjectName: pluralObjectName
      }
    }),
    onConfirm: onConfirmHandler,
    onReject: onReject,
    rejectLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "topbarContents.lists.removeFromObjectListModal.reject"
    })
  });
};

BulkRemoveFromObjectListModal.propTypes = {
  clearSelection: PropTypes.func,
  listId: PropTypes.number,
  ids: PropTypes.instanceOf(ImmutableSet),
  objectTypeId: PropTypes.string,
  onReject: PropTypes.func
};
export default BulkRemoveFromObjectListModal;