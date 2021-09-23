'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import { useEffect } from 'react';
import UIButton from 'UIComponents/button/UIButton';
import { ContextualPromptConfig, promptTypes } from '../../common/constants/trials';
import { track, trackBeforeUnload } from '../../common/eventTracking/tracker';
import BasePrompt from './BasePrompt';
import PropTypes from 'prop-types';

var getUpgradeData = function getUpgradeData(upgradeProduct, app, promptType) {
  return {
    app: app,
    screen: 'index',
    uniqueId: "trial-" + promptType,
    upgradeProduct: upgradeProduct
  };
};

var ContextualTrialPrompt = function ContextualTrialPrompt(_ref) {
  var app = _ref.app,
      activeTrials = _ref.activeTrials,
      expiredTrials = _ref.expiredTrials,
      isMultiTrial = _ref.isMultiTrial,
      upgradeProduct = _ref.upgradeProduct,
      setShowPrompt = _ref.setShowPrompt;
  var _ContextualPromptConf = ContextualPromptConfig[upgradeProduct][app],
      href = _ContextualPromptConf.href,
      promptType = _ContextualPromptConf.promptType;
  useEffect(function () {
    track('trialActionPromptInteraction', Object.assign({
      action: 'viewed contextual prompt'
    }, getUpgradeData(upgradeProduct, app, promptType), {
      isMultiTrial: isMultiTrial,
      activeTrials: activeTrials,
      expiredTrials: expiredTrials
    }));
  }, [app, upgradeProduct, promptType, isMultiTrial, activeTrials, expiredTrials]);

  var handleClose = function handleClose() {
    track('trialActionPromptInteraction', Object.assign({
      action: 'closed contextual prompt'
    }, getUpgradeData(upgradeProduct, app, promptType), {
      isMultiTrial: isMultiTrial,
      activeTrials: activeTrials,
      expiredTrials: expiredTrials
    }));
    setShowPrompt(false);
  };

  var onCtaClick = function onCtaClick() {
    trackBeforeUnload('trialActionPromptInteraction', Object.assign({
      action: 'clicked contextual prompt'
    }, getUpgradeData(upgradeProduct, app, promptType), {
      isMultiTrial: isMultiTrial,
      activeTrials: activeTrials,
      expiredTrials: expiredTrials
    }));
  };

  return /*#__PURE__*/_jsx(BasePrompt, {
    headerText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "upgrades.trialPrompts.guidance." + upgradeProduct + "." + app + ".title"
    }),
    bodyText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "upgrades.trialPrompts.guidance." + upgradeProduct + "." + app + ".body"
    }),
    cta: /*#__PURE__*/_jsx(UIButton, {
      use: "primary",
      onClick: onCtaClick,
      href: href,
      external: true,
      children: promptType === promptTypes.DEMO_PROMPT ? /*#__PURE__*/_jsx(FormattedMessage, {
        message: "upgrades.trialPrompts.cta.viewDemo"
      }) : /*#__PURE__*/_jsx(FormattedMessage, {
        message: "upgrades.trialPrompts.cta.learnMore"
      })
    }),
    handleClose: handleClose
  });
};

ContextualTrialPrompt.propTypes = {
  app: PropTypes.string,
  activeTrials: PropTypes.array.isRequired,
  expiredTrials: PropTypes.array.isRequired,
  isMultiTrial: PropTypes.bool.isRequired,
  upgradeProduct: PropTypes.string,
  setShowPrompt: PropTypes.bool
};
export default ContextualTrialPrompt;