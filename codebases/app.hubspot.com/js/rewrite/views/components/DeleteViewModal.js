'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { useCallback, useState } from 'react';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import UIConfirmModal from 'UIComponents/dialog/UIConfirmModal';
import { useViewActions } from '../hooks/useViewActions';
import { useViewById } from '../hooks/useViewById';
import { alertFailure, alertSuccess } from '../../utils/alerts';
import { useModalActions } from '../../overlay/hooks/useModalActions';
import { useModalData } from '../../overlay/hooks/useModalData';
import get from 'transmute/get';
import { useCanUserEditView } from '../hooks/useCanUserEditView';
import { FAILED, PENDING, SUCCEEDED, UNINITIALIZED } from '../../constants/RequestStatus';

var doSuccessAlert = function doSuccessAlert(name) {
  return alertSuccess({
    message: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "index.alerts.viewDelete.success.message",
      options: {
        name: name
      }
    })
  });
};

var doFailureAlert = function doFailureAlert() {
  return alertFailure({
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.alerts.viewDelete.failure.title"
    })
  });
};

var DeleteViewModal = function DeleteViewModal() {
  var _useModalData = useModalData(),
      viewId = _useModalData.viewId;

  var view = useViewById(viewId);
  var viewName = get('name', view) || ''; // useCanUserEditView just compares the user's userId with the view's ownerId
  // so it is equivalent to checking if the user owns this view.

  var isOwner = useCanUserEditView(view);

  var _useState = useState(UNINITIALIZED),
      _useState2 = _slicedToArray(_useState, 2),
      deleteStatus = _useState2[0],
      setDeleteStatus = _useState2[1];

  var _useViewActions = useViewActions(),
      deleteView = _useViewActions.deleteView;

  var _useModalActions = useModalActions(),
      closeModal = _useModalActions.closeModal;

  var handleConfirm = useCallback(function () {
    setDeleteStatus(PENDING);
    return deleteView(viewId).then(function () {
      doSuccessAlert(viewName);
      setDeleteStatus(SUCCEEDED);
      closeModal();
    }).catch(function () {
      doFailureAlert();
      setDeleteStatus(FAILED);
    });
  }, [closeModal, deleteView, viewId, viewName]);
  var shouldShowOwnerWarning = !isOwner && deleteStatus !== SUCCEEDED;
  return /*#__PURE__*/_jsx(UIConfirmModal, {
    confirmUse: "danger",
    size: "auto",
    use: "danger",
    message: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.views.modals.delete.title"
    }),
    description: /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "index.views.modals.delete.body",
        options: {
          name: viewName
        }
      }), shouldShowOwnerWarning && /*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "filterSidebar.modifyView.notOwner"
        })
      })]
    }),
    confirmLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.views.modals.delete.confirm"
    }),
    rejectLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.views.modals.delete.reject"
    }),
    confirmButtonProps: {
      loading: deleteStatus === PENDING
    },
    ConfirmButton: UILoadingButton,
    onConfirm: handleConfirm,
    onReject: closeModal
  });
};

export default DeleteViewModal;