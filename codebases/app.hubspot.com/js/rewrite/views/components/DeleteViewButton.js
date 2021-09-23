'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import { DEFAULT } from 'customer-data-objects/view/ViewTypes';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { useHasAllScopes } from '../../auth/hooks/useHasAllScopes';
import { useDefaultViewId } from '../../defaultView/hooks/useDefaultViewId';
import { useCanUserEditView } from '../hooks/useCanUserEditView';
import { useModalActions } from '../../overlay/hooks/useModalActions';

var getTooltipMessage = function getTooltipMessage(_ref) {
  var isDefaultView = _ref.isDefaultView,
      isUsersDefaultView = _ref.isUsersDefaultView,
      canEditView = _ref.canEditView,
      canDeleteAllViews = _ref.canDeleteAllViews;

  if (isDefaultView) {
    return 'index.views.permissions.deleteDefaultView';
  }

  if (isUsersDefaultView) {
    return 'index.views.permissions.deleteUserDefaultView';
  }

  if (!canEditView && !canDeleteAllViews) {
    return 'index.views.permissions.deleteOtherUserView';
  }

  return '';
};

var DeleteViewButton = function DeleteViewButton(_ref2) {
  var view = _ref2.view,
      onClick = _ref2.onClick;
  var canEditView = useCanUserEditView(view);
  var defaultViewId = useDefaultViewId();
  var isUsersDefaultView = String(view.id) === String(defaultViewId);
  var hasAllScopes = useHasAllScopes();
  var canDeleteAllViews = hasAllScopes('crm-view-delete');
  var isDefaultView = view.type === DEFAULT;
  var canDeleteView = !isDefaultView && !isUsersDefaultView && (canEditView || canDeleteAllViews);
  var tooltipMessage = getTooltipMessage({
    isDefaultView: isDefaultView,
    isUsersDefaultView: isUsersDefaultView,
    canEditView: canEditView,
    canDeleteAllViews: canDeleteAllViews
  });

  var _useModalActions = useModalActions(),
      openDeleteViewModal = _useModalActions.openDeleteViewModal;

  var handleClick = useCallback(function (event) {
    openDeleteViewModal(view.id);
    onClick(event);
  }, [onClick, openDeleteViewModal, view.id]);
  return /*#__PURE__*/_jsx(UITooltip, {
    disabled: canDeleteView,
    title: !canDeleteView && /*#__PURE__*/_jsx(FormattedMessage, {
      message: tooltipMessage
    }),
    children: /*#__PURE__*/_jsx(UIButton, {
      "data-selenium-test": "view-delete-btn",
      use: "link",
      disabled: !canDeleteView,
      onClick: handleClick,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "filterSidebar.deleteView"
      })
    })
  });
};

DeleteViewButton.propTypes = {
  view: PropTypes.instanceOf(ViewRecord).isRequired,
  onClick: PropTypes.func.isRequired
};
export default DeleteViewButton;