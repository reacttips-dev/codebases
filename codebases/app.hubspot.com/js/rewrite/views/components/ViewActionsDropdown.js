'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIList from 'UIComponents/list/UIList';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import ReportLink from './ReportLink';
import ExportViewButton from './ExportViewButton';
import RenameViewButton from './RenameViewButton';
import ManageViewSharingButton from './ManageViewSharingButton';
import DeleteViewButton from './DeleteViewButton';
import CloneViewButton from './CloneViewButton';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
import { getTypeHasExport } from '../../../crmObjects/methods/getTypeHasExport';
import { getTypeHasReportLink } from '../../../crmObjects/methods/getTypeHasReportLink';

var ViewActionsDropdown = function ViewActionsDropdown(_ref) {
  var view = _ref.view,
      onActionTaken = _ref.onActionTaken,
      handleOnOpenChange = _ref.handleOnOpenChange,
      onSelectView = _ref.onSelectView;
  var typeDef = useSelectedObjectTypeDef();
  var hasExport = getTypeHasExport(typeDef);
  var hasReportLink = getTypeHasReportLink(typeDef);
  var buttons = useMemo(function () {
    return [].concat(_toConsumableArray(hasReportLink ? [ReportLink] : []), [CloneViewButton, DeleteViewButton], _toConsumableArray(hasExport ? [ExportViewButton] : []), [ManageViewSharingButton, RenameViewButton]);
  }, [hasExport, hasReportLink]);
  var handleClick = useCallback(function (event) {
    event.stopPropagation();
    onActionTaken();
  }, [onActionTaken]);
  return /*#__PURE__*/_jsx("span", {
    className: "flex-shrink-0 word-break-normal",
    children: /*#__PURE__*/_jsx(UIDropdown, {
      "data-selenium-test": "view-actions-dropdown",
      menuWidth: "auto",
      buttonSize: "small",
      buttonClassName: "m-right-2",
      buttonUse: "link",
      buttonText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "filterSidebar.viewActions"
      }),
      closeOnMenuClick: false,
      onClick: function onClick(evt) {
        return evt.stopPropagation();
      },
      onOpenChange: handleOnOpenChange,
      children: /*#__PURE__*/_jsx(UIList, {
        children: buttons.map(function (Button, index) {
          return /*#__PURE__*/_jsx(Button, {
            view: view,
            onClick: handleClick,
            onSelectView: onSelectView
          }, index);
        })
      })
    })
  });
};

ViewActionsDropdown.propTypes = {
  view: PropTypes.instanceOf(ViewRecord).isRequired,
  onActionTaken: PropTypes.func.isRequired,
  handleOnOpenChange: PropTypes.func.isRequired,
  onSelectView: PropTypes.func.isRequired
};
export default ViewActionsDropdown;