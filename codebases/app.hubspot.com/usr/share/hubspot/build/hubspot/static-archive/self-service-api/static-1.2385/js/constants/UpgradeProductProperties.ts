import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _UpgradeProductProper;

import * as UpgradeProducts from './UpgradeProducts';
import * as links from '../core/utilities/links';
import * as MerchandiseIds from './MerchandiseIds';
var SALES_PRO = UpgradeProducts.SALES_PRO,
    SALES_FREE = UpgradeProducts.SALES_FREE,
    SALES_STARTER = UpgradeProducts.SALES_STARTER,
    SALES_PROFESSIONAL = UpgradeProducts.SALES_PROFESSIONAL,
    SALES_ENTERPRISE = UpgradeProducts.SALES_ENTERPRISE,
    SALES_STARTER_USER = UpgradeProducts.SALES_STARTER_USER,
    SALES_PROFESSIONAL_USER = UpgradeProducts.SALES_PROFESSIONAL_USER,
    SALES_ENTERPRISE_USER = UpgradeProducts.SALES_ENTERPRISE_USER,
    MARKETING_FREE = UpgradeProducts.MARKETING_FREE,
    MARKETING_STARTER = UpgradeProducts.MARKETING_STARTER,
    MARKETING_STARTER_EMAIL = UpgradeProducts.MARKETING_STARTER_EMAIL,
    MARKETING_BASIC = UpgradeProducts.MARKETING_BASIC,
    MARKETING_PRO = UpgradeProducts.MARKETING_PRO,
    MARKETING_ENTERPRISE = UpgradeProducts.MARKETING_ENTERPRISE,
    SERVICE_FREE = UpgradeProducts.SERVICE_FREE,
    SERVICE_STARTER = UpgradeProducts.SERVICE_STARTER,
    SERVICE_PROFESSIONAL = UpgradeProducts.SERVICE_PROFESSIONAL,
    SERVICE_ENTERPRISE = UpgradeProducts.SERVICE_ENTERPRISE,
    SERVICE_STARTER_USER = UpgradeProducts.SERVICE_STARTER_USER,
    SERVICE_PROFESSIONAL_USER = UpgradeProducts.SERVICE_PROFESSIONAL_USER,
    SERVICE_ENTERPRISE_USER = UpgradeProducts.SERVICE_ENTERPRISE_USER,
    STARTER_CONTACTS = UpgradeProducts.STARTER_CONTACTS,
    BASIC_CONTACTS = UpgradeProducts.BASIC_CONTACTS,
    MARKETING_STARTER_CONTACTS = UpgradeProducts.MARKETING_STARTER_CONTACTS,
    MARKETING_PROFESSIONAL_CONTACTS = UpgradeProducts.MARKETING_PROFESSIONAL_CONTACTS,
    MARKETING_ENTERPRISE_CONTACTS = UpgradeProducts.MARKETING_ENTERPRISE_CONTACTS,
    ADS = UpgradeProducts.ADS,
    ADS_CAPACITY = UpgradeProducts.ADS_CAPACITY,
    WEBSITE = UpgradeProducts.WEBSITE,
    REPORTING = UpgradeProducts.REPORTING,
    DEDICATED_IP = UpgradeProducts.DEDICATED_IP,
    TRANSACTIONAL_EMAIL = UpgradeProducts.TRANSACTIONAL_EMAIL,
    ADDITIONAL_ACCOUNT = UpgradeProducts.ADDITIONAL_ACCOUNT,
    BRAND_DOMAIN = UpgradeProducts.BRAND_DOMAIN,
    WORKFLOWS_ADDON = UpgradeProducts.WORKFLOWS_ADDON,
    LISTS_ADDON = UpgradeProducts.LISTS_ADDON,
    ESIGNATURES_LIMIT_INCREASE = UpgradeProducts.ESIGNATURES_LIMIT_INCREASE,
    DESIGNATED_TECHNICAL_SUPPORT = UpgradeProducts.DESIGNATED_TECHNICAL_SUPPORT,
    IN_PERSON_TRAINING = UpgradeProducts.IN_PERSON_TRAINING,
    STARTER_KIT = UpgradeProducts.STARTER_KIT,
    SALES_PROFESSIONAL_ONBOARDING = UpgradeProducts.SALES_PROFESSIONAL_ONBOARDING,
    SERVICE_PROFESSIONAL_ONBOARDING = UpgradeProducts.SERVICE_PROFESSIONAL_ONBOARDING,
    INBOUND_CONSULTING_BLOCK = UpgradeProducts.INBOUND_CONSULTING_BLOCK,
    TECHNICAL_CONSULTING_BLOCK = UpgradeProducts.TECHNICAL_CONSULTING_BLOCK,
    GENERAL = UpgradeProducts.GENERAL,
    CRM = UpgradeProducts.CRM,
    CMS_STARTER = UpgradeProducts.CMS_STARTER,
    CMS_PROFESSIONAL = UpgradeProducts.CMS_PROFESSIONAL,
    CMS_ENTERPRISE = UpgradeProducts.CMS_ENTERPRISE,
    OPERATIONS_STARTER = UpgradeProducts.OPERATIONS_STARTER,
    OPERATIONS_PROFESSIONAL = UpgradeProducts.OPERATIONS_PROFESSIONAL,
    ENTERPRISE = UpgradeProducts.ENTERPRISE,
    PARTNER_PROGRAM = UpgradeProducts.PARTNER_PROGRAM,
    SUITE_STARTER = UpgradeProducts.SUITE_STARTER,
    SUITE_PROFESSIONAL = UpgradeProducts.SUITE_PROFESSIONAL,
    SUITE_ENTERPRISE = UpgradeProducts.SUITE_ENTERPRISE,
    BUNDLE = UpgradeProducts.BUNDLE,
    MARKETING = UpgradeProducts.MARKETING,
    SALES = UpgradeProducts.SALES,
    SERVICE = UpgradeProducts.SERVICE,
    CUSTOM_SSL = UpgradeProducts.CUSTOM_SSL;
/**
 * @deprecated merchandiseId will be removed as part of product abstraction
 * @todo rename UpgradeProductLinks once merchandiseIds are removed
 */

var UpgradeProductProperties = (_UpgradeProductProper = {}, _defineProperty(_UpgradeProductProper, GENERAL, {
  upgradeLink: links.productsAndAddons,
  merchandiseId: null
}), _defineProperty(_UpgradeProductProper, SALES_PRO, {
  upgradeLink: links.salesPricing,
  merchandiseId: MerchandiseIds.PRODUCT_SALES_PRO_LEGACY
}), _defineProperty(_UpgradeProductProper, SALES_FREE, {
  upgradeLink: links.salesPricing,
  merchandiseId: MerchandiseIds.PRODUCT_SALES_FREE
}), _defineProperty(_UpgradeProductProper, SALES_STARTER, {
  upgradeLink: links.salesPricing,
  merchandiseId: MerchandiseIds.PRODUCT_SALES_STARTER_MAR_2020
}), _defineProperty(_UpgradeProductProper, SALES_PROFESSIONAL, {
  upgradeLink: links.salesPricing,
  merchandiseId: MerchandiseIds.PRODUCT_SALES_PROFESSIONAL_NOV_2019
}), _defineProperty(_UpgradeProductProper, SALES_ENTERPRISE, {
  upgradeLink: links.salesPricing,
  merchandiseId: MerchandiseIds.PRODUCT_SALES_ENTERPRISE
}), _defineProperty(_UpgradeProductProper, SALES_STARTER_USER, {
  upgradeLink: links.salesPricing,
  merchandiseId: MerchandiseIds.PRODUCT_SALES_STARTER_ADDL_USER_MAR_2020
}), _defineProperty(_UpgradeProductProper, SALES_PROFESSIONAL_USER, {
  upgradeLink: links.salesPricing,
  merchandiseId: MerchandiseIds.PRODUCT_SALES_PROFESSIONAL_ADDITIONAL_USER_NOV_2019
}), _defineProperty(_UpgradeProductProper, SALES_ENTERPRISE_USER, {
  upgradeLink: links.salesPricing,
  merchandiseId: MerchandiseIds.PRODUCT_SALES_ENTERPRISE_ADDITIONAL_USER
}), _defineProperty(_UpgradeProductProper, MARKETING_FREE, {
  upgradeLink: links.marketingPricing,
  merchandiseId: MerchandiseIds.PRODUCT_MARKETING_FREE
}), _defineProperty(_UpgradeProductProper, MARKETING_STARTER, {
  upgradeLink: links.marketingPricing,
  merchandiseId: MerchandiseIds.PRODUCT_MARKETING_STARTER_MC
}), _defineProperty(_UpgradeProductProper, MARKETING_STARTER_EMAIL, {
  upgradeLink: links.marketingPricing,
  merchandiseId: MerchandiseIds.PRODUCT_MARKETING_STARTER_MC
}), _defineProperty(_UpgradeProductProper, MARKETING_BASIC, {
  upgradeLink: links.marketingPricing,
  merchandiseId: MerchandiseIds.PRODUCT_MARKETING_BASIC
}), _defineProperty(_UpgradeProductProper, MARKETING_PRO, {
  upgradeLink: links.marketingPricing,
  merchandiseId: MerchandiseIds.PRODUCT_MARKETING_PROFESSIONAL_MC
}), _defineProperty(_UpgradeProductProper, MARKETING_ENTERPRISE, {
  upgradeLink: links.marketingPricing,
  merchandiseId: MerchandiseIds.PRODUCT_MARKETING_ENTERPRISE_MC
}), _defineProperty(_UpgradeProductProper, SERVICE_FREE, {
  upgradeLink: links.servicePricing,
  merchandiseId: MerchandiseIds.PRODUCT_SERVICE_FREE
}), _defineProperty(_UpgradeProductProper, SERVICE_STARTER, {
  upgradeLink: links.servicePricing,
  merchandiseId: MerchandiseIds.PRODUCT_SERVICE_STARTER_MAR_2020
}), _defineProperty(_UpgradeProductProper, SERVICE_PROFESSIONAL, {
  upgradeLink: links.servicePricing,
  merchandiseId: MerchandiseIds.PRODUCT_SERVICE_PROFESSIONAL
}), _defineProperty(_UpgradeProductProper, SERVICE_ENTERPRISE, {
  upgradeLink: links.servicePricing,
  merchandiseId: MerchandiseIds.PRODUCT_SERVICE_ENTERPRISE
}), _defineProperty(_UpgradeProductProper, SERVICE_STARTER_USER, {
  upgradeLink: links.servicePricing,
  merchandiseId: MerchandiseIds.PRODUCT_SERVICE_STARTER_ADDL_USER_MAR_2020
}), _defineProperty(_UpgradeProductProper, SERVICE_PROFESSIONAL_USER, {
  upgradeLink: links.servicePricing,
  merchandiseId: MerchandiseIds.PRODUCT_SERVICE_PROFESSIONAL_ADDITIONAL_USER
}), _defineProperty(_UpgradeProductProper, SERVICE_ENTERPRISE_USER, {
  upgradeLink: links.servicePricing,
  merchandiseId: MerchandiseIds.PRODUCT_SERVICE_ENTERPRISE_ADDITIONAL_USER
}), _defineProperty(_UpgradeProductProper, BASIC_CONTACTS, {
  upgradeLink: links.marketingPricing,
  merchandiseId: MerchandiseIds.PRODUCT_MARKETING_BASIC_CONTACTS
}), _defineProperty(_UpgradeProductProper, STARTER_CONTACTS, {
  upgradeLink: links.starterContacts,
  merchandiseId: MerchandiseIds.PRODUCT_MARKETING_STARTER_CONTACTS
}), _defineProperty(_UpgradeProductProper, MARKETING_STARTER_CONTACTS, {
  upgradeLink: links.marketingPricing,
  merchandiseId: MerchandiseIds.PRODUCT_MARKETING_STARTER_CONTACTS_MC
}), _defineProperty(_UpgradeProductProper, MARKETING_PROFESSIONAL_CONTACTS, {
  upgradeLink: links.marketingPricing,
  merchandiseId: MerchandiseIds.PRODUCT_MARKETING_PROFESSIONAL_CONTACTS_MC
}), _defineProperty(_UpgradeProductProper, MARKETING_ENTERPRISE_CONTACTS, {
  upgradeLink: links.marketingPricing,
  merchandiseId: MerchandiseIds.PRODUCT_MARKETING_ENTERPRISE_CONTACTS_MC
}), _defineProperty(_UpgradeProductProper, CMS_STARTER, {
  upgradeLink: links.cmsPricing,
  merchandiseId: MerchandiseIds.PRODUCT_CMS_STARTER
}), _defineProperty(_UpgradeProductProper, CMS_PROFESSIONAL, {
  upgradeLink: links.cmsPricing,
  merchandiseId: MerchandiseIds.PRODUCT_CMS_PROFESSIONAL
}), _defineProperty(_UpgradeProductProper, CMS_ENTERPRISE, {
  upgradeLink: links.cmsPricing,
  merchandiseId: MerchandiseIds.PRODUCT_CMS_ENTERPRISE
}), _defineProperty(_UpgradeProductProper, OPERATIONS_STARTER, {
  upgradeLink: links.operationsPricing,
  merchandiseId: MerchandiseIds.PRODUCT_OPERATIONS_STARTER
}), _defineProperty(_UpgradeProductProper, OPERATIONS_PROFESSIONAL, {
  upgradeLink: links.operationsPricing,
  merchandiseId: MerchandiseIds.PRODUCT_OPERATIONS_PROFESSIONAL
}), _defineProperty(_UpgradeProductProper, ADS, {
  upgradeLink: links.addonAds,
  merchandiseId: MerchandiseIds.ADDON_ADS
}), _defineProperty(_UpgradeProductProper, ADS_CAPACITY, {
  upgradeLink: links.addonAds,
  merchandiseId: MerchandiseIds.ADDON_ADS_CAPACITY
}), _defineProperty(_UpgradeProductProper, WEBSITE, {
  upgradeLink: links.addonWebsite,
  merchandiseId: MerchandiseIds.ADDON_WEBSITE_STARTER
}), _defineProperty(_UpgradeProductProper, REPORTING, {
  upgradeLink: links.addonReporting,
  merchandiseId: MerchandiseIds.LIMIT_INCREASE_REPORTING
}), _defineProperty(_UpgradeProductProper, DEDICATED_IP, {
  upgradeLink: links.addonDedicatedIp,
  merchandiseId: MerchandiseIds.ADDON_DEDICATED_IP
}), _defineProperty(_UpgradeProductProper, TRANSACTIONAL_EMAIL, {
  upgradeLink: links.addonTransactionalEmail,
  merchandiseId: MerchandiseIds.ADDON_TRANSACTIONAL_EMAIL
}), _defineProperty(_UpgradeProductProper, ADDITIONAL_ACCOUNT, {
  upgradeLink: links.addonAdditionalPortalLink,
  merchandiseId: null
}), _defineProperty(_UpgradeProductProper, BRAND_DOMAIN, {
  upgradeLink: links.addonBrandDomain,
  merchandiseId: MerchandiseIds.ADDON_BRAND_DOMAIN
}), _defineProperty(_UpgradeProductProper, WORKFLOWS_ADDON, {
  upgradeLink: links.marketingPricing,
  merchandiseId: MerchandiseIds.ADDON_WORKFLOWS
}), _defineProperty(_UpgradeProductProper, LISTS_ADDON, {
  upgradeLink: links.marketingPricing,
  merchandiseId: MerchandiseIds.ADDON_LISTS
}), _defineProperty(_UpgradeProductProper, ESIGNATURES_LIMIT_INCREASE, {
  upgradeLink: links.salesPricing,
  merchandiseId: MerchandiseIds.LIMIT_INCREASE_ESIGNATURES
}), _defineProperty(_UpgradeProductProper, CUSTOM_SSL, {
  upgradeLink: links.addonCustomSsl,
  merchandiseId: MerchandiseIds.ADDON_CUSTOM_SSL
}), _defineProperty(_UpgradeProductProper, DESIGNATED_TECHNICAL_SUPPORT, {
  upgradeLink: links.serviceDesignatedTechnicalSupport,
  merchandiseId: MerchandiseIds.SERVICE_DESIGNATED_TECHNICAL_SUPPORT
}), _defineProperty(_UpgradeProductProper, IN_PERSON_TRAINING, {
  upgradeLink: links.serviceInPersonTraining,
  merchandiseId: MerchandiseIds.SERVICE_INBOUND_CONSULTING_ONE_DAY
}), _defineProperty(_UpgradeProductProper, STARTER_KIT, {
  upgradeLink: links.serviceStarterKit,
  merchandiseId: MerchandiseIds.SERVICE_CRM_SALES_STARTER_KIT
}), _defineProperty(_UpgradeProductProper, SALES_PROFESSIONAL_ONBOARDING, {
  upgradeLink: links.salesProfessionalOnboarding,
  merchandiseId: MerchandiseIds.SERVICE_SALES_PROFESSIONAL_ONBOARDING
}), _defineProperty(_UpgradeProductProper, SERVICE_PROFESSIONAL_ONBOARDING, {
  upgradeLink: links.serviceProfessionalOnboarding,
  merchandiseId: MerchandiseIds.SERVICE_SERVICE_PROFESSIONAL_ONBOARDING
}), _defineProperty(_UpgradeProductProper, INBOUND_CONSULTING_BLOCK, {
  upgradeLink: links.inboundConsultingBlock,
  merchandiseId: MerchandiseIds.SERVICE_INBOUND_CONSULTING_FOUR_HOUR
}), _defineProperty(_UpgradeProductProper, TECHNICAL_CONSULTING_BLOCK, {
  upgradeLink: links.technicalConsultingBlock,
  merchandiseId: MerchandiseIds.SERVICE_TECH_CONSULTING_FOUR_HOURS
}), _defineProperty(_UpgradeProductProper, ENTERPRISE, {
  upgradeLink: links.marketingPricing,
  merchandiseId: null
}), _defineProperty(_UpgradeProductProper, CRM, {
  upgradeLink: links.addonCrm,
  merchandiseId: MerchandiseIds.PRODUCT_CRM
}), _defineProperty(_UpgradeProductProper, PARTNER_PROGRAM, {
  upgradeLink: links.partnerProgramPaywall,
  merchandiseId: null
}), _defineProperty(_UpgradeProductProper, SUITE_STARTER, {
  upgradeLink: links.suite,
  merchandiseId: null
}), _defineProperty(_UpgradeProductProper, SUITE_PROFESSIONAL, {
  upgradeLink: links.suite,
  merchandiseId: null
}), _defineProperty(_UpgradeProductProper, SUITE_ENTERPRISE, {
  upgradeLink: links.suite,
  merchandiseId: null
}), _defineProperty(_UpgradeProductProper, BUNDLE, {
  upgradeLink: links.bundle,
  merchandiseId: null
}), _defineProperty(_UpgradeProductProper, MARKETING, {
  upgradeLink: links.marketingPricing,
  merchandiseId: null
}), _defineProperty(_UpgradeProductProper, SALES, {
  upgradeLink: links.salesPricing,
  merchandiseId: null
}), _defineProperty(_UpgradeProductProper, SERVICE, {
  upgradeLink: links.servicePricing,
  merchandiseId: null
}), _UpgradeProductProper);
export default UpgradeProductProperties;