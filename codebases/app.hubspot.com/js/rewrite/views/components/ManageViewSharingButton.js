'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { useCanUserEditView } from '../hooks/useCanUserEditView';
import { DEFAULT } from 'customer-data-objects/view/ViewTypes';
import { useModalActions } from '../../overlay/hooks/useModalActions';

var ManageViewSharingButton = function ManageViewSharingButton(_ref) {
  var view = _ref.view,
      onClick = _ref.onClick;
  var canEditView = useCanUserEditView(view);

  var _useModalActions = useModalActions(),
      openManageViewSharingModal = _useModalActions.openManageViewSharingModal;

  var handleClick = useCallback(function (event) {
    openManageViewSharingModal(view.id);
    onClick(event);
  }, [onClick, openManageViewSharingModal, view.id]);
  return /*#__PURE__*/_jsx(UITooltip, {
    disabled: canEditView,
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: view.type === DEFAULT ? 'index.views.permissions.manageSharingDisabledDefaultTooltip' : 'index.views.permissions.manageSharingDisabledTooltip'
    }),
    children: /*#__PURE__*/_jsx(UIButton, {
      disabled: !canEditView,
      onClick: handleClick,
      use: "link",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.views.buttons.manageSharing"
      })
    })
  });
};

ManageViewSharingButton.propTypes = {
  view: PropTypes.instanceOf(ViewRecord).isRequired,
  onClick: PropTypes.func.isRequired
};
export default ManageViewSharingButton;