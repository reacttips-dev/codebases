import type ExtendedPropertyUri from 'owa-service/lib/contract/ExtendedPropertyUri';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import { isFeatureEnabled } from 'owa-feature-flags';

// Minimum character count for detecting languages in Spanish.
// Needed because a message like "No" is valid Spanish but also valid English.
export const DEFAULT_MINIMUM_CHAR_COUNT: number = 20;
export const DEFAULT_SCORE_THRESHOLD: number = 80;

export const LANGUAGE_KEY = 'Language';
export const LOCALE_KEY = 'Locale';
export const LANGUAGE_SCORES_KEY = 'LanguageScores';
export const ENTITY_ID_KEY = '@EntityId';

export const DETECTED_LANGUAGE_PROPERTY_NAME = 'EntityExtraction/ExtractLanguage1.0';
const COMMON_DISTINGUISHED_PROPERTY_SET_ID = 'Common';
const STRING_PROPERTY_TYPE = 'String';

export const detectedLanguageExtendedPropertyUri: ExtendedPropertyUri = extendedPropertyUri({
    PropertyName: DETECTED_LANGUAGE_PROPERTY_NAME,
    DistinguishedPropertySetId: COMMON_DISTINGUISHED_PROPERTY_SET_ID,
    PropertyType: STRING_PROPERTY_TYPE,
});

// Smart reply
export const SMART_REPLY_PROPERTY_NAME = 'EntityExtraction/SmartReplyForEmail';

export const smartReplyExtendedPropertyUri: ExtendedPropertyUri = extendedPropertyUri({
    PropertyName: SMART_REPLY_PROPERTY_NAME,
    DistinguishedPropertySetId: COMMON_DISTINGUISHED_PROPERTY_SET_ID,
    PropertyType: STRING_PROPERTY_TYPE,
});

// Smart time
export const SMART_TIME_PROPERTY_NAME = 'EntityExtraction/Events1.0';
export const SMART_TIME_PROPERTY_NAME_NEW = 'EntityExtraction/CalendarRelated1.0';

export const smartTimePropertyName = isFeatureEnabled('mc-smartReplyWithMeeting-MeetingScheduler')
    ? SMART_TIME_PROPERTY_NAME_NEW
    : SMART_TIME_PROPERTY_NAME;
export const smartTimeExtendedPropertyUri: ExtendedPropertyUri = extendedPropertyUri({
    PropertyName: smartTimePropertyName,
    DistinguishedPropertySetId: COMMON_DISTINGUISHED_PROPERTY_SET_ID,
    PropertyType: STRING_PROPERTY_TYPE,
});

// Reply with
export const SEND_CONTENT_REQUEST_PROPERTY_NAME = 'EntityExtraction/SendContentRequestV21.0';

export const sendContentRequestExtendedPropertyUri: ExtendedPropertyUri = extendedPropertyUri({
    PropertyName: SEND_CONTENT_REQUEST_PROPERTY_NAME,
    DistinguishedPropertySetId: COMMON_DISTINGUISHED_PROPERTY_SET_ID,
    PropertyType: STRING_PROPERTY_TYPE,
});
