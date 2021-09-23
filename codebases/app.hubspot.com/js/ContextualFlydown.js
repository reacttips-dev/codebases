'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import CampaignsFlydown from './CampaignsFlydown';
import { getAppContext } from './queryParamUtils';
import WorkflowsHandOffFlydown from './WorkflowsHandOffFlydown';
import WorkflowsNurtureFlydown from './WorkflowsNurtureFlydown';
import ReportingFlydown from './ReportingFlydown';
import WorkflowsUpdateFlydown from './WorkflowsUpdateFlydown';
import WorkflowsFlydown from './WorkflowsFlydown';
import CampaignsCaptureFlydown from './CampaignsCaptureFlydown';
import CampaignsRaiseFlydown from './CampaignsRaiseFlydown';
import CampaignsPromoteFlydown from './CampaignsPromoteFlydown';
import ReportingAnalyzeFlydown from './ReportingAnalyzeFlydown';
import ReportingMeasureFlydown from './ReportingMeasureFlydown';
import ReportingFindFlydown from './ReportingFindFlydown';
import ReportingEnsureFlydown from './ReportingEnsureFlydown';
import FeaturesFlydown from './FeaturesFlydown';
import { OPERATIONS_PROFESSIONAL } from 'self-service-api/constants/UpgradeProducts';
import OpsHubFeaturesFlydown from './flydown/OpsHubFeaturesFlydown';
import PropTypes from 'prop-types';

function ContextualFlydown(_ref) {
  var preferredTrialUpgradeProduct = _ref.preferredTrialUpgradeProduct,
      onToggleFlydown = _ref.onToggleFlydown;

  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      currentObjective = _useState2[0],
      setCurrentObjective = _useState2[1];

  var props = {
    onToggleFlydown: onToggleFlydown,
    preferredTrialUpgradeProduct: preferredTrialUpgradeProduct,
    setCurrentObjective: setCurrentObjective
  };
  if (currentObjective === 'WORKFLOWS_NURTURE') return /*#__PURE__*/_jsx(WorkflowsNurtureFlydown, Object.assign({}, props));
  if (currentObjective === 'WORKFLOWS_UPDATE') return /*#__PURE__*/_jsx(WorkflowsUpdateFlydown, Object.assign({}, props));
  if (currentObjective === 'WORKFLOWS_HAND_OFF') return /*#__PURE__*/_jsx(WorkflowsHandOffFlydown, Object.assign({}, props));
  if (currentObjective === 'CAMPAIGNS_CAPTURE') return /*#__PURE__*/_jsx(CampaignsCaptureFlydown, Object.assign({}, props));
  if (currentObjective === 'CAMPAIGNS_RAISE') return /*#__PURE__*/_jsx(CampaignsRaiseFlydown, Object.assign({}, props));
  if (currentObjective === 'CAMPAIGNS_PROMOTE') return /*#__PURE__*/_jsx(CampaignsPromoteFlydown, Object.assign({}, props));
  if (currentObjective === 'REPORTING_ANALYZE') return /*#__PURE__*/_jsx(ReportingAnalyzeFlydown, Object.assign({}, props));
  if (currentObjective === 'REPORTING_MEASURE') return /*#__PURE__*/_jsx(ReportingMeasureFlydown, Object.assign({}, props));
  if (currentObjective === 'REPORTING_FIND') return /*#__PURE__*/_jsx(ReportingFindFlydown, Object.assign({}, props));
  if (currentObjective === 'REPORTING_ENSURE') return /*#__PURE__*/_jsx(ReportingEnsureFlydown, Object.assign({}, props));
  var appContext = getAppContext(preferredTrialUpgradeProduct);
  if (appContext === 'REPORTING') return /*#__PURE__*/_jsx(ReportingFlydown, Object.assign({}, props));
  if (appContext === 'CAMPAIGNS') return /*#__PURE__*/_jsx(CampaignsFlydown, Object.assign({}, props));
  if (appContext === 'WORKFLOWS') return /*#__PURE__*/_jsx(WorkflowsFlydown, Object.assign({}, props)); // Render a special flydown for Ops Hub Pro, bc users need a little more guidance for Ops Pro than other trials.

  if (preferredTrialUpgradeProduct === OPERATIONS_PROFESSIONAL) {
    return /*#__PURE__*/_jsx(OpsHubFeaturesFlydown, {});
  }

  return /*#__PURE__*/_jsx(FeaturesFlydown, Object.assign({
    onToggleFlydown: onToggleFlydown,
    preferredTrialUpgradeProduct: preferredTrialUpgradeProduct
  }, props));
}

ContextualFlydown.propTypes = {
  preferredTrialUpgradeProduct: PropTypes.string,
  portalSettings: PropTypes.object,
  onToggleFlydown: PropTypes.func.isRequired
};
export default ContextualFlydown;