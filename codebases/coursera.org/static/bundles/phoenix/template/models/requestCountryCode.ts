import config from 'js/app/config';

// For some reason country code injected into the page is unstable, so we are
// extra protecting ourselves here to avoid breaking currency and price localization.
// Defaulting to 'US' if can't figure out the country code for the same reason.

const isValidCode = typeof config.requestCountryCode === 'string' && config.requestCountryCode.length === 2;
const countryCode = isValidCode ? config.requestCountryCode.toUpperCase() : 'US';

export default countryCode;
