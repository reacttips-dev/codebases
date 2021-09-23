'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UIButton from 'UIComponents/button/UIButton';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIModal from 'UIComponents/dialog/UIModal';
import H2 from 'UIComponents/elements/headings/H2';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import { useFetchTeams } from '../../teams/hooks/useFetchTeams';
import { useViewActions } from '../hooks/useViewActions';
import { useViewById } from '../hooks/useViewById';
import ViewSharingEditor from './ViewSharingEditor';
import { alertFailure, alertSuccess } from '../../utils/alerts';
import { useModalActions } from '../../overlay/hooks/useModalActions';
import { useModalData } from '../../overlay/hooks/useModalData';

var doSuccessAlert = function doSuccessAlert(name) {
  return alertSuccess({
    message: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "index.alerts.viewUpdate.success.message",
      options: {
        name: name
      }
    })
  });
};

var doFailureAlert = function doFailureAlert() {
  return alertFailure({
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.alerts.viewUpdate.failure.title"
    })
  });
};

var ManageViewSharingModal = function ManageViewSharingModal() {
  var areTeamsFetched = useFetchTeams();

  var _useModalData = useModalData(),
      viewId = _useModalData.viewId;

  var view = useViewById(viewId);

  var _useState = useState({
    private: view.private,
    teamId: view.teamId
  }),
      _useState2 = _slicedToArray(_useState, 2),
      sharingState = _useState2[0],
      setSharingState = _useState2[1];

  var hasChanged = useMemo(function () {
    return view.private !== sharingState.private || view.teamId !== sharingState.teamId;
  }, [sharingState.private, sharingState.teamId, view.private, view.teamId]);

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isLoading = _useState4[0],
      setIsLoading = _useState4[1];

  var _useModalActions = useModalActions(),
      closeModal = _useModalActions.closeModal;

  var _useViewActions = useViewActions(),
      saveView = _useViewActions.saveView;

  var handleClick = useCallback(function () {
    setIsLoading(true);
    return saveView(view.set('private', sharingState.private).set('teamId', sharingState.teamId)).then(function () {
      setIsLoading(false);
      doSuccessAlert(view.name);
      closeModal();
    }).catch(function () {
      doFailureAlert();
      setIsLoading(false);
    });
  }, [closeModal, saveView, sharingState.private, sharingState.teamId, view]);
  return /*#__PURE__*/_jsxs(UIModal, {
    children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
      children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: closeModal
      }), /*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.views.modals.manageSharing.title"
        })
      })]
    }), /*#__PURE__*/_jsx(UIDialogBody, {
      children: areTeamsFetched ? /*#__PURE__*/_jsx(ViewSharingEditor, {
        initialView: view,
        onChange: setSharingState
      }) : /*#__PURE__*/_jsx(UILoadingSpinner, {
        grow: true
      })
    }), /*#__PURE__*/_jsxs(UIDialogFooter, {
      children: [/*#__PURE__*/_jsx(UILoadingButton, {
        use: "primary",
        loading: isLoading,
        onClick: handleClick,
        disabled: !hasChanged,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.views.modals.manageSharing.confirm"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        use: "secondary",
        onClick: closeModal,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.views.modals.manageSharing.reject"
        })
      })]
    })]
  });
};

export default ManageViewSharingModal;