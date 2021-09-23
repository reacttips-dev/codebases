'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import H2 from 'UIComponents/elements/headings/H2';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIForm from 'UIComponents/form/UIForm';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIMatchTextArea from 'UIComponents/input/UIMatchTextArea';
import BaseDialog from 'customer-data-ui-utilities/dialog/BaseDialog';
import { useCrmObjectsActions } from '../hooks/useCrmObjectsActions';
import { useModalActions } from '../../overlay/hooks/useModalActions';
import { useModalData } from '../../overlay/hooks/useModalData';
import { doSuccessAlert, doFailureAlert } from './BulkDeleteModalAlerts';
import { useViewObjectCount } from '../../table/hooks/useViewObjectCount';
import { useHydratedSearchQuery } from '../../searchQuery/hooks/useHydratedSearchQuery';
import { useSelectedObjectTypeDef } from 'crm-index-ui/crmObjects/hooks/useSelectedObjectTypeDef';

var BulkDeleteModal = function BulkDeleteModal() {
  var _useModalActions = useModalActions(),
      closeModal = _useModalActions.closeModal;

  var _useModalData = useModalData(),
      selection = _useModalData.selection,
      onConfirm = _useModalData.onConfirm,
      isSelectingEntireQuery = _useModalData.isSelectingEntireQuery;

  var viewObjectCount = useViewObjectCount();
  var count = isSelectingEntireQuery ? viewObjectCount : selection.size;
  var typeDef = useSelectedObjectTypeDef();

  var _useCrmObjectsActions = useCrmObjectsActions(),
      deleteCrmObjects = _useCrmObjectsActions.deleteCrmObjects;

  var _useHydratedSearchQue = useHydratedSearchQuery(),
      hydratedSearchQuery = _useHydratedSearchQue.query;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isApplyToAllChecked = _useState2[0],
      setApplyToAllChecked = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isLoading = _useState4[0],
      setIsLoading = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      isMatched = _useState6[0],
      setMatched = _useState6[1];

  var canSave = useMemo(function () {
    return isMatched && (!isSelectingEntireQuery || isApplyToAllChecked);
  }, [isMatched, isSelectingEntireQuery, isApplyToAllChecked]);
  var getModalTitle = useMemo(function () {
    if (isSelectingEntireQuery) {
      return 'index.bulkActions.modals.delete.titleAll';
    }

    return 'index.bulkActions.modals.delete.title';
  }, [isSelectingEntireQuery]);
  var handleApplyToAllChange = useCallback(function (_ref) {
    var checked = _ref.target.checked;
    setApplyToAllChecked(checked);
  }, [setApplyToAllChecked]);
  var handleConfirm = useCallback(function () {
    var filterGroups = hydratedSearchQuery.filterGroups,
        query = hydratedSearchQuery.query;
    setIsLoading(true);
    return deleteCrmObjects({
      objectIds: selection.toArray(),
      isSelectingEntireQuery: isSelectingEntireQuery,
      filterGroups: filterGroups,
      query: query
    }).then(function () {
      setIsLoading(false);
      onConfirm();
      closeModal();
      doSuccessAlert({
        count: count,
        typeDef: typeDef
      });
    }).catch(function () {
      setIsLoading(false);
      doFailureAlert(count);
    });
  }, [closeModal, count, deleteCrmObjects, hydratedSearchQuery, isSelectingEntireQuery, onConfirm, selection, typeDef]);
  var handleMatchedChange = useCallback(function (_ref2) {
    var value = _ref2.target.value;
    setMatched(value);
  }, [setMatched]);
  return /*#__PURE__*/_jsxs(BaseDialog, {
    width: 450,
    size: "auto",
    use: "danger",
    confirmUse: "danger",
    title: /*#__PURE__*/_jsx(H2, {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: getModalTitle,
        options: {
          count: count
        }
      })
    }),
    confirmLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.bulkActions.modals.delete.confirm"
    }),
    rejectLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.bulkActions.modals.delete.reject"
    }),
    confirmDisabled: !canSave,
    confirmProps: {
      loading: isLoading,
      'data-selenium-test': 'delete-dialog-confirm-button'
    },
    isConfirmButtonLoading: true,
    onConfirm: handleConfirm,
    onReject: closeModal,
    children: [/*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.bulkActions.modals.delete.body",
      options: {
        count: count
      }
    }), /*#__PURE__*/_jsxs(UIForm, {
      children: [/*#__PURE__*/_jsx(UIFormControl, {
        className: "m-y-4",
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.bulkActions.modals.delete.label"
        }),
        children: /*#__PURE__*/_jsx(UIMatchTextArea, {
          match: String(count),
          onMatchedChange: handleMatchedChange,
          size: "xxl"
        })
      }), isSelectingEntireQuery && /*#__PURE__*/_jsx(UICheckbox, {
        checked: isApplyToAllChecked,
        onChange: handleApplyToAllChange,
        className: "m-top-2",
        "data-test-id": "apply-to-all-checkbox",
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "index.bulkActions.modals.delete.confirmApplyToAll"
        })
      })]
    })]
  });
};

export default BulkDeleteModal;