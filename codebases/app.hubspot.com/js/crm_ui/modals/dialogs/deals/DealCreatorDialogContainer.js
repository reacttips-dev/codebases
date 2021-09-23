'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import DealCreatorDialog from './DealCreatorDialog';
import { Map as ImmutableMap } from 'immutable';
import { shouldShowDealLineItemsCard as shouldShowDealLineItemsCardAlias } from 'customer-data-objects/permissions/DealPermissions';
import ScopesContainer from '../../../../setup-object-embed/containers/ScopesContainer';
import { isScoped } from '../../../../setup-object-embed/containers/ScopeOperators';
import { LEGACY_DEAL_AMOUNT_CALCULATION } from 'products-ui-components/constants/Scopes';

var _DealCreatorDialog$pr = DealCreatorDialog.propTypes,
    __dealProperties = _DealCreatorDialog$pr.dealProperties,
    __setDealProperties = _DealCreatorDialog$pr.setDealProperties,
    __clearDealProperties = _DealCreatorDialog$pr.clearDealProperties,
    __shouldShowDealLineItemsCard = _DealCreatorDialog$pr.shouldShowDealLineItemsCard,
    __hasBetCustomDealForm = _DealCreatorDialog$pr.hasBetCustomDealForm,
    __hasLegacyDealAmountCalculation = _DealCreatorDialog$pr.hasLegacyDealAmountCalculation,
    propTypes = _objectWithoutProperties(_DealCreatorDialog$pr, ["dealProperties", "setDealProperties", "clearDealProperties", "shouldShowDealLineItemsCard", "hasBetCustomDealForm", "hasLegacyDealAmountCalculation"]);

function DealCreatorDialogContainer(props) {
  var onReject = props.onReject;

  var _useState = useState(function () {
    return ImmutableMap();
  }),
      _useState2 = _slicedToArray(_useState, 2),
      dealProperties = _useState2[0],
      setDealProperties = _useState2[1];

  var clearDealProperties = useCallback(function () {
    setDealProperties(ImmutableMap());
  }, [setDealProperties]);
  var handleReject = useCallback(function () {
    setDealProperties(ImmutableMap());
    onReject.apply(void 0, arguments);
  }, [setDealProperties, onReject]);
  var scopes = ScopesContainer.get();
  var shouldShowDealLineItemsCard = shouldShowDealLineItemsCardAlias(scopes);
  var hasBetCustomDealForm = isScoped(scopes, 'bet-custom-deal-form');
  var hasLegacyDealAmountCalculation = isScoped(scopes, LEGACY_DEAL_AMOUNT_CALCULATION);
  return /*#__PURE__*/_jsx(DealCreatorDialog, Object.assign({}, props, {
    onReject: handleReject,
    shouldShowDealLineItemsCard: shouldShowDealLineItemsCard,
    hasBetCustomDealForm: hasBetCustomDealForm,
    hasLegacyDealAmountCalculation: hasLegacyDealAmountCalculation,
    dealProperties: dealProperties,
    setDealProperties: setDealProperties,
    clearDealProperties: clearDealProperties
  }));
}

DealCreatorDialogContainer.propTypes = propTypes;
export default DealCreatorDialogContainer;