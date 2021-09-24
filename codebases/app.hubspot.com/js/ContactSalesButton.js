'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import { getTrialFromTrialState } from './queryParamUtils';
import UIContactSalesButton from 'ui-addon-upgrades/button/UIContactSalesButton';
import { TALK_TO_SALES } from 'ui-addon-upgrades/_core/purchaseMotions/PurchaseMotionTypes';
import { postMessage } from './utils';

function ContactSalesButton(_ref) {
  var upgradeData = _ref.upgradeData,
      rest = _objectWithoutProperties(_ref, ["upgradeData"]);

  var handleClick = useCallback(function () {
    postMessage('MODAL_OPEN');
  }, []); // Use timeout for close animation

  var handleClose = useCallback(function () {
    setTimeout(function () {
      postMessage('MODAL_CLOSE');
    }, 400);
  }, []);
  var preferredTrialUpgradeProduct = upgradeData.upgradeProduct;
  var preferredTrial = getTrialFromTrialState(preferredTrialUpgradeProduct);
  var purchaseMotion = preferredTrial && preferredTrial.purchaseMotion;
  return /*#__PURE__*/_jsx(UIContactSalesButton, Object.assign({
    className: "m-x-2",
    "data-test-id": "contact-sales-button",
    isAssignable: purchaseMotion === TALK_TO_SALES,
    onCancel: handleClose,
    onClick: handleClick,
    size: "extra-small",
    upgradeData: upgradeData
  }, rest));
}

ContactSalesButton.defaultProps = {
  use: 'primary-white'
};
export default ContactSalesButton;