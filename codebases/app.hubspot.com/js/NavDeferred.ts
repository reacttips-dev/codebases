import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import setupNavInteractionsDeferred from 'unified-navigation-ui/interactions/setupNavInteractionsDeferred';
import setupDesktopInteractionsDeferred from 'unified-navigation-ui/interactions/setupDesktopInteractionsDeferred';
import setupMobileInteractionsDeferred from 'unified-navigation-ui/interactions/setupMobileInteractionsDeferred';
import { setupAccountMenu } from 'unified-navigation-ui/deferred/accounts';
import { setupOnboardingToursBanner } from 'unified-navigation-ui/deferred/onboarding-tours/onboardingTours';
import { setupTrialBanner } from 'unified-navigation-ui/deferred/trial-banner/setupTrialBanner';
import { setupSandboxBanner } from './deferred/sandbox-banner/setupSandboxBanner';
import { setupDeveloperBanner } from './deferred/developer-banner/setupDeveloperBanner';
import { setupIEDeprecated } from 'unified-navigation-ui/deferred/ieDeprecated/setupIEDeprecated';

var NavDeferred = /*#__PURE__*/function () {
  function NavDeferred() {
    _classCallCheck(this, NavDeferred);
  }

  _createClass(NavDeferred, [{
    key: "start",
    value: function start(_ref) {
      var accountName = _ref.accountName,
          avatarUrl = _ref.avatarUrl,
          gates = _ref.gates,
          isDevPortal = _ref.isDevPortal,
          scopes = _ref.scopes,
          userEmail = _ref.userEmail,
          userId = _ref.userId,
          firstName = _ref.firstName,
          lastName = _ref.lastName,
          attributes = _ref.attributes,
          isEnrolledInOnboarding = _ref.isEnrolledInOnboarding;
      setupAccountMenu({
        accountName: accountName,
        avatarUrl: avatarUrl,
        firstName: firstName,
        lastName: lastName,
        gates: gates,
        userId: userId,
        scopes: scopes,
        userEmail: userEmail,
        attributes: attributes,
        isDevPortal: isDevPortal
      });
      setupNavInteractionsDeferred({
        userId: userId,
        userEmail: userEmail,
        gates: gates,
        scopes: scopes,
        isDevPortal: isDevPortal
      });
      setupDesktopInteractionsDeferred({
        isEnrolledInOnboarding: isEnrolledInOnboarding
      });
      setupMobileInteractionsDeferred();
      setupSandboxBanner();
      setupIEDeprecated();
      setupDeveloperBanner(isDevPortal);
      var shouldSetupOnboardingBanner = setupOnboardingToursBanner();

      if (!shouldSetupOnboardingBanner) {
        setupTrialBanner();
      }
    }
  }]);

  return NavDeferred;
}();

export { NavDeferred as default };