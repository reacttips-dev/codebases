'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";

var _objectTypeIdToReport;

import PropTypes from 'prop-types';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import { useHasAllScopes } from '../../auth/hooks/useHasAllScopes';
import UIButton from 'UIComponents/button/UIButton';
import UIDropdownDivider from 'UIComponents/dropdown/UIDropdownDivider';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PortalIdParser from 'PortalIdParser';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { generatePath } from 'react-router-dom';
import get from 'transmute/get';
import { COMPANY_TYPE_ID, CONTACT_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import ReportBuilderUpgradeButton from '../../../upgrades/components/ReportBuilderUpgradeButton';
var portalId = PortalIdParser.get();
var objectTypeIdToReportPath = (_objectTypeIdToReport = {}, _defineProperty(_objectTypeIdToReport, CONTACT_TYPE_ID, 'contact'), _defineProperty(_objectTypeIdToReport, COMPANY_TYPE_ID, 'company'), _defineProperty(_objectTypeIdToReport, DEAL_TYPE_ID, 'deal'), _defineProperty(_objectTypeIdToReport, TICKET_TYPE_ID, 'ticket'), _objectTypeIdToReport);

var ReportLink = function ReportLink(_ref) {
  var view = _ref.view,
      onClick = _ref.onClick;
  var hasAllScopes = useHasAllScopes();
  var objectTypeId = useSelectedObjectTypeId();
  var hasReportBuilderAccess = hasAllScopes('reports-builder-access');
  var createViewReportUrl = generatePath('/report-builder/:portalId/crm/:objectTypePath/:viewId', {
    portalId: portalId,
    objectTypePath: objectTypeIdToReportPath[objectTypeId],
    viewId: get('id', view)
  });
  var button = hasReportBuilderAccess ? /*#__PURE__*/_jsx(UIButton, {
    "data-test-id": "report-link",
    external: true,
    href: createViewReportUrl,
    onClick: onClick,
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "filterSidebar.createViewReport.linkLabel"
    })
  }) : /*#__PURE__*/_jsx(ReportBuilderUpgradeButton, {
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "filterSidebar.createReportFromView"
    })
  });
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [button, /*#__PURE__*/_jsx(UIDropdownDivider, {})]
  });
};

ReportLink.propTypes = {
  view: PropTypes.instanceOf(ViewRecord).isRequired,
  onClick: PropTypes.func.isRequired
};
export default ReportLink;