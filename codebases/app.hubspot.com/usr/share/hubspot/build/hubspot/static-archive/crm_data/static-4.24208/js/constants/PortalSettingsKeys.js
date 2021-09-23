'use es6';

export var ACTIVITY_TYPES_ENABLED = 'engagements:ActivityTypes:Enabled';
export var CUSTOM_CALL_OUTCOMES_ENABLED = 'engagements:CustomCallOutcomes:Enabled';
export var ADMIN_OPTED_PORTAL_INTO_REDESIGN = 'BetaToggle:AdminOptedPortalIn';
export var AI_EMAIL_ENRICHMENT = 'ai:email:parser:signature';
export var ATMENTION_USER_INVITE_MAP = 'Onboarding:atmention_user_invite_map';
export var COMPANY_CONTACT_ASSOCIATOR = 'companies:contact:associator';
export var CONTACTS_PUBLIC_VIEW = 'contacts:public_profile:access';
export var DEAL_AMOUNT_CALCULATOR_PROPERTY = 'deals:deal_amount_calculation_property';
export var DEFAULT_CONTENT_ASSIGNMENT_ON = 'DEFAULT_CONTENT_ASSIGNMENT_ON';
export var FISCAL_YEAR_START_MONTH = 'hubspot:fiscalyear';
export var GDPR_COMPLIANCE_ENABLED = 'GDPRComplianceEnabled';
export var GDPR_COMPLIANCE_ENFORCED = 'GDPREnforcementEnabled';
export var LIFECYCLE_COMPANY_SYNC = 'deals::sync_contact_lifecyclestage';
export var LIFECYCLE_CONTACT_SYNC = 'deals::sync_company_lifecyclestage';
export var LINE_ITEM_COLUMNS = 'lineitems:columns';
export var PROPAGATE_OWNER = 'companies:propagate-owner';
export var RECORDING_SETTINGS_KEY = 'Integrations:Twilio:RecordingEnabled';
export var SFDC_V2_ENABLED = 'sfdc:v2-enabled';
export var VIEWED_DEAL_SETTINGS = 'deals:settings:viewedDealSettings';
export var VIEWED_MARKETING_EVENT_CONFIRM_MODAL = 'integrations:marketing-event:index-confirm';
export var VIEWED_PAYMENTS_ACCOUNT_VERIFIED_MODAL = 'payments:settings:viewedPaymentsAccountVerifiedModal';
export var QUOTES_DEFAULT_EXPIRATION_DAYS = 'quotes:default-expiration-days';
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}