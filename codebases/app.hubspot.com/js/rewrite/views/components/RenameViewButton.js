'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import * as ViewTypes from 'customer-data-objects/view/ViewTypes';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIButton from 'UIComponents/button/UIButton';
import { useCanUserEditView } from '../hooks/useCanUserEditView';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import { useModalActions } from '../../overlay/hooks/useModalActions';

var RenameViewButton = function RenameViewButton(_ref) {
  var view = _ref.view,
      onClick = _ref.onClick;
  var canEditView = useCanUserEditView(view);

  var _useModalActions = useModalActions(),
      openRenameViewModal = _useModalActions.openRenameViewModal;

  var handleClick = useCallback(function (event) {
    openRenameViewModal(String(view.id));
    onClick(event);
  }, [onClick, openRenameViewModal, view.id]);
  return /*#__PURE__*/_jsx(UITooltip, {
    disabled: canEditView,
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: view.type === ViewTypes.DEFAULT ? 'index.views.permissions.renameDefaultViewDisabled' : 'index.views.permissions.renameViewDisabled'
    }),
    children: /*#__PURE__*/_jsx(UIButton, {
      disabled: !canEditView,
      onClick: handleClick,
      use: "link",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.views.buttons.rename"
      })
    })
  });
};

RenameViewButton.propTypes = {
  view: PropTypes.instanceOf(ViewRecord).isRequired,
  onClick: PropTypes.func.isRequired
};
export default RenameViewButton;