'use es6'; // Please do not change this to export raw constants! We want this to be a function so that
// we can extend it to generate keys based on objectTypeId in the future.

export var getPortalSettingsKeys = function getPortalSettingsKeys() {
  return {
    VIEWED_MARKETING_EVENT_CONFIRM_MODAL: 'integrations:marketing-event:index-confirm',
    GDPR_COMPLIANCE_ENABLED: 'GDPRComplianceEnabled',
    LIFECYCLE_CONTACT_SYNC: 'deals::sync_company_lifecyclestage'
  };
};
export var getPortalSettingsToFetch = function getPortalSettingsToFetch() {
  return Object.values(getPortalSettingsKeys());
};