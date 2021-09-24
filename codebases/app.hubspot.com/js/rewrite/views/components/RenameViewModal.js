'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useCallback, useMemo } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UIButton from 'UIComponents/button/UIButton';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIModal from 'UIComponents/dialog/UIModal';
import UIForm from 'UIComponents/form/UIForm';
import H2 from 'UIComponents/elements/headings/H2';
import { useViewActions } from '../hooks/useViewActions';
import ViewNameEditor from './ViewNameEditor';
import { useViewById } from '../hooks/useViewById';
import { alertFailure, alertSuccess } from '../../utils/alerts';
import { useModalActions } from '../../overlay/hooks/useModalActions';
import { useModalData } from '../../overlay/hooks/useModalData';
import { FAILED, PENDING, SUCCEEDED, UNINITIALIZED } from '../../constants/RequestStatus';

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

var RenameViewModal = function RenameViewModal() {
  var _useModalData = useModalData(),
      viewId = _useModalData.viewId;

  var view = useViewById(viewId);

  var _useState = useState(view.name),
      _useState2 = _slicedToArray(_useState, 2),
      name = _useState2[0],
      setName = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      valid = _useState4[0],
      setValid = _useState4[1];

  var hasChanged = useMemo(function () {
    return view.name !== name;
  }, [name, view.name]);

  var _useState5 = useState(UNINITIALIZED),
      _useState6 = _slicedToArray(_useState5, 2),
      saveStatus = _useState6[0],
      setSaveStatus = _useState6[1];

  var _useModalActions = useModalActions(),
      closeModal = _useModalActions.closeModal;

  var _useViewActions = useViewActions(),
      saveView = _useViewActions.saveView;

  var handleSubmit = useCallback(function (event) {
    event.preventDefault();
    setSaveStatus(PENDING);
    return saveView(view.set('name', name)).then(function () {
      doSuccessAlert(name);
      setSaveStatus(SUCCEEDED);
      closeModal();
    }).catch(function () {
      doFailureAlert();
      setSaveStatus(FAILED);
    });
  }, [closeModal, name, saveView, view]);
  return /*#__PURE__*/_jsx(UIModal, {
    children: /*#__PURE__*/_jsxs(UIForm, {
      "data-test-id": "rename-view-form",
      onSubmit: handleSubmit,
      children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
        children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
          onClick: closeModal
        }), /*#__PURE__*/_jsx(H2, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "index.views.modals.rename.title"
          })
        })]
      }), /*#__PURE__*/_jsx(UIDialogBody, {
        children: /*#__PURE__*/_jsx(ViewNameEditor, {
          shouldShowError: saveStatus !== SUCCEEDED,
          name: name,
          onChange: setName,
          onValidChange: setValid
        })
      }), /*#__PURE__*/_jsxs(UIDialogFooter, {
        children: [/*#__PURE__*/_jsx(UILoadingButton, {
          type: "submit",
          use: "primary",
          disabled: !valid || !hasChanged,
          loading: saveStatus === PENDING,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "index.views.modals.rename.confirm"
          })
        }), /*#__PURE__*/_jsx(UIButton, {
          "data-test-id": "cancel-rename-view-modal",
          onClick: closeModal,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "index.views.modals.rename.reject"
          })
        })]
      })]
    })
  });
};

export default RenameViewModal;