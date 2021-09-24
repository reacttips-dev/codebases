import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _FeaturesMap;

import * as Features from './Features';
import PortalIdParser from 'PortalIdParser';
import { getFullUrl } from 'hubspot-url-utils';
var appUrlBase = getFullUrl('app', {});
var knowledgeUrlBase = 'https://knowledge.hubspot.com';
var hubspotUrlBase = 'https://www.hubspot.com';
var portalId = PortalIdParser.get();
/*
the hrefNotAvailable property indicates that there is purposefully no given link for the feature
see: https://git.hubteam.com/HubSpot/trial-banner-ui/blob/master/static/js/FeatureLink.js#L14
*/

var FeaturesMap = (_FeaturesMap = {}, _defineProperty(_FeaturesMap, Features.AD_RETARGETING, {}), _defineProperty(_FeaturesMap, Features.LIVE_CHAT, {
  href: appUrlBase + "/chatflows/" + portalId
}), _defineProperty(_FeaturesMap, Features.CONVERSATIONAL_BOTS, {
  href: appUrlBase + "/chatflows/" + portalId
}), _defineProperty(_FeaturesMap, Features.TEAM_EMAIL, {}), _defineProperty(_FeaturesMap, Features.CONVERSATIONS_INBOX, {}), _defineProperty(_FeaturesMap, Features.FORMS, {}), _defineProperty(_FeaturesMap, Features.AD_MANAGEMENT, {}), _defineProperty(_FeaturesMap, Features.GOOGLE_SEARCH_CONSOLE_INTEGRATION, {}), _defineProperty(_FeaturesMap, Features.REPORTING_DASHBOARDS, {
  hrefNotAvailable: true
}), _defineProperty(_FeaturesMap, Features.TEAMS, {
  href: knowledgeUrlBase + "/account/how-can-i-create-a-team-in-hubspot"
}), _defineProperty(_FeaturesMap, Features.MOBILE_OPTIMIZATION, {}), _defineProperty(_FeaturesMap, Features.PHONE_SUPPORT, {
  hrefNotAvailable: true
}), _defineProperty(_FeaturesMap, Features.STANDARD_CONTACT_SCORING, {
  hrefNotAvailable: true
}), _defineProperty(_FeaturesMap, Features.ONE_TO_ONE_EMAIL, {}), _defineProperty(_FeaturesMap, Features.ALL_CRM_FEATURES, {}), _defineProperty(_FeaturesMap, Features.CALLING_SDK, {}), _defineProperty(_FeaturesMap, Features.STRIPE_INTEGRATION, {}), _defineProperty(_FeaturesMap, Features.EMAIL_MARKETING, {}), _defineProperty(_FeaturesMap, Features.LIST_SEGMENTATION, {}), _defineProperty(_FeaturesMap, Features.CONTENT_CREATION_TOOLS, {
  href: appUrlBase + "/blog/" + portalId
}), _defineProperty(_FeaturesMap, Features.SEO_CONTENT_STRATEGY, {
  href: appUrlBase + "/content-strategy/" + portalId
}), _defineProperty(_FeaturesMap, Features.SOCIAL_MEDIA, {
  href: appUrlBase + "/social/" + portalId
}), _defineProperty(_FeaturesMap, Features.CALLS_TO_ACTION, {
  href: appUrlBase + "/ctas/" + portalId
}), _defineProperty(_FeaturesMap, Features.LANDING_PAGES, {
  href: appUrlBase + "/pages/" + portalId
}), _defineProperty(_FeaturesMap, Features.SSL_CERTIFICATE, {
  href: hubspotUrlBase + "/products/cms/website-monitoring"
}), _defineProperty(_FeaturesMap, Features.SUBDOMAIN_AVAILABILITY, {}), _defineProperty(_FeaturesMap, Features.OMNI_CHANNEL_MARKETING_AUTOMATION, {
  href: appUrlBase + "/workflows/" + portalId
}), _defineProperty(_FeaturesMap, Features.SALESFORCE_INTEGRATION, {
  href: knowledgeUrlBase + "/articles/kcs_article/salesforce/install-the-hubspot-salesforce-integration"
}), _defineProperty(_FeaturesMap, Features.SALESFORCE_CUSTOM_OBJECT_SYNC, {
  href: knowledgeUrlBase + "/salesforce/set-up-and-use-salesforce-custom-object-sync"
}), _defineProperty(_FeaturesMap, Features.WEBSITE_TRAFFIC_ANALYTICS, {
  href: appUrlBase + "/analytics/" + portalId
}), _defineProperty(_FeaturesMap, Features.CAMPAIGN_REPORTING, {
  href: appUrlBase + "/analytics/" + portalId
}), _defineProperty(_FeaturesMap, Features.ATTRIBUTION_REPORTING, {
  href: appUrlBase + "/analytics/" + portalId
}), _defineProperty(_FeaturesMap, Features.AB_TESTING, {
  href: knowledgeUrlBase + "/articles/kcs_article/email/run-an-a/b-test-on-your-marketing-email"
}), _defineProperty(_FeaturesMap, Features.CUSTOM_REPORTS, {
  href: appUrlBase + "/reports-list/" + portalId
}), _defineProperty(_FeaturesMap, Features.PREDICTIVE_LEAD_SCORING, {
  href: knowledgeUrlBase + "/articles/kcs_article/contacts/determine-likelihood-to-close-with-predictive-lead-scoring"
}), _defineProperty(_FeaturesMap, Features.SINGLE_SIGN_ON, {
  href: appUrlBase + "/settings/" + portalId + "/account-defaults/general"
}), _defineProperty(_FeaturesMap, Features.PARTITIONING, {
  href: appUrlBase + "/pages/" + portalId
}), _defineProperty(_FeaturesMap, Features.FACEBOOK_MESSENGER, {}), _defineProperty(_FeaturesMap, Features.YOUTUBE_INTEGRATION, {}), _defineProperty(_FeaturesMap, Features.FILTERED_ANALYTICS_VIEW, {
  href: appUrlBase + "/analytics/" + portalId
}), _defineProperty(_FeaturesMap, Features.EMAIL_SEND_FREQUENCY_CAP, {
  href: appUrlBase + "/settings/" + portalId + "/marketing/email/frequency"
}), _defineProperty(_FeaturesMap, Features.EMAIL_TRACKING_NOTIFICATIONS, {
  freeUser: 'limitedAccess'
}), _defineProperty(_FeaturesMap, Features.EMAIL_SCHEDULING, {}), _defineProperty(_FeaturesMap, Features.SNIPPETS, {
  freeUser: 'limitedAccess'
}), _defineProperty(_FeaturesMap, Features.CALLING, {
  freeUser: 'limitedAccess',
  hideFromLang: ['ja']
}), _defineProperty(_FeaturesMap, Features.SEQUENCES, {
  href: appUrlBase + "/sequences/" + portalId,
  freeUser: 'noAccess'
}), _defineProperty(_FeaturesMap, Features.MEETINGS, {
  href: appUrlBase + "/meetings/" + portalId,
  freeUser: 'limitedAccess'
}), _defineProperty(_FeaturesMap, Features.REP_PRODUCTIVITY_PERFORMANCE, {
  href: appUrlBase + "/analytics/" + portalId + "/sales-productivity/deals"
}), _defineProperty(_FeaturesMap, Features.REP_PRODUCTIVITY_REPORTS, {}), _defineProperty(_FeaturesMap, Features.EMAIL_SUPPORT, {}), _defineProperty(_FeaturesMap, Features.DEAL_PIPELINE, {}), _defineProperty(_FeaturesMap, Features.PRODUCTS, {
  href: appUrlBase + "/settings/" + portalId + "/sales/products",
  freeUser: 'noAccess'
}), _defineProperty(_FeaturesMap, Features.DEAL_STAGE_TASK_LEAD_ROTATION_AUTOMATION, {
  href: appUrlBase + "/workflows/" + portalId,
  freeUser: 'noAccess'
}), _defineProperty(_FeaturesMap, Features.REQUIRED_FIELDS, {
  href: knowledgeUrlBase + "/crm-setup/set-up-fields-seen-when-manually-creating-records"
}), _defineProperty(_FeaturesMap, Features.QUOTES, {
  href: appUrlBase + "/quotes/" + portalId
}), _defineProperty(_FeaturesMap, Features.SMART_SEND_TIMES, {
  href: knowledgeUrlBase + "/email/schedule-a-one-to-one-email-from-the-crm"
}), _defineProperty(_FeaturesMap, Features.USER_ROLES, {
  href: appUrlBase + "/settings/" + portalId + "/users/permissions"
}), _defineProperty(_FeaturesMap, Features.MULTI_CURRENCY, {
  href: appUrlBase + "/settings/" + portalId + "/account-defaults/multicurrency"
}), _defineProperty(_FeaturesMap, Features.VIDEO_CREATION, {
  href: knowledgeUrlBase + "/email/add-videos-to-crm-emails"
}), _defineProperty(_FeaturesMap, Features.VIDEO_CREATION_AND_HOSTING, {}), _defineProperty(_FeaturesMap, Features.RECURRING_REVENUE_TRACKING, {
  href: knowledgeUrlBase + "/articles/kcs_article/deals/track-recurring-revenue-with-revenue-analytics"
}), _defineProperty(_FeaturesMap, Features.GOALS, {
  href: appUrlBase + "/settings/" + portalId + "/goals",
  freeUser: 'noAccess'
}), _defineProperty(_FeaturesMap, Features.ESIGN, {
  href: knowledgeUrlBase + "/deals/use-e-signatures-with-quotes",
  freeUser: 'noAccess'
}), _defineProperty(_FeaturesMap, Features.QUOTE_BASED_WORKFLOWS, {
  hrefNotAvailable: true
}), _defineProperty(_FeaturesMap, Features.WORKFLOWS_EXTENSIONS, {}), _defineProperty(_FeaturesMap, Features.CUSTOM_BOTS, {}), _defineProperty(_FeaturesMap, Features.SLACK, {
  href: appUrlBase + "/ecosystem/" + portalId + "/marketplace/apps/sales/sales-enablement/slack"
}), _defineProperty(_FeaturesMap, Features.VIDEO_HOSTING_MANAGEMENT, {
  href: appUrlBase + "/file-manager-beta/" + portalId
}), _defineProperty(_FeaturesMap, Features.PLAYBOOKS, {
  href: appUrlBase + "/playbooks/" + portalId,
  freeUser: 'noAccess'
}), _defineProperty(_FeaturesMap, Features.TICKETING, {}), _defineProperty(_FeaturesMap, Features.CUSTOMER_SERVICE_AUTOMATION, {
  hrefNotAvailable: true
}), _defineProperty(_FeaturesMap, Features.TEMPLATES, {
  freeUser: 'limitedAccess'
}), _defineProperty(_FeaturesMap, Features.DOCUMENTS, {
  freeUser: 'limitedAccess'
}), _defineProperty(_FeaturesMap, Features.CONVERSATION_ROUTING, {
  freeUser: 'noAccess'
}), _defineProperty(_FeaturesMap, Features.KNOWLEDGE_BASE, {
  href: knowledgeUrlBase + "/knowledge-base/how-do-i-create-a-knowledge-base-article"
}), _defineProperty(_FeaturesMap, Features.HIERARCHICAL_TEAMS, {
  href: appUrlBase + "/settings/" + portalId + "/users/teams"
}), _defineProperty(_FeaturesMap, Features.CONTENT_PARTITIONING, {
  href: knowledgeUrlBase + "/account/partition-your-hubspot-assets"
}), _defineProperty(_FeaturesMap, Features.ADDITIONAL_ROOT_DOMAINS, {
  href: knowledgeUrlBase + "/domains-and-urls/connect-a-domain-to-hubspot"
}), _defineProperty(_FeaturesMap, Features.MULTI_DOMAIN_TRAFFIC_REPORTING, {
  href: knowledgeUrlBase + "/reports/analyze-your-site-traffic-with-the-traffic-analytics-tool"
}), _defineProperty(_FeaturesMap, Features.CALCULATED_PROPERTIES, {
  href: knowledgeUrlBase + "/articles/kcs_article/settings/create-calculation-properties"
}), _defineProperty(_FeaturesMap, Features.WEBHOOKS, {
  href: knowledgeUrlBase + "/articles/kcs_article/workflows/how-do-i-use-webhooks-with-hubspot-workflows"
}), _defineProperty(_FeaturesMap, Features.TIME_TO_CLOSE_REPORTS, {}), _defineProperty(_FeaturesMap, Features.TICKET_STATUS, {
  href: knowledgeUrlBase + "/tickets/automate-ticket-status"
}), _defineProperty(_FeaturesMap, Features.TICKET_ROUTING, {
  href: appUrlBase + "/workflows/" + portalId,
  freeUser: 'noAccess'
}), _defineProperty(_FeaturesMap, Features.TICKETS_CLOSED_REPORTS, {}), _defineProperty(_FeaturesMap, Features.TASK_AUTOMATION, {
  hrefNotAvailable: true
}), _defineProperty(_FeaturesMap, Features.MULTIPLE_TICKET_PIPELINES, {
  href: knowledgeUrlBase + "/tickets/customize-ticket-pipelines-and-statuses"
}), _defineProperty(_FeaturesMap, Features.NPS_SURVEYS, {
  href: appUrlBase + "/feedback/" + portalId + "/loyalty/new/email"
}), _defineProperty(_FeaturesMap, Features.CUSTOMER_EXPERIENCE_SURVEYS, {
  href: appUrlBase + "/feedback/" + portalId + "/satisfaction/new/email"
}), _defineProperty(_FeaturesMap, Features.CUSTOMER_SUPPORT_SURVEYS, {
  href: appUrlBase + "/feedback/" + portalId + "/support/new/email"
}), _defineProperty(_FeaturesMap, Features.INSIGHTS_DASHBOARD, {
  hrefNotAvailable: true
}), _defineProperty(_FeaturesMap, Features.AGENT_PRESENCE, {
  freeUser: 'noAccess'
}), _defineProperty(_FeaturesMap, Features.HUB_DB_DYNAMIC_CONTENT, {
  href: appUrlBase + "/hubdb/" + portalId
}), _defineProperty(_FeaturesMap, Features.WEBSITE_PAGES, {}), _defineProperty(_FeaturesMap, Features.DESIGN_MANAGER, {}), _defineProperty(_FeaturesMap, Features.STAGING_ENVIRONMENT, {}), _defineProperty(_FeaturesMap, Features.WEBSITE_ANALYTICS, {}), _defineProperty(_FeaturesMap, Features.CUSTOM_DOMAINS, {}), _defineProperty(_FeaturesMap, Features.UPTIME, {
  href: hubspotUrlBase + "/products/cms/website-monitoring"
}), _defineProperty(_FeaturesMap, Features.CONTENT_DELIVERY_NETWORK, {}), _defineProperty(_FeaturesMap, Features.SECURITY_MONITORING_THREAT_DETECTION, {}), _defineProperty(_FeaturesMap, Features.CONTACT_MANAGEMENT, {}), _defineProperty(_FeaturesMap, Features.CONTACT_WEBSITE_ACTIVITY, {}), _defineProperty(_FeaturesMap, Features.COMPANIES, {}), _defineProperty(_FeaturesMap, Features.DEALS, {}), _defineProperty(_FeaturesMap, Features.TASKS_AND_ACTIVITIES, {}), _defineProperty(_FeaturesMap, Features.COMPANY_INSIGHTS, {}), _defineProperty(_FeaturesMap, Features.GMAIL_AND_OUTLOOK_INTEGRATION, {}), _defineProperty(_FeaturesMap, Features.HUBSPOT_CONNECT_INTEGRATIONS, {}), _defineProperty(_FeaturesMap, Features.CUSTOM_SUPPORT_FORM_FIELDS, {}), _defineProperty(_FeaturesMap, Features.PROSPECTS, {}), _defineProperty(_FeaturesMap, Features.MESSENGER_INTEGRATION, {}), _defineProperty(_FeaturesMap, Features.CUSTOM_PROPERTIES, {}), _defineProperty(_FeaturesMap, Features.ACCOUNT_OVERVIEW, {
  freeUser: 'noAccess'
}), _defineProperty(_FeaturesMap, Features.CUSTOM_OBJECTS, {
  href: knowledgeUrlBase + "/crm-setup/use-custom-objects"
}), _defineProperty(_FeaturesMap, Features.MOBILE_APP, {}), _defineProperty(_FeaturesMap, Features.TASK_QUEUES, {}), _defineProperty(_FeaturesMap, Features.SALES_ANALYTICS, {
  href: appUrlBase + "/analytics/" + portalId + "/sales-reports"
}), _defineProperty(_FeaturesMap, Features.EMAIL_HEALTH_INSIGHTS, {}), _defineProperty(_FeaturesMap, Features.MULTI_LANGUAGE_CONTENT, {
  href: knowledgeUrlBase + "/cos-general/how-to-manage-multi-language-content-with-hubspots-cos"
}), _defineProperty(_FeaturesMap, Features.LEAD_AND_COMPANY_SCORING, {
  href: knowledgeUrlBase + "/crm-setup/set-up-score-properties-to-qualify-leads"
}), _defineProperty(_FeaturesMap, Features.ABM_TOOLS_AND_AUTOMATION, {
  href: knowledgeUrlBase + "/account/get-started-with-account-based-marketing-in-hubspot"
}), _defineProperty(_FeaturesMap, Features.ADS_OPTIMIZATION_EVENTS, {
  href: knowledgeUrlBase + "/ads/sync-leads-from-your-google-ads-account-to-hubspot"
}), _defineProperty(_FeaturesMap, Features.PROGRAMMABLE_CHATBOTS, {
  href: knowledgeUrlBase + "/conversations/a-guide-to-bot-actions#run-a-code-snippet-enterprise-only"
}), _defineProperty(_FeaturesMap, Features.BEHAVIORAL_EVENT_TRIGGERS, {
  href: appUrlBase + "/analytics/" + portalId + "/events/manage/events/approved?page=1"
}), _defineProperty(_FeaturesMap, Features.EMAIL_COMPARISON_REPORTING, {}), _defineProperty(_FeaturesMap, Features.BLOG, {
  href: appUrlBase + "/website/" + portalId + "/blog"
}), _defineProperty(_FeaturesMap, Features.SEO_RECOMMEND_OPTIMIZE, {
  href: appUrlBase + "/content-strategy/" + portalId + "/recommendations"
}), _defineProperty(_FeaturesMap, Features.CONTENT_STRATEGY, {
  href: knowledgeUrlBase + "/seo/create-topics-for-your-seo-strategy"
}), _defineProperty(_FeaturesMap, Features.GOOGLE_SEARCH_CONSOLE_INTEGRATION, {
  href: knowledgeUrlBase + "/content-strategy/enable-the-google-search-console-integration-for-your-content-strategy-tool"
}), _defineProperty(_FeaturesMap, Features.CONTENT_STAGING, {
  href: knowledgeUrlBase + "/website-pages/redesign-and-relaunch-your-site-with-content-staging"
}), _defineProperty(_FeaturesMap, Features.SMART_CONTENT_AND_REPORTING, {
  href: knowledgeUrlBase + "/website-pages/create-and-manage-smart-content-rules"
}), _defineProperty(_FeaturesMap, Features.DYNAMIC_PERSONALIZATION, {
  href: "https://developers.hubspot.com/docs/cms/data/dynamic-pages"
}), _defineProperty(_FeaturesMap, Features.PASSWORD_PROTECTED_PAGES, {
  href: knowledgeUrlBase + "/website-pages/redesign-and-relaunch-your-site-with-content-staging"
}), _defineProperty(_FeaturesMap, Features.CONTENT_STRATEGY, {
  href: 'https://knowledge.hubspot.com/seo/create-topics-for-your-seo-strategy'
}), _defineProperty(_FeaturesMap, Features.GOOGLE_SEARCH_CONSOLE_INTEGRATION, {
  href: 'https://knowledge.hubspot.com/content-strategy/enable-the-google-search-console-integration-for-your-content-strategy-tool'
}), _defineProperty(_FeaturesMap, Features.CONTENT_STAGING, {
  href: 'https://knowledge.hubspot.com/website-pages/redesign-and-relaunch-your-site-with-content-staging'
}), _defineProperty(_FeaturesMap, Features.SMART_CONTENT_AND_REPORTING, {
  href: 'https://knowledge.hubspot.com/website-pages/create-and-manage-smart-content-rules'
}), _defineProperty(_FeaturesMap, Features.DYNAMIC_PERSONALIZATION, {
  href: 'https://developers.hubspot.com/docs/cms/data/dynamic-pages'
}), _defineProperty(_FeaturesMap, Features.PASSWORD_PROTECTED_PAGES, {
  href: 'https://knowledge.hubspot.com/website-pages/redesign-and-relaunch-your-site-with-content-staging'
}), _defineProperty(_FeaturesMap, Features.LEAD_AND_COMPANY_SCORING, {
  href: knowledgeUrlBase + "/crm-setup/set-up-score-properties-to-qualify-leads"
}), _defineProperty(_FeaturesMap, Features.DRAG_AND_DROP_EDITOR, {
  href: knowledgeUrlBase + "/cms-general/create-and-edit-pages-with-the-drag-and-drop-editor"
}), _defineProperty(_FeaturesMap, Features.WEBSITE_THEMES, {
  href: knowledgeUrlBase + "/website-pages/create-website-content-using-a-theme"
}), _defineProperty(_FeaturesMap, Features.MULTI_LANGUAGE_CREATION_TESTING, {
  href: knowledgeUrlBase + "/cos-general/how-to-manage-multi-language-content-with-hubspots-cos"
}), _defineProperty(_FeaturesMap, Features.LOCAL_WEBSITE_DEVELOPMENT, {
  href: 'https://designers.hubspot.com/tutorials/getting-started-with-local-development'
}), _defineProperty(_FeaturesMap, Features.CONTACT_ATTRIBUTION_REPORT_BUILDER, {
  href: knowledgeUrlBase + "/reports/create-custom-contact-attribution-reports"
}), _defineProperty(_FeaturesMap, Features.CDN, {
  href: hubspotUrlBase + "/products/cms/website-monitoring"
}), _defineProperty(_FeaturesMap, Features.TWENTY_FOUR_SEVEN_SECURITY_MONITORING, {
  href: hubspotUrlBase + "/products/cms/website-monitoring"
}), _defineProperty(_FeaturesMap, Features.WEB_APPS, {
  href: hubspotUrlBase + "/products/cms/serverless-functions"
}), _defineProperty(_FeaturesMap, Features.REVERSE_PROXY_CONFIGURATION, {
  href: hubspotUrlBase + "/products/cms/website-monitoring"
}), _defineProperty(_FeaturesMap, Features.MEMBERSHIPS, {
  href: knowledgeUrlBase + "/cms-pages-editor/control-audience-access-to-pages"
}), _defineProperty(_FeaturesMap, Features.ACTIVITY_LOGGING, {
  href: hubspotUrlBase + "/products/cms/activity-logs"
}), _defineProperty(_FeaturesMap, Features.CUSTOM_DOMAIN_SECURITY_SETTINGS, {
  href: hubspotUrlBase + "/products/cms/website-monitoring"
}), _defineProperty(_FeaturesMap, Features.SITE_PERFORMANCE_MONITORING, {
  href: hubspotUrlBase + "/products/cms/website-monitoring"
}), _defineProperty(_FeaturesMap, Features.CODE_ALERTS, {
  href: hubspotUrlBase + "/products/cms/website-monitoring"
}), _defineProperty(_FeaturesMap, Features.ADDITIONAL_BRAND_DOMAIN, {
  href: hubspotUrlBase + "/products/brand-domains"
}), _defineProperty(_FeaturesMap, Features.ADAPTIVE_TESTING, {
  href: knowledgeUrlBase + "/cms-general/create-an-adaptive-test-for-a-page"
}), _defineProperty(_FeaturesMap, Features.FIELD_LEVEL_PERMISSIONS, {
  href: knowledgeUrlBase + "/account/restrict-edit-access-for-properties"
}), _defineProperty(_FeaturesMap, Features.ADVANCED_PERMISSIONS, {
  href: knowledgeUrlBase + "/settings/hubspot-user-permissions-guide"
}), _defineProperty(_FeaturesMap, Features.RECORD_CUSTOMIZATION, {
  href: knowledgeUrlBase + "/crm-setup-customize-record-sidebars"
}), _defineProperty(_FeaturesMap, Features.MULTI_TOUCH_REVENUE_ATTRIBUTION, {
  href: appUrlBase + "/report-builder/" + portalId
}), _defineProperty(_FeaturesMap, Features.LOGGED_IN_VISITOR_IDENTIFICATION, {}), _defineProperty(_FeaturesMap, Features.MULTI_LANGUAGE_KNOWLEDGE_BASE, {}), _defineProperty(_FeaturesMap, Features.KNOWLEDGE_BASE_SINGLE_SIGN_ON, {}), _defineProperty(_FeaturesMap, Features.FORECASTING, {
  href: appUrlBase + "/forecasting/" + portalId,
  freeUser: 'noAccess'
}), _defineProperty(_FeaturesMap, Features.CUSTOM_BEHAVIORAL_EVENTS, {}), _defineProperty(_FeaturesMap, Features.CONVERSATION_INTELLIGENCE, {
  freeUser: 'noAccess',
  href: knowledgeUrlBase + "/calling/review-calls"
}), _defineProperty(_FeaturesMap, Features.ADMIN_NOTIFICATIONS_MANAGEMENT, {}), _defineProperty(_FeaturesMap, Features.SITE_TREE, {}), _defineProperty(_FeaturesMap, Features.COLLABORATION_TOOLS, {
  href: appUrlBase + "/marketing/" + portalId + "/tasks"
}), _defineProperty(_FeaturesMap, Features.MARKETING_EVENTS_OBJECT, {}), _defineProperty(_FeaturesMap, Features.HUBDB, {}), _defineProperty(_FeaturesMap, Features.EMAIL_REPLY_TRACKING, {}), _defineProperty(_FeaturesMap, Features.EMAIL_HEALTH_REPORTING, {}), _defineProperty(_FeaturesMap, Features.CAMPAIGN_MANAGEMENT, {
  href: appUrlBase + "/marketing/" + portalId + "/campaigns"
}), _defineProperty(_FeaturesMap, Features.TECHNICAL_SUPPORT, {}), _FeaturesMap);
export default FeaturesMap;