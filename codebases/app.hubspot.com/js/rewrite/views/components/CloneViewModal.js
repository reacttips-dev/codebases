'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
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
import UIForm from 'UIComponents/form/UIForm';
import { useViewActions } from '../hooks/useViewActions';
import { useViewById } from '../hooks/useViewById';
import { createClonedViewRecord } from '../utils/createClonedViewRecord';
import ViewNameEditor from './ViewNameEditor';
import { alertFailure, alertSuccess } from '../../utils/alerts';
import { useModalActions } from '../../overlay/hooks/useModalActions';
import { useModalData } from '../../overlay/hooks/useModalData';
import ViewLimitsSection from '../../viewCounts/components/ViewLimitsSection';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { getShouldShowViewUsageCountSection } from '../utils/getShouldShowViewCountSection';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import { useFetchViewCounts } from '../../viewCounts/hooks/useFetchViewCounts';
import { UNINITIALIZED, PENDING, FAILED, SUCCEEDED } from '../../constants/RequestStatus';
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

var CloneViewContent = function CloneViewContent(_ref) {
  var viewCountsFetchFailed = _ref.viewCountsFetchFailed,
      closeModal = _ref.closeModal;

  var _useModalData = useModalData(),
      viewId = _useModalData.viewId;

  var view = useViewById(viewId);
  var cloneableView = useMemo(function () {
    return createClonedViewRecord(view);
  }, [view]);

  var _useState = useState(cloneableView.name),
      _useState2 = _slicedToArray(_useState, 2),
      name = _useState2[0],
      setName = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      isValid = _useState4[0],
      setValid = _useState4[1];

  var _useState5 = useState(UNINITIALIZED),
      _useState6 = _slicedToArray(_useState5, 2),
      saveStatus = _useState6[0],
      setSaveStatus = _useState6[1];

  var _useViewActions = useViewActions(),
      createView = _useViewActions.createView;

  var handleSubmit = useCallback(function (event) {
    event.preventDefault();
    setSaveStatus(PENDING);
    return createView({
      view: cloneableView.set('name', name),
      isClone: true
    }).then(function () {
      doSuccessAlert(name);
      setSaveStatus(SUCCEEDED);
      closeModal();
    }).catch(function () {
      setSaveStatus(FAILED);
      doFailureAlert();
    });
  }, [cloneableView, closeModal, createView, name]);
  var objectTypeId = useSelectedObjectTypeId();

  var _useViewCountAndLimit = useViewCountAndLimit(),
      count = _useViewCountAndLimit.count,
      limit = _useViewCountAndLimit.limit;

  var hasCreateViewBERedesignGate = useHasCreateViewBERedesignGate();
  var showUsageCount = !viewCountsFetchFailed && getShouldShowViewUsageCountSection(objectTypeId, hasCreateViewBERedesignGate);
  var shouldDisableForLimit = showUsageCount && count >= limit;
  var disableSubmitButton = !isValid || shouldDisableForLimit;
  return /*#__PURE__*/_jsxs(UIForm, {
    onSubmit: handleSubmit,
    children: [/*#__PURE__*/_jsxs(UIDialogBody, {
      children: [showUsageCount && /*#__PURE__*/_jsx(ViewLimitsSection, {}), /*#__PURE__*/_jsx(ViewNameEditor, {
        shouldShowError: saveStatus !== SUCCEEDED,
        name: name,
        onChange: setName,
        onValidChange: setValid
      })]
    }), /*#__PURE__*/_jsxs(UIDialogFooter, {
      children: [/*#__PURE__*/_jsx(UILoadingButton, {
        "data-test-id": "clone-view-submit-button",
        use: "primary",
        type: "submit",
        loading: saveStatus === PENDING,
        disabled: disableSubmitButton,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.views.modals.clone.confirm"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        use: "secondary",
        onClick: closeModal,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.views.modals.clone.reject"
        })
      })]
    })]
  });
};

CloneViewContent.propTypes = {
  viewCountsFetchFailed: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
};

var CloneViewModal = function CloneViewModal() {
  var viewCountStatus = useFetchViewCounts();
  var loading = [UNINITIALIZED, PENDING].includes(viewCountStatus);
  var error = viewCountStatus === FAILED;

  var _useModalActions = useModalActions(),
      closeModal = _useModalActions.closeModal;

  return /*#__PURE__*/_jsxs(UIModal, {
    children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
      children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: closeModal
      }), /*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.views.modals.clone.title"
        })
      })]
    }), loading ? /*#__PURE__*/_jsx(UILoadingSpinner, {
      grow: true,
      minHeight: 200
    }) : /*#__PURE__*/_jsx(CloneViewContent, {
      viewCountsFetchFailed: error,
      closeModal: closeModal
    })]
  });
};

export default CloneViewModal;