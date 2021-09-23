'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { useHasAllScopes } from '../../auth/hooks/useHasAllScopes';
import { useModalActions } from '../../overlay/hooks/useModalActions';
import { EXPORT_PAGE_TYPES } from '../constants/ExportPageTypes';

var ExportViewButton = function ExportViewButton(_ref) {
  var view = _ref.view,
      onClick = _ref.onClick,
      onSelectView = _ref.onSelectView;
  var hasAllScopes = useHasAllScopes();
  var isEnabled = hasAllScopes('crm-export');

  var _useModalActions = useModalActions(),
      openViewExportModal = _useModalActions.openViewExportModal;

  var handleClick = useCallback(function (event) {
    openViewExportModal({
      viewId: view.id,
      exportPageType: EXPORT_PAGE_TYPES.allViews
    });
    onSelectView();
    onClick(event);
  }, [onClick, openViewExportModal, view, onSelectView]);
  return /*#__PURE__*/_jsx(UITooltip, {
    "data-test-id": "view-export-option",
    disabled: isEnabled,
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.views.permissions.exportViewDisabled"
    }),
    children: /*#__PURE__*/_jsx(UIButton, {
      disabled: !isEnabled,
      onClick: handleClick,
      use: "link",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.views.buttons.export"
      })
    })
  });
};

ExportViewButton.propTypes = {
  view: PropTypes.instanceOf(ViewRecord).isRequired,
  onClick: PropTypes.func.isRequired,
  onSelectView: PropTypes.func.isRequired
};
export default ExportViewButton;