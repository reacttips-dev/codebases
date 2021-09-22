import { isFeatureEnabled } from 'owa-feature-flags';
import mailStore from 'owa-mail-store/lib/store/Store';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';

export const TRANSLATION_DATA_PROPERTY_NAME = 'TranslationData';
export const TRANSLATION_STATUS_PROPERTY_NAME = 'TranslationStatus';
export const TRANSLATION_STATUS_V2_PROPERTY_NAME = 'DisplayTranslation';
const STRING_PROPERTY_TYPE = 'String';
const BOOLEAN_PROPERTY_TYPE = 'Boolean';
const COMMON_DISTINGUISHED_PROPERTY_SET_ID = 'Common';

export const featureId = 'InlineTranslationDataAndStatus';
const propertyPaths = [
    extendedPropertyUri({
        PropertyName: TRANSLATION_DATA_PROPERTY_NAME,
        DistinguishedPropertySetId: COMMON_DISTINGUISHED_PROPERTY_SET_ID,
        PropertyType: STRING_PROPERTY_TYPE,
    }),
    extendedPropertyUri({
        PropertyName: TRANSLATION_STATUS_PROPERTY_NAME,
        DistinguishedPropertySetId: COMMON_DISTINGUISHED_PROPERTY_SET_ID,
        PropertyType: STRING_PROPERTY_TYPE,
    }),
    extendedPropertyUri({
        PropertyName: TRANSLATION_STATUS_V2_PROPERTY_NAME,
        DistinguishedPropertySetId: COMMON_DISTINGUISHED_PROPERTY_SET_ID,
        PropertyType: BOOLEAN_PROPERTY_TYPE,
    }),
];

const isPropertyExistedOnItem = (itemId: string): boolean => {
    const item = mailStore.items.get(itemId);
    return item?.TranslationData && item.TranslationData.translationText != null;
};

const shouldGetItemPropertiesFromServer = (
    itemId: string,
    listviewType: ReactListViewType
): boolean => {
    if (
        (!isFeatureEnabled('rp-inlineTranslation') ||
            !isFeatureEnabled('tra-cacheTranslation') ||
            listviewType != ReactListViewType.Conversation) &&
        (!isFeatureEnabled('rp-inlineTranslation-conversationViewOff') ||
            !isFeatureEnabled('tra-cacheTranslation'))
    ) {
        return false;
    }

    return true;
};

const inlineTranslationDataAndStatusItemPropertyEntry = {
    featureId: featureId,
    propertyPaths: propertyPaths,
    isPropertyExistedOnItem: isPropertyExistedOnItem,
    shouldGetItemPropertiesFromServer: shouldGetItemPropertiesFromServer,
};

export default inlineTranslationDataAndStatusItemPropertyEntry;
