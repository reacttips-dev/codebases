'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import UILink from 'UIComponents/link/UILink';
import KnowledgeBaseButton from 'ui-addon-i18n/components/KnowledgeBaseButton';
import { syncTracker } from './tracker';
import { postMessage } from './utils';
import FeaturesMap from 'self-service-api/constants/FeaturesMap';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { PropTypes } from 'prop-types';

function FeatureLink(_ref) {
  var feature = _ref.feature;
  var href = FeaturesMap[feature].href;

  var featureName = /*#__PURE__*/_jsx(FormattedMessage, {
    message: "pricing-pages.features." + feature + ".name"
  });

  var trackFeatureLinkClick = function trackFeatureLinkClick() {
    syncTracker.track('interaction', {
      action: 'featureLinkClick',
      feature: feature
    });
  };

  var isKnowledgeBaseArticle = href && href.includes('knowledge.hubspot.com');

  if (isKnowledgeBaseArticle) {
    return /*#__PURE__*/_jsx(KnowledgeBaseButton, {
      url: href,
      onClick: trackFeatureLinkClick,
      children: featureName
    });
  }

  if (!href) return null;
  return /*#__PURE__*/_jsx(UILink, {
    external: !href.includes(window.location.hostname),
    onClick: function onClick() {
      trackFeatureLinkClick();
      postMessage('REDIRECT', {
        href: href
      });
    },
    children: featureName
  });
}

FeatureLink.propTypes = {
  feature: PropTypes.oneOf(Object.keys(FeaturesMap)).isRequired
};
export default FeatureLink;