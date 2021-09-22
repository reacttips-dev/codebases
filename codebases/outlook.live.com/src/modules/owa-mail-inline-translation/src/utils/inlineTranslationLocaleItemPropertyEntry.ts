import { isFeatureEnabled } from 'owa-feature-flags';
import mailStore from 'owa-mail-store/lib/store/Store';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';

export const LANGUAGE_FOR_EMAIL_PROPERTY_NAME = 'EntityExtraction/ExtractLanguage1.0';
export const QUOTED_TEXT_LANGUAGES_PROPERTY_NAME = 'EntityExtraction/ExtractQuotedTextLanguages1.0';
const COMMON_DISTINGUISHED_PROPERTY_SET_ID = 'Common';
const STRING_PROPERTY_TYPE = 'String';

export const featureId = 'InlineTranslationLocale';
const propertyPaths = [
    extendedPropertyUri({
        PropertyName: LANGUAGE_FOR_EMAIL_PROPERTY_NAME,
        DistinguishedPropertySetId: COMMON_DISTINGUISHED_PROPERTY_SET_ID,
        PropertyType: STRING_PROPERTY_TYPE,
    }),
    extendedPropertyUri({
        PropertyName: QUOTED_TEXT_LANGUAGES_PROPERTY_NAME,
        DistinguishedPropertySetId: COMMON_DISTINGUISHED_PROPERTY_SET_ID,
        PropertyType: STRING_PROPERTY_TYPE,
    }),
];

const isPropertyExistedOnItem = (itemId: string): boolean => {
    const item = mailStore.items.get(itemId);
    return item?.TranslationData && item.TranslationData.itemLocale != null;
};

const shouldGetItemPropertiesFromServer = (
    itemId: string,
    listviewType: ReactListViewType
): boolean => {
    if (
        (!isFeatureEnabled('rp-inlineTranslation') ||
            listviewType != ReactListViewType.Conversation) &&
        !isFeatureEnabled('rp-inlineTranslation-conversationViewOff')
    ) {
        return false;
    }

    // Encrypted items are not supposed to have language stamped.
    // But these (along with all right protected) items are always stamped with 'en-US'.
    // We are ignoring detected language for these items
    const item = mailStore.items.get(itemId);
    return item ? !item.RightsManagementLicenseData : false;
};

const inlineTranslationLocaleItemPropertyEntry = {
    featureId: featureId,
    propertyPaths: propertyPaths,
    isPropertyExistedOnItem: isPropertyExistedOnItem,
    shouldGetItemPropertiesFromServer: shouldGetItemPropertiesFromServer,
};

export default inlineTranslationLocaleItemPropertyEntry;
