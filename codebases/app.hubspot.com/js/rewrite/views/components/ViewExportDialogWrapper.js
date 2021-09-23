'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useMemo } from 'react';
import { ViewExportDialog } from '../../../crm_ui/dialog/view/ViewExportDialog';
import { useSelector } from 'react-redux';
import PortalIdParser from 'PortalIdParser';
import get from 'transmute/get';
import UILink from 'UIComponents/link/UILink';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { getAuthUser } from '../../auth/selectors/authSelectors';
import { useProperties } from '../../properties/hooks/useProperties';
import { useSearchTerm } from '../../search/hooks/useSearchTerm';
import { denormalizeTypeId } from '../../utils/denormalizeTypeId';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import { alertFailure, alertSuccess } from '../../utils/alerts';
import { useHasAllScopes } from '../../auth/hooks/useHasAllScopes';
import { useViewById } from '../hooks/useViewById';
import { useModalActions } from '../../overlay/hooks/useModalActions';
import { useModalData } from '../../overlay/hooks/useModalData';
import { useHydratedSearchQuery } from '../../searchQuery/hooks/useHydratedSearchQuery';
import { useTableQueryCache } from '../../table/hooks/useTableQueryCache';

var doSuccessAlert = function doSuccessAlert(hasMarketingProduct) {
  alertSuccess({
    message: /*#__PURE__*/_jsx(FormattedJSXMessage, {
      elements: {
        UILink: UILink
      },
      options: {
        href: "/sales-products-settings/" + PortalIdParser.get() + "/importexport",
        external: true
      },
      message: hasMarketingProduct ? 'index.alerts.export.successNotificationWithExportAuditLink_jsx' : 'index.alerts.export.successBasicWithExportAuditLink_jsx'
    }),
    options: {
      sticky: true
    }
  });
};

export var doDuplicateAlert = function doDuplicateAlert() {
  return alertFailure({
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.alerts.export.duplicateTitle"
    }),
    message: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.alerts.export.duplicateMessage"
    })
  });
};
export var doFailureAlert = function doFailureAlert() {
  return alertFailure({
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.alerts.export.errorTitle"
    }),
    message: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.alerts.export.errorMessage"
    })
  });
}; // TODO: This modal pretty desperately needs a rewrite.

var ViewExportDialogWrapper = function ViewExportDialogWrapper() {
  var objectTypeId = useSelectedObjectTypeId();
  var denormalizedObjectType = denormalizeTypeId(objectTypeId);
  var hasAllScopes = useHasAllScopes();
  var hasMarketingProduct = hasAllScopes('hub-marketing-product');
  var searchTerm = useSearchTerm();

  var _useModalData = useModalData(),
      viewId = _useModalData.viewId,
      isModified = _useModalData.isModified,
      exportPageType = _useModalData.exportPageType;

  var _useHydratedSearchQue = useHydratedSearchQuery(),
      status = _useHydratedSearchQue.status,
      query = _useHydratedSearchQue.query;

  var view = useViewById(viewId);
  var user = useSelector(getAuthUser);
  var email = user.get('email');
  var userId = user.get('user_id');
  var properties = useProperties();
  var filteredProperties = useMemo(function () {
    return properties.toList().toJS().filter(function (property) {
      return !property.hidden;
    });
  }, [properties]);

  var _useTableQueryCache = useTableQueryCache(),
      data = _useTableQueryCache.data;

  var viewObjectCount = get('total', data);

  var _useModalActions = useModalActions(),
      closeModal = _useModalActions.closeModal;

  var handleSuccess = useCallback(function () {
    doSuccessAlert(hasMarketingProduct);
    closeModal();
  }, [closeModal, hasMarketingProduct]);
  var handleFailure = useCallback(function (__err, xhr) {
    if (xhr && xhr.status === 409) {
      doDuplicateAlert();
    } else {
      doFailureAlert();
    }

    closeModal();
  }, [closeModal]);
  return /*#__PURE__*/_jsx(ViewExportDialog, {
    ownerEmail: email,
    objectType: denormalizedObjectType,
    propertiesArray: filteredProperties,
    userId: userId,
    options: {
      objectType: denormalizedObjectType,
      view: view,
      query: searchTerm,
      isStateDirty: isModified,
      userEmail: email,
      isCrmObject: true,
      hydratedQueryStatus: status,
      hydratedQuery: query,
      exportPageType: exportPageType
    },
    onSuccess: handleSuccess,
    onFailure: handleFailure,
    onConfirm: closeModal,
    onReject: closeModal,
    viewObjectCount: viewObjectCount
  });
};

export default ViewExportDialogWrapper;