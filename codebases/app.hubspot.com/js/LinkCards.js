'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import UICardGrid from 'UIComponents/card/UICardGrid';
import UICardSection from 'UIComponents/card/UICardSection';
import Small from 'UIComponents/elements/Small';
import UILink from 'UIComponents/link/UILink';
import Big from 'UIComponents/elements/Big';
import styled from 'styled-components';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import { CALYPSO_MEDIUM } from 'HubStyleTokens/colors';
import { app, screen } from './queryParamUtils';
import PortalIdParser from 'PortalIdParser';
import ContactSalesButton from './ContactSalesButton';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { syncTracker, tracker } from './tracker';
import { postMessage } from './utils';
import { trialIdsWithTrialGuide, upgradeProductToTrialIds } from 'self-service-api/constants/Trials';
var LinkCardWrapper = styled(UICardWrapper).withConfig({
  displayName: "LinkCards__LinkCardWrapper",
  componentId: "sc-7ty0hb-0"
})(["border:1px ", " solid;"], CALYPSO_MEDIUM);

function Link(_ref) {
  var children = _ref.children,
      href = _ref.href,
      _ref$action = _ref.action,
      action = _ref$action === void 0 ? 'trialGuideClick' : _ref$action,
      promptKey = _ref.promptKey;
  return /*#__PURE__*/_jsx(UILink, {
    onClick: function onClick() {
      syncTracker.track('interaction', {
        action: action,
        promptKey: promptKey
      });
      postMessage('REDIRECT', {
        href: href
      });
    },
    children: /*#__PURE__*/_jsx(Big, {
      children: children
    })
  });
}

function LinkCard(_ref2) {
  var small = _ref2.small,
      children = _ref2.children;
  return /*#__PURE__*/_jsx(LinkCardWrapper, {
    compact: true,
    children: /*#__PURE__*/_jsxs(UICardSection, {
      style: {
        textAlign: 'center'
      },
      children: [/*#__PURE__*/_jsx("div", {
        className: "m-bottom-1",
        children: /*#__PURE__*/_jsx(Small, {
          use: 'help',
          children: small
        })
      }), children]
    })
  });
}

function LinkCards(_ref3) {
  var guideLink = _ref3.guideLink,
      guideSmallText = _ref3.guideSmallText,
      preferredTrialUpgradeProduct = _ref3.preferredTrialUpgradeProduct,
      _ref3$showFeatureGuid = _ref3.showFeatureGuide,
      showFeatureGuide = _ref3$showFeatureGuid === void 0 ? true : _ref3$showFeatureGuid;
  var isTrialWithTrialGuide = trialIdsWithTrialGuide.includes(upgradeProductToTrialIds[preferredTrialUpgradeProduct]);
  return /*#__PURE__*/_jsxs(UICardGrid, {
    columns: 1,
    children: [isTrialWithTrialGuide && /*#__PURE__*/_jsx(LinkCard, {
      small: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "trial-banner-ui.contextualFlydown.continueExploring"
      }),
      children: /*#__PURE__*/_jsx(Link, {
        href: "/trial-guide/" + PortalIdParser.get() + "/" + preferredTrialUpgradeProduct + "?source=trial-banner-flydown",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "trial-banner-ui.contextualFlydown.returnToTrialGuide"
        })
      })
    }), /*#__PURE__*/_jsx(LinkCard, {
      small: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "trial-banner-ui.contextualFlydown.speakWithAnExpert"
      }),
      children: /*#__PURE__*/_jsx(Big, {
        children: /*#__PURE__*/_jsx(ContactSalesButton, {
          use: "link",
          upgradeData: {
            app: app,
            screen: screen,
            uniqueId: 'objective-flydown',
            upgradeProduct: preferredTrialUpgradeProduct
          },
          "data-test-id": "flydown-contact-sales-button"
        })
      })
    }), showFeatureGuide && /*#__PURE__*/_jsx(LinkCard, {
      small: guideSmallText,
      children: /*#__PURE__*/_jsx(UILink, {
        href: guideLink,
        external: true,
        onClick: function onClick() {
          tracker.track('interaction', {
            action: 'guideClick'
          });
        },
        children: /*#__PURE__*/_jsx(Big, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "trial-banner-ui.contextualFlydown.readOurGuide"
          })
        })
      })
    })]
  });
}

export default LinkCards;