import { detectedLanguageExtendedPropertyUri } from '../constants';
import { mailStore } from 'owa-mail-store';
import { GetItemManagerFeatureIds } from 'owa-mail-smart-pill-features';
import shouldMakeGetItemCall from '../shouldMakeGetItemCall';

const isPropertyExistedOnItem = (itemId: string): boolean => {
    const item = mailStore.items.get(itemId);
    return item && !!item.stampedLanguage;
};

const languageAndLocaleItemPropertyEntry = {
    featureId: GetItemManagerFeatureIds.LanguageAndLocale,
    propertyPaths: [detectedLanguageExtendedPropertyUri],
    isPropertyExistedOnItem: isPropertyExistedOnItem,
    shouldGetItemPropertiesFromServer: shouldMakeGetItemCall,
};

export default languageAndLocaleItemPropertyEntry;
