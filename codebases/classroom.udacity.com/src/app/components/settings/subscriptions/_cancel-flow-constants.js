// This file must be kept in sync with 3rd party integrations
// INTERCOM support team
// OPTIMIZELY projects: Udacity, Udacity (Staging), maintained by #experience-team
// BLUE SHIFT email campaigns
// CHARTIO Program Managers and #data-team
// A call center staffed by our support team, and more
export const EVENT_NAME = {
    CANCEL_CLICKED: 'Cancel CTA Clicked',
    REQUESTED: 'Cancel Request Initiated',
    DISCOUNT: 'Cancel Request Discount',
    MODAL_CLOSED: 'Cancel Modal Closed',
};

export const EVENT_VALUE = {
    CALL_AND_CHAT: 'Call_and_Chat',
    CALL_AND_EMAIL: 'Call_and_Email',
    CHAT: 'Chat_Only',
    EMAIL: 'Email_Only',
    CALL: 'Phone_Only',
    SELF_SERVE: 'Self_Serve',
    SELF_SERVE_DISCOUNT: 'Self_Serve_Discount',
};

export const EVENT_LABEL = {
    CALL_CLICKED: 'Call_CTA_Clicked',
    CHAT_CLICKED: 'Chat_CTA_Clicked',
    EMAIL_CLICKED: 'Email_CTA_Clicked',
    SELF_SERVE: 'Self_Serve_Cancel_From_Survey',
    SELF_SERVE_DISCOUNT_DISQUALIFIED: 'Self_Serve_Cancel_From_Discount',
    SELF_SERVE_DISCOUNT_PRESENTED: 'Self_Serve_Discount_CTA_Presented',
    SELF_SERVE_DISCOUNT_ABANDONED: 'Self_Serve_Discount_CTA_Abandoned',
    SELF_SERVE_DISCOUNT_ACCEPTED: 'Self_Serve_Discount_CTA_Accepted',
    SELF_SERVE_DISCOUNT_APPLIED: 'Self_Serve_Discount_CTA_Applied',
    SELF_SERVE_DISCOUNT_SEARCH_CATALOG: 'Self_Serve_Discount_CTA_Search_Catalog',
    SELF_SERVE_DISCOUNT_APPLY_FAILED: 'Self_Serve_Discount_CTA_Apply_Failed',
};

// Optimizely owns these features in the Udacity project
// prod: https://app.optimizely.com/v2/projects/11371078919
export const FEATURES = {
    call: 'cancel_call_flow',
    chat: 'cancel_chat_flow',
    email: 'cancel_email_flow',
    call_only_override: 'cancel_call_flow_only_override',
    self_serve_with_discount: 'cancel_survey_discount_flow',
    self_serve_with_discount_low_grc: 'cancel_survey_discount_flow_low_grc',
};

// Optimizely audience attributes with examples of the value these attributes expect
export const ATTRIBUTES = {
    COUNTRY_CODE: 'country_code', // 'CA', 'US', etc.
    DAY_OF_WEEK: 'day_of_week_new_york', // 0-6
    HOUR_OF_DAY: 'hour_of_day_new_york', // 0-23
    REGION: 'region', // 'AL', 'Alabama', etc.
    RETENTION_PROBABILITY: 'rp', // float ie: 0.5
    TEST_USER: 'test_user', // true or false
};

// Intercom sets the selector for the operator
// https://app.intercom.com/a/apps/av16vnft/inbox/inbox/3935719
export const INTERCOM_ID = {
    CHAT: 'intercom-cancel-via-chat',
};

export const EMAIL_ADDRESS = 'keeplearning@udacity.com';

export const CALL_CENTER = {
    phoneNumber: '18008549945',
    phoneLabel: 'Call 800 - 854 - 9945',
    timeZone: 'America/New_York',
    regions: ['US', 'CA'],
};