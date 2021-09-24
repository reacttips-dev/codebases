import enviro from 'enviro';
import PortalIdParser from 'PortalIdParser';
import { stringify } from 'hub-http/helpers/params';
import { buildUrl, parseUrl } from 'hub-http/helpers/url';
import devLogger from 'react-utils/devLogger';
import { SALES_PROFESSIONAL } from '../../constants/UpgradeProducts';
import { ADDON_CUSTOM_SSL } from '../../constants/MerchandiseIds';
import { getFullUrl } from 'hubspot-url-utils';
import { na1 } from 'hubspot-url-utils/hublets';
import { PROD, QA } from 'self-service-api/constants/Environments';
import { ENTERPRISE, PROFESSIONAL, STARTER } from '../../constants/ProductLevels';
var pid = PortalIdParser.get();

var baseUrlOptions = function baseUrlOptions() {
  var baseUrl = getFullUrl('app', {
    envOverride: enviro.isProd() ? PROD : QA
  });

  var _parseUrl = parseUrl(baseUrl),
      protocol = _parseUrl.protocol,
      hostname = _parseUrl.hostname;

  return {
    protocol: protocol,
    hostname: hostname
  };
};

var formHref = getFullUrl('forms', {
  domainOverride: 'hsforms',
  hubletOverride: na1
});

var _createExternalUrl = function _createExternalUrl() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var urlOptions = Object.assign({}, baseUrlOptions(), {
    path: path,
    query: stringify(query)
  });
  return buildUrl(urlOptions);
};

var _createProductsAndAddonsLink = function _createProductsAndAddonsLink() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var params = arguments.length > 1 ? arguments[1] : undefined;

  if (params && !params.upgradeSource) {
    devLogger.warn({
      message: "createProductsAndAddonsLink: Expected upgradeSource for path " + path + " but got " + params.upgradeSource,
      key: "createProductsAndAddonsLink: " + path
    });
  }

  var urlOptions = Object.assign({}, baseUrlOptions(), {
    path: "/browse/" + pid + "/" + path,
    query: stringify(params)
  });
  return buildUrl(urlOptions);
};

var _createPricingPageLink = function _createPricingPageLink() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var params = arguments.length > 1 ? arguments[1] : undefined;

  if (params && !params.upgradeSource) {
    devLogger.warn({
      message: "createPricingPageLink: Expected upgradeSource for path " + path + " but got " + params.upgradeSource,
      key: "createPricingPageLink: " + path
    });
  }

  var urlOptions = Object.assign({}, baseUrlOptions(), {
    path: "/pricing/" + pid + "/" + path,
    query: stringify(params)
  });
  return buildUrl(urlOptions);
};

var redirectRoutes = {
  'landing-pages': "/pages/" + pid + "/manage/landing",
  email: "/email/" + pid + "/manage",
  'marketing-workflows': "/workflows/" + pid,
  'content-strategy': "/content-strategy/" + pid + "/clusters",
  'sales-workflows': "/workflows/" + pid,
  playbooks: "/playbooks/" + pid,
  sequences: "/sequences/" + pid,
  quotes: "/quotes/" + pid,
  tickets: "/contacts/" + pid + "/tickets/list/view/all",
  feedback: "/feedback/" + pid + "/home",
  'knowledge-base': "/knowledge/" + pid + "/insights/dashboard",
  'service-workflows': "/workflows/" + pid,
  meetings: "/meetings/" + pid,
  'user-settings': "/settings/" + pid + "/users?createUserEmail",
  social: "/social/" + pid + "/",
  seo: "/content-strategy/" + pid + "/recommendations",
  forecasting: "/forecasting/" + pid,
  'live-messages-settings': "/live-messages-settings/" + pid,
  'custom-coded-workflow-actions': "/workflows/" + pid,
  'custom-coded-bot-actions': "/chatflows/" + pid,
  webhooks: "/workflows/" + pid,
  'data-quality-automation': "/workflows/" + pid,
  campaigns: "/marketing/" + pid + "/campaigns"
};
var MON569Tabs = {
  STARTER: 'starter',
  ADVANCED: 'advanced'
};
export var mapRedirectTargetToRoute = function mapRedirectTargetToRoute(redirectTarget, upgradeProduct) {
  if (redirectRoutes[redirectTarget]) {
    return redirectRoutes[redirectTarget];
  }

  var hub = upgradeProduct.split('-')[0];
  return upgradeProduct === SALES_PROFESSIONAL ? "/getting-started/" + pid : "/reports-dashboard/" + pid + "/" + hub;
};

var getMon569Tab = function getMon569Tab(productLevel) {
  switch (productLevel) {
    case STARTER:
      return MON569Tabs.STARTER;

    case PROFESSIONAL:
    case ENTERPRISE:
      return MON569Tabs.ADVANCED;

    default:
      return '';
  }
};

export var salesPricing = function salesPricing(upgradeSource, productLevel) {
  var tab = getMon569Tab(productLevel);
  return _createPricingPageLink("sales/" + tab, {
    upgradeSource: upgradeSource
  });
};
export var marketingPricing = function marketingPricing(upgradeSource, productLevel) {
  var tab = getMon569Tab(productLevel);
  return _createPricingPageLink("marketing/" + tab, {
    upgradeSource: upgradeSource
  });
};
export var servicePricing = function servicePricing(upgradeSource, productLevel) {
  var tab = getMon569Tab(productLevel);
  return _createPricingPageLink("service/" + tab, {
    upgradeSource: upgradeSource
  });
};
export var starterContacts = function starterContacts() {
  var urlOptions = Object.assign({}, baseUrlOptions(), {
    path: "/pricing/" + pid + "/confirm-contacts?marketing-starter"
  });
  return buildUrl(urlOptions);
};
export var addonReporting = function addonReporting(upgradeSource) {
  return _createProductsAndAddonsLink('upgrade/reporting', {
    upgradeSource: upgradeSource
  });
};
export var addonAds = function addonAds(upgradeSource) {
  return _createProductsAndAddonsLink('upgrade/ads', {
    upgradeSource: upgradeSource
  });
};
export var addonWebsite = function addonWebsite(upgradeSource) {
  return _createProductsAndAddonsLink('compare/website', {
    upgradeSource: upgradeSource
  });
};
export var cmsPricing = function cmsPricing(upgradeSource, productLevel) {
  var tab = getMon569Tab(productLevel);
  return _createPricingPageLink("cms/" + tab, {
    upgradeSource: upgradeSource
  });
};
export var operationsPricing = function operationsPricing(upgradeSource, productLevel) {
  var tab = getMon569Tab(productLevel);
  return _createPricingPageLink("operations/" + tab, {
    upgradeSource: upgradeSource
  });
};
export var addonCrm = function addonCrm(upgradeSource) {
  return _createPricingPageLink('crm', {
    upgradeSource: upgradeSource
  });
};
export var addonBrandDomain = function addonBrandDomain(upgradeSource) {
  return _createProductsAndAddonsLink('upgrade/brand-domain', {
    upgradeSource: upgradeSource
  });
};
export var addonDedicatedIp = function addonDedicatedIp(upgradeSource) {
  return _createProductsAndAddonsLink('services/dedicated-ip', {
    upgradeSource: upgradeSource
  });
};
export var addonAdditionalPortalLink = function addonAdditionalPortalLink(upgradeSource) {
  return _createProductsAndAddonsLink('services/add-on-portal', {
    upgradeSource: upgradeSource
  });
};
export var addonTransactionalEmail = function addonTransactionalEmail(upgradeSource) {
  return _createProductsAndAddonsLink('services/transactional-email', {
    upgradeSource: upgradeSource
  });
};
export var checkout = function checkout(orderId, upgradeSource) {
  return _createExternalUrl("/checkout/" + pid + "/purchases/" + orderId + (upgradeSource ? "?upgradeSource=" + upgradeSource : ''));
};
export var getPaidUserManagementUrl = function getPaidUserManagementUrl() {
  return _createExternalUrl("/settings/" + pid + "/users/paid-users");
};
export var serviceDesignatedTechnicalSupport = function serviceDesignatedTechnicalSupport(upgradeSource) {
  return "https://www.hubspot.com/services/consulting/technical?source=" + upgradeSource;
};
export var serviceInPersonTraining = function serviceInPersonTraining(upgradeSource) {
  return "https://www.hubspot.com/services/classroom-training?source=" + upgradeSource;
};
export var serviceStarterKit = function serviceStarterKit(upgradeSource) {
  return _createProductsAndAddonsLink('services/starter-kit', {
    upgradeSource: upgradeSource
  });
};
export var salesProfessionalOnboarding = function salesProfessionalOnboarding(upgradeSource) {
  return _createProductsAndAddonsLink('services/sales-professional-onboarding', {
    upgradeSource: upgradeSource
  });
};
export var serviceProfessionalOnboarding = function serviceProfessionalOnboarding(upgradeSource) {
  return _createProductsAndAddonsLink('services/service-professional-onboarding', {
    upgradeSource: upgradeSource
  });
};
export var inboundConsultingBlock = function inboundConsultingBlock(upgradeSource) {
  return _createProductsAndAddonsLink('services/inbound-consulting-block', {
    upgradeSource: upgradeSource
  });
};
export var technicalConsultingBlock = function technicalConsultingBlock(upgradeSource) {
  return _createProductsAndAddonsLink('services/technical-consulting-block', {
    upgradeSource: upgradeSource
  });
};
export var productsAndAddons = function productsAndAddons() {
  return _createPricingPageLink();
}; // This paywall is where you'd go to upgrade to Partner status

export var partnerProgramPaywall = function partnerProgramPaywall() {
  var urlOptions = Object.assign({}, baseUrlOptions(), {
    path: "/upgrade/" + pid + "/partner-program"
  });
  return buildUrl(urlOptions);
};
export var suite = function suite(upgradeSource, productLevel) {
  var tab = getMon569Tab(productLevel);
  return _createPricingPageLink("suite/" + tab, {
    upgradeSource: upgradeSource
  });
};
export var bundle = function bundle(upgradeSource) {
  return _createPricingPageLink('bundle', {
    upgradeSource: upgradeSource
  });
};
export var addonCustomSsl = function addonCustomSsl(upgradeSource) {
  return _createPricingPageLink('bundle', {
    upgradeSource: upgradeSource,
    selectedAddOns: "" + ADDON_CUSTOM_SSL
  });
};
export var getAccountDashboardUrl = function getAccountDashboardUrl() {
  return _createExternalUrl("/account-and-billing/" + PortalIdParser.get());
};
export var formUrl = function formUrl(_ref) {
  var portalId = _ref.portalId,
      formId = _ref.formId;
  return formHref + "/submissions/v3/integration/submit/" + portalId + "/" + formId;
};