import { arrow_right_icon } from '../templates/icons/arrow_right_icon';
import { escape } from '../../js/utils/escape';
import getOrigin from 'unified-navigation-ui/utils/getOrigin';
import { text } from 'unified-navigation-ui/js/utils/NavI18n';
import { navBottomTemplate } from 'unified-navigation-ui/html/jsTemplates/facenav/navBottomTemplate';
import { getPortalId } from 'unified-navigation-ui/js/utils/getPortalId';
import { mon505Template } from 'unified-navigation-ui/html/jsTemplates/facenav/mon505Template';
import { getTrainingAndServicesLink } from 'unified-navigation-ui/utils/getTrainingAndServicesLink';
export function accountMenuTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      maybeAlert = _ref.maybeAlert,
      userPreferences = _ref.userPreferences,
      accountName = _ref.accountName,
      displayOnboardingProgress = _ref.displayOnboardingProgress,
      initialOnboardingProgress = _ref.initialOnboardingProgress,
      isDevPortal = _ref.isDevPortal,
      isUngatedForAccountDeletion = _ref.isUngatedForAccountDeletion,
      isUngatedForMon505 = _ref.isUngatedForMon505,
      hasProjectAccess = _ref.hasProjectAccess;

  return "\n  " + (maybeAlert || '') + "\n  " + (userPreferences || '') + "\n  <div class=\"navAccounts\">\n<a data-tracking=\"hover\" id=\"navAccount-current\" class=\"navAccount-current\"\n  aria-haspopup=\"true\" aria-owns=\"navAccountSwitcher\" aria-controls=\"navAccountSwitcher\">\n    " + (getPortalId() ? "<div class=\"navAccount-accountName\">" + (escape(accountName) || '') + " </div>\n        <div class=\"navAccount-portalId\">" + getPortalId() + "</div>" : escape(text('nav.tools.accounts', {
    defaultValue: 'All Accounts'
  }))) + "\n    </a>\n    <span class=\"navAccount-caret\">" + arrow_right_icon + "\n    </span>\n    <div id=\"navAccountSwitcher\" class=\"navAccountSwitcher expansion\" role=\"group\" aria-labelledby=\"navAccounts\">\n  <div class=\"navAccountSwitcher-all\">\n    <a data-tracking=\"click\" id=\"allAccounts\"\n    href=\"" + getOrigin() + "/myaccounts-beta\">" + escape(text('nav.tools.accounts', {
    defaultValue: 'All Accounts'
  })) + "</a>\n  </div>\n  <div class=\"navAccountSwitcher-list-wrapper\"></div>\n  </div>\n</div>\n" + (displayOnboardingProgress ? "<div class=\"navAccountGettingStartedProgress\">\n<a\n  class=\"navAccount-getting-started-progress-container\"\n  href=\"" + getOrigin() + "/user-guide/" + getPortalId() + "?via=account-menu\"\n  data-tracking=\"click\" id=\"accountNavGettingStarted\">\n  <div class=\"navAccount-getting-started-header\">" + escape(text('nav.gettingStarted.header', {
    defaultValue: 'Set up your HubSpot account'
  })) + "</div>\n  <div class=\"navAccount-getting-started-progress-text\">\n    <span>" + escape(text('nav.gettingStarted.progress', {
    defaultValue: 'Set up your HubSpot account'
  })) + "</span>\n    <span id=\"getting-started-progress-bar--progress-text\">" + escape(initialOnboardingProgress) + "%</span>\n  </div>\n  <div class=\"getting-started-progress-bar\">\n    <span id=\"getting-started-progress-bar--progress-hook\" style=\"width: " + escape(initialOnboardingProgress) + "%\" />\n  </div>\n</a>\n</div>" : '') + "\n  " + (isUngatedForMon505 ? mon505Template() : '') + "\n" + (getPortalId() ? "\n<ul class=\"account-extras\">\n  " + (isDevPortal && isUngatedForAccountDeletion ? "<li id=\"account\">\n      <a data-tracking=\"click\" id=\"accountsAndBilling\"\n        href=\"" + getOrigin() + "/developer/" + getPortalId() + "/account/\">" + escape(text('nav.tools.devAccount', {
    defaultValue: 'Account'
  })) + "\n      </a>\n    </li>" : "<li id=\"accounts-and-billing\">\n      <a data-tracking=\"click\" id=\"accountsAndBilling\"\n        href=\"" + getOrigin() + "/account-dashboard/" + getPortalId() + "/\">" + escape(text('nav.tools.billing', {
    defaultValue: 'Account & Billing'
  })) + "</a>\n    </li>") + "\n  <li id=\"NavAcademyLC004-Control\">\n    <a data-tracking=\"click\" id=\"academy\"\n      href=\"" + getOrigin() + "/academy/" + getPortalId() + "?LC004=Control\">" + escape(text('nav.tools.academy', {
    defaultValue: 'HubSpot Academy'
  })) + "</a>\n  </li>\n  <li id=\"productsAddons\">\n    <a data-tracking=\"click\" id=\"productsAddons\"\n      href=\"" + getOrigin() + "/pricing/" + getPortalId() + "?upgradeSource=nav-dropdown\">" + escape(text('nav.tools.pricingAndFeatures', {
    defaultValue: 'Pricing & Features'
  })) + "</a>\n  </li>\n  <li id=\"productUpdates\">\n    <a data-tracking=\"click\" id=\"productUpdates\"\n      href=\"" + getOrigin() + "/whats-new/" + getPortalId() + "\">" + escape(text('nav.tools.productUpdates', {
    defaultValue: 'Product Updates'
  })) + "</a>\n  </li>\n  " + (hasProjectAccess ? "<li id=\"projects\">\n          <a data-tracking=\"click\" id=\"projects\"\n            href=\"" + getOrigin() + "/projects/" + getPortalId() + "\">" + escape(text('nav.tools.projects', {
    defaultValue: 'Projects'
  })) + "</a>\n        </li>" : '') + "\n  <li id=\"trainingAndServices\">\n    <a data-tracking=\"click\" id=\"trainingAndServices\"\n      href=\"" + getTrainingAndServicesLink() + "\">" + escape(text('nav.tools.trainingAndServices', {
    defaultValue: 'Training & Services'
  })) + "</a>\n  </li>\n</ul>\n" : '') + "\n" + navBottomTemplate() + "\n  ";
}