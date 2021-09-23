'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import partial from 'transmute/partial';
import { Map as ImmutableMap } from 'immutable';
import { SEND_LIMIT_EXCEEDED } from 'sales-modal/constants/SendTimesNotAvailableReasons';
import { hasMaxSequencesSendLimit as hasMaxSequencesSendLimitSelector } from 'sales-modal/redux/selectors/permissionSelectors';
import UIButton from 'UIComponents/button/UIButton';
import UICardHeader from 'UIComponents/card/UICardHeader';
import UICardSection from 'UIComponents/card/UICardSection';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import UIList from 'UIComponents/list/UIList';
import UIIcon from 'UIComponents/icon/UIIcon';
import { CANDY_APPLE } from 'HubStyleTokens/colors';
import UIPricingPageRedirectButton from 'ui-addon-upgrades/button/UIPricingPageRedirectButton';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
var upgradeData = {
  app: 'client',
  screen: 'modal',
  upgradeProduct: 'sales-enterprise',
  uniqueId: 'reached-send-limit'
};

var SendTimeError = function SendTimeError(_ref) {
  var stepsWithSendTimeErrors = _ref.stepsWithSendTimeErrors,
      onStepLinkClick = _ref.onStepLinkClick,
      hasMaxSequencesSendLimit = _ref.hasMaxSequencesSendLimit;

  if (!stepsWithSendTimeErrors.size) {
    return null;
  }

  var sendLimitErrorsExist = stepsWithSendTimeErrors.some(function (errorType) {
    return errorType === SEND_LIMIT_EXCEEDED;
  });

  var getTitleText = function getTitleText() {
    if (hasMaxSequencesSendLimit || !sendLimitErrorsExist) {
      return /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sendLimitErrorComponent.title",
        options: {
          count: stepsWithSendTimeErrors.size
        }
      });
    } else {
      var upgradeComponentProps = {
        upgradeData: upgradeData,
        use: 'link',
        external: true
      };
      return /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: "sendLimitErrorComponent.titleWithPQL_jsx",
        options: Object.assign({
          count: stepsWithSendTimeErrors.size
        }, upgradeComponentProps),
        elements: {
          UpgradeLink: UIPricingPageRedirectButton
        }
      });
    }
  };

  return /*#__PURE__*/_jsxs(UICardWrapper, {
    compact: true,
    style: {
      maxWidth: 960
    },
    children: [/*#__PURE__*/_jsx(UICardHeader, {
      title: /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx(UIIcon, {
          className: "p-right-2",
          color: CANDY_APPLE,
          name: "warning"
        }), getTitleText()]
      })
    }), /*#__PURE__*/_jsx(UICardSection, {
      children: /*#__PURE__*/_jsx(UIList, {
        inline: true,
        use: "inline-divided",
        children: stepsWithSendTimeErrors.keySeq().toList().map(function (stepIndex) {
          return /*#__PURE__*/_jsx(UIButton, {
            use: "link",
            onClick: partial(onStepLinkClick, stepIndex),
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sendLimitErrorComponent.emailName",
              options: {
                stepNumber: stepIndex + 1
              }
            })
          }, stepIndex);
        })
      })
    })]
  });
};

SendTimeError.propTypes = {
  stepsWithSendTimeErrors: PropTypes.instanceOf(ImmutableMap).isRequired,
  onStepLinkClick: PropTypes.func.isRequired,
  hasMaxSequencesSendLimit: PropTypes.bool.isRequired
};
export default connect(function (state) {
  return {
    hasMaxSequencesSendLimit: hasMaxSequencesSendLimitSelector(state)
  };
})(SendTimeError);