import {
    __
} from '../../services/localization-service';

// These error codes are defined User API's swagger docs under the
// ErrorResponse definition.
// https://user-api-swagger.udacity.com/
const ERROR_MESSAGES = {
    // User is blocked
    4005: __(
        'Your account has been temporarily disabled. Please contact support.'
    ),
    // GT CAS auth error
    4006: __('There was an error signing in to Georgia Tech.'),
    // IP Throttled
    4009: __('Too many requests, please try again in a few minutes.'),
    // OAuth account is missing required data
    4101: __('That account is missing an email address.'),
    // OAuth account is missing required data
    4102: __('That account is missing a first name.'),
    // OAuth account is missing required data
    4103: __('That account is missing a last name.'),
    // OAuth account is already linked to an account
    4104: __('That account is already linked to a Udacity account.'),
    // No linked account
    4105: __('There is no Udacity account linked to that account.'),
    // Pending OAuth signup (for age gating) expired
    4106: __('There was an error, please try again.'),
    // OAuth provider email is already linked to an account
    4107: __('This account already exists'),
    // OAuth provider says the email is not verified
    4108: __('Please verify the email address on that account and try again.'),
    // Udacity email is not verified (can't auto-link)
    4109: __('Please verify your Udacity account email address and try again.'),
    // User API did not receive an IdP ID
    4110: __(
        'Sorry, your account does not have that enabled. Please sign in with another option.'
    ),
    // Short password
    4200: __('Password must be at least 8 characters.'),
    // Common password
    4201: __('Password is known to be too common.'),
    // Name or email in password
    4202: __('Password cannot be your name or email address.'),
    // New generic weak password error, will replace 4200-4202
    4203: __('Please make your password stronger.'),
    // Exchange with OAuth provider failure
    5100: __('There was an error loading that account.'),
    // Error specific to auth-web flow, not from User API directly
    NO_SSO: __(
        'Sorry, your account does not have that enabled. Please sign in with another option.'
    ),
    // If Okta webfinger call fails before getting to User API call
    WEBFINGER_FAIL: __(
        'Unable to sign in with your organization. You can try again or sign in with another option.'
    ),
    // If Okta returns a 400 due to misconfiguration, it is configured to redirect to
    // https://auth.udacity.com/sign-in?errorCode=OKTA_BAD_REQUEST
    OKTA_BAD_REQUEST: __(
        'Unable to sign in with your organization. You can try again or sign in with another option.'
    ),
    //EMC error codes
    //Invalid EMC redirect URL, missing next
    6001: __('Invalid request.'),
    //Invalid EMC redirect URL, missing signature
    6002: __('Invalid request.'),
    //Invalid EMC redirect URL, invalid signature
    6003: __('Invalid request.'),
    //Invalid EMC redirect URL, invalid company
    6004: __('Invalid request.'),
    //SSO is not enabled for company in EMC
    6005: __('Invalid request.'),
    //SSO is incorrectly configured for company in EMC
    6006: __('There was an error loading that account.'),
    //Account doesn't have access to the EMC resource
    6007: __(
        'Sorry, your account does not have that enabled. Please sign in with another option.'
    ),
    //User account is not linked with Okta
    6008: __('There was an error loading that account.')
};

// Allow the caller to determine how to handle if the error code is not recognized.
// Note that because query params are strings and JSON response fields are ints, but our object lookup
// honors both, the `code` passed can be an int or a string.
export function translateError(code) {
    return ERROR_MESSAGES[code];
}

const CONTACT_SUPPORT_TRANSLATION = __('Please contact support.');

export function includeContactSupportText(code) {
    return (!isNaN(code) && [6001, 6002, 6003, 6004, 6005, 6006, 6008].includes(parseInt(code, 10)));
}

export function getContactSupportText(code) {
    // currently returns support text for emc error codes
    if (!isNaN(code) && [6001, 6002, 6003, 6004, 6005, 6006, 6008].includes(parseInt(code, 10))) {
        return CONTACT_SUPPORT_TRANSLATION;
    }
    return null;
}

export function getContactSupportLink(code) {
    // currently returns support link for enterprise for only emc error codes
    if (!isNaN(code) && [6001, 6002, 6003, 6004, 6005, 6006, 6008].includes(parseInt(code, 10))) {
        return 'https://udacityenterprise.zendesk.com/hc/en-us/requests/new';
    }
    return null;
}