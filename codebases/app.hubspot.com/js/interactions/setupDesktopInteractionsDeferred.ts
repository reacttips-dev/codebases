import navQuerySelectorAll from 'unified-navigation-ui/utils/navQuerySelectorAll';
import attachHoverTriangleListener from 'unified-navigation-ui/utils/hoverTriangle';
import { setupAccountList } from 'unified-navigation-ui/deferred/accounts';
import renderAlerts from 'unified-navigation-ui/renderAlerts';
import each from 'unified-navigation-ui/utils/each';
import { setupGettingStartedProgress } from 'unified-navigation-ui/utils/onboardingUtils';
import { getPortalId } from 'unified-navigation-ui/js/utils/getPortalId';

function setupSecondaryNav() {
  var secondaryNavExpansionLinks = navQuerySelectorAll('.secondary-nav .expandable > a');
  each(secondaryNavExpansionLinks, function (link) {
    var parentElement = link.parentElement;
    attachHoverTriangleListener(parentElement);
  });
}

export default function setupDesktopInteractionsDeferred(_ref) {
  var isEnrolledInOnboarding = _ref.isEnrolledInOnboarding;
  setupSecondaryNav();
  setupAccountList();
  renderAlerts();

  if (isEnrolledInOnboarding && getPortalId()) {
    setupGettingStartedProgress();
  }
}