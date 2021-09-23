'use es6';

import UrlParts from './parts/UrlParts';
/*
 * IMPORTANT
 * ------------
 * The frontend is not capable of properly validating email addresses.
 * See https://git.hubteam.com/HubSpot/PatternValidation/issues/49
 *
 * Because of this, it is required to validate on the backend for any
 * scenario that prompts a user in product for an email address.
 *
 * More info - https://product.hubteam.com/docs/frontend/docs/input-validation.html
 */

var EMAIL_ADDRESS_REGEX = new RegExp("^(?:.+)@" + UrlParts.domain + "$");
export default EMAIL_ADDRESS_REGEX;