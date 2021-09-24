'use es6';
/**
 * The following types are accepted by the backend as `referencedObjectType`s.
 *
 * https://git.hubteam.com/HubSpot/Properties/blob/master/PropertiesCommon/src/main/java/com/hubspot/properties/exceptions/PropertyInvalidException.java#L150
 */

export var OWNER = 'OWNER';
/**
 * The following types aren't supported as `referencedObjectType`s by the
 * backend, but we treat the as reference types on the front end because their
 * options are external to the property definition.
 */

export var ACTIVITY_TYPE = 'ACTIVITY_TYPE';
export var ADS_FACEBOOK_AD = 'ADS_FACEBOOK_AD';
export var ADS_FACEBOOK_ADGROUP = 'ADS_FACEBOOK_ADGROUP';
export var ADS_FACEBOOK_CAMPAIGN = 'ADS_FACEBOOK_CAMPAIGN';
export var ADS_GOOGLE_AD = 'ADS_GOOGLE_AD';
export var ADS_GOOGLE_ADGROUP = 'ADS_GOOGLE_ADGROUP';
export var ADS_GOOGLE_CAMPAIGN = 'ADS_GOOGLE_CAMPAIGN';
export var ADS_GOOGLE_KEYWORD = 'ADS_GOOGLE_KEYWORD';
export var ADS_LINKEDIN_AD = 'ADS_LINKEDIN_AD';
export var ADS_LINKEDIN_ADGROUP = 'ADS_LINKEDIN_ADGROUP';
export var ADS_LINKEDIN_CAMPAIGN = 'ADS_LINKEDIN_CAMPAIGN';
export var AUTOMATION_PLATFORM_WORKFLOWS = 'AUTOMATION_PLATFORM_WORKFLOWS';
export var BUSINESS_UNIT = 'BUSINESS_UNIT';
export var CALL_DISPOSITION = 'CALL_DISPOSITION';
export var CAMPAIGN = 'CAMPAIGN';
export var COMPANY = 'COMPANY';
export var CONTACT = 'CONTACT';
export var DEAL_PIPELINE = 'DEAL_PIPELINE';
export var DEAL_STAGE = 'DEAL_STAGE';
export var FORM = 'FORM';
export var INBOUND_DB_IMPORT = '_inbounddbio.importid_';
export var INBOUND_DB_LIST = 'INBOUND_DB_LIST';
export var LIST = 'LIST';
export var MULTI_CURRENCY_CURRENCY_CODE = 'MULTI_CURRENCY_CURRENCY_CODE';
export var PERSONA = 'PERSONA';
export var SALESFORCE_CAMPAIGN = 'SALESFORCE_CAMPAIGN';
export var TEAM = 'TEAM';
export var TICKET_PIPELINE = 'TICKET_PIPELINE';
export var TICKET_STAGE = 'TICKET_STAGE';
export var USER = 'USER';