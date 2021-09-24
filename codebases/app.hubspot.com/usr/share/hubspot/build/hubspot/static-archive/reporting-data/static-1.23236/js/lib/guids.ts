import { Map as ImmutableMap } from 'immutable';
import I18n from 'I18n';
/**
 * Known GUID constants queued for deprecation
 *
 * @constants
 * @private
 */

var deprecated = {
  GMAIL_INTEGRATION: 'GMAIL_INTEGRATION'
};
/**
 * Known GUID constants keyed by name
 *
 * @constants
 * @private
 */

var constants = ImmutableMap(Object.assign({
  NO_BREAKDOWN: 'nobreakdown',
  NO_DETAIL_GUID: 'c90e6907-e895-479c-8689-0d22fa660677',
  EMPTY_LIST_GUID: '30434570-5795-496c-b0ae-8d2dc9053483',
  UNKNOWN: '5ca1ab1e-fb50-4e89-9cff-a000ba5eba11',
  UNKNOWN_CAMPAIGN_GUID: '9bae4a1c-0f1c-11e1-9afb-58b0357d1cb3',
  UNKNOWN_COUNTRY_GUID: 'bd185678-735d-4c78-a673-d9528d37a4a6',
  UNKNOWN_KEYWORD_GUID: 'c1d25565-f664-4089-9f0a-1734cc1b3a65',
  UNKNOWN_REFERRER_GUID: '1ca35c16-25e9-49f1-bfcb-960300c42b6f',
  UNKNOWN_DEVICE_GUID: '1d3f1024-9c84-4955-8a30-a84fd506915b',
  UNKNOWN_DEVICE_OS_GUID: '1b7853ea-92b0-483f-a480-9c8595259731',
  UNKNOWN_DEVICE_MARKET_NAME: '5636aafb-35ed-4881-bd4c-3fa6eb95a194',
  UNKNOWN_GEO_GUID: '7081c5b2-d128-4ec1-a9be-cba29cfc540a',
  UNKNOWN_BROWSER_VERSION: 'f67178c8-9eba-4f66-a560-c02206160915',
  UNKNOWN_URL: 'e3875d32-ab81-48f1-9e78-493eae864f12',
  SSL_REMOVED_KEYWORDS: 'Unknown keywords (SSL)',
  LYCOS_IMAGE_KEYWORD_PLACEHOLDER: 'Unknown keywords (image preview)',
  PPC_GCLID_BUCKET: 'Auto-tagged PPC',
  EMAIL_INTEGRATION: 'EMAIL_INTEGRATION',
  BCC_TO_CRM: 'BCC_TO_CRM'
}, deprecated));
/**
 * Known GUID constants keyed by GUID
 *
 * @constants
 * @private
 */

var guids = constants.flip();
/**
 * Check whether GUID is known
 *
 * @param {string} guid GUID to check
 * @returns {boolean} Whether GUID is known
 */

export var isKnownGuid = function isKnownGuid(guid) {
  return guids.has(guid);
};
/**
 * Get humanized label from GUID
 *
 * @param {string} guid GUID to humanize
 * @returns {string} Label if known otherwise original value
 */

export var getGuidLabel = function getGuidLabel(guid) {
  return isKnownGuid(guid) ? I18n.text("reporting-data.guids." + guids.get(guid)) : guid;
};