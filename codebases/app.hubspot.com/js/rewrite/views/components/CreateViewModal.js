'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIModal from 'UIComponents/dialog/UIModal';
import { useViewActions } from '../hooks/useViewActions';
import { useViewById } from '../hooks/useViewById';
import { ALL } from '../constants/DefaultViews';
import { createClonedViewRecord } from '../utils/createClonedViewRecord';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import ViewNameEditor from './ViewNameEditor';
import ViewSharingEditor from './ViewSharingEditor';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import UIButton from 'UIComponents/button/UIButton';
import UIForm from 'UIComponents/form/UIForm';
import H2 from 'UIComponents/elements/headings/H2';
import { useNavigate } from '../../navigation/hooks/useNavigate';
import { alertFailure, alertSuccess } from '../../utils/alerts';
import { useModalActions } from '../../overlay/hooks/useModalActions';
import { useModalData } from '../../overlay/hooks/useModalData';
import ViewLimitsSection from '../../viewCounts/components/ViewLimitsSection';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { getShouldShowViewUsageCountSection } from '../utils/getShouldShowViewCountSection';
import { useFetchViewCounts } from '../../viewCounts/hooks/useFetchViewCounts';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import { FAILED, PENDING, SUCCEEDED, UNINITIALIZED } from '../../constants/RequestStatus';
import { useViewCountAndLimit } from '../../viewCounts/hooks/useViewCountAndLimit';
import { useHasCreateViewBERedesignGate } from '../hooks/useHasCreateViewBERedesignGate';

var doSuccessAlert = function doSuccessAlert(name) {
  return alertSuccess({
    message: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "index.alerts.viewCreate.success.message",
      options: {
        name: name
      }
    })
  });
};

var doFailureAlert = function doFailureAlert() {
  return alertFailure({
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.alerts.viewCreate.failure.title"
    })
  });
};

var CreateViewContent = function CreateViewContent(_ref) {
  var viewCountsFetchFailed = _ref.viewCountsFetchFailed,
      closeModal = _ref.closeModal;

  var _useModalData = useModalData(),
      viewIdToClone = _useModalData.viewIdToClone;

  var clonedView = useViewById(viewIdToClone);
  var allView = useViewById(ALL);
  var view = useMemo(function () {
    var baseView = clonedView || allView;
    return createClonedViewRecord(baseView).set('name', '');
  }, [allView, clonedView]);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isNameValid = _useState2[0],
      setIsNameValid = _useState2[1];

  var _useState3 = useState(view.name),
      _useState4 = _slicedToArray(_useState3, 2),
      name = _useState4[0],
      setName = _useState4[1];

  var _useState5 = useState({
    teamId: view.teamId,
    private: view.private
  }),
      _useState6 = _slicedToArray(_useState5, 2),
      sharingState = _useState6[0],
      setSharingState = _useState6[1];

  var _useState7 = useState(UNINITIALIZED),
      _useState8 = _slicedToArray(_useState7, 2),
      saveStatus = _useState8[0],
      setSaveStatus = _useState8[1];

  var navigate = useNavigate();

  var _useViewActions = useViewActions(),
      createView = _useViewActions.createView;

  var handleSubmit = useCallback(function (event) {
    event.preventDefault();
    setSaveStatus(PENDING);
    return createView({
      view: view.set('name', name).set('teamId', sharingState.teamId).set('private', sharingState.private)
    }).then(function (createdView) {
      doSuccessAlert(name);
      setSaveStatus(SUCCEEDED);
      closeModal();
      navigate({
        viewId: createdView.id
      });
    }).catch(function () {
      doFailureAlert();
      setSaveStatus(FAILED);
    });
  }, [closeModal, createView, name, navigate, sharingState.private, sharingState.teamId, view]);
  var objectTypeId = useSelectedObjectTypeId();

  var _useViewCountAndLimit = useViewCountAndLimit(),
      count = _useViewCountAndLimit.count,
      limit = _useViewCountAndLimit.limit;

  var hasCreateViewBERedesignGate = useHasCreateViewBERedesignGate();
  var showUsageCount = !viewCountsFetchFailed && getShouldShowViewUsageCountSection(objectTypeId, hasCreateViewBERedesignGate);
  var shouldDisableForLimit = showUsageCount && count >= limit;
  var disableSubmitButton = !isNameValid || shouldDisableForLimit;
  return /*#__PURE__*/_jsxs(UIForm, {
    onSubmit: handleSubmit,
    children: [/*#__PURE__*/_jsxs(UIDialogBody, {
      children: [showUsageCount && /*#__PURE__*/_jsx(ViewLimitsSection, {}), /*#__PURE__*/_jsx(ViewNameEditor, {
        shouldShowError: saveStatus !== SUCCEEDED,
        name: name,
        onChange: setName,
        onValidChange: setIsNameValid
      }), /*#__PURE__*/_jsx(ViewSharingEditor, {
        initialView: view,
        onChange: setSharingState
      })]
    }), /*#__PURE__*/_jsxs(UIDialogFooter, {
      children: [/*#__PURE__*/_jsx(UILoadingButton, {
        "data-selenium-test": "view-modal-save-btn",
        use: "primary",
        type: "submit",
        disabled: disableSubmitButton,
        loading: saveStatus === PENDING,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.views.modals.create.confirm"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        use: "secondary",
        onClick: closeModal,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.views.modals.create.reject"
        })
      })]
    })]
  });
};

CreateViewContent.propTypes = {
  viewCountsFetchFailed: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
};

var CreateViewModal = function CreateViewModal() {
  var viewCountStatus = useFetchViewCounts();
  var loading = [UNINITIALIZED, PENDING].includes(viewCountStatus);
  var error = viewCountStatus === FAILED;

  var _useModalActions = useModalActions(),
      closeModal = _useModalActions.closeModal;

  return /*#__PURE__*/_jsxs(UIModal, {
    children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
      style: {
        flexDirection: 'column'
      },
      children: [/*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.views.modals.create.title"
        })
      }), /*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: closeModal
      })]
    }), loading ? /*#__PURE__*/_jsx(UILoadingSpinner, {
      grow: true,
      minHeight: 300
    }) : /*#__PURE__*/_jsx(CreateViewContent, {
      viewCountsFetchFailed: error,
      closeModal: closeModal
    })]
  });
};

export default CreateViewModal;