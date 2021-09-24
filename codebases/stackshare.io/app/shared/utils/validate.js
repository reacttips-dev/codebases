// http://codereview.stackexchange.com/a/92377
export const IS_NOT_NULL = 'not_null';
export const IS_EMAIL = 'is_email';
export const IS_VALID_URL = 'is_valid_url';

export const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// eslint-disable-next-line no-useless-escape
export const websiteRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

export const validateEmail = email => {
  return emailRegex.test(email);
};

export const validateVendorEmail = email => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateWebsite = website => {
  return websiteRegex.test(website);
};

export const validateNotNull = value => {
  return value.trim() !== '';
};
