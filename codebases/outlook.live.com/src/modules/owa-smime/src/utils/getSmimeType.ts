import isSMIMEItem from './isSMIMEItem';
import type ClientItem from 'owa-mail-store/lib/store/schema/ClientItem';
import SmimeType from 'owa-smime-adapter/lib/store/schema/SmimeType';
import {
    isItemClassSmimeClearSigned,
    isItemClassSmimeAndNotClearSigned,
} from './smimeItemClassUtils';

/**
 * Utility to decide S/MIME type for an item.
 * This function will return actual SmimeType if the message is decoded
 * otherwise it will decide S/MIME type based on item class.
 */
export default (item: ClientItem): SmimeType => {
    if (!isSMIMEItem(item)) {
        return SmimeType.None;
    }

    if (item.Smime?.SmimeType) {
        return item.Smime.SmimeType;
    }

    // The item has not been decoded, return type by class name
    return isItemClassSmimeClearSigned(item.ItemClass) ? SmimeType.ClearSigned : SmimeType.Unknown;
};

/**
 * Utility to decide conversation S/MIME type.
 * This function will return S/MIME type as Unknown if any of itemClasses in
 * a conversation has itemClass as Encrypted/Opaque otherwise it will return S/MIME type as
 * ClearSign if any of itemClasses in conversation has itemClass as ClearSign.
 * Smime.None will be returned by default if any of the above cases not applicable.
 */
export const getSmimeTypeForConversation = (itemClasses: string[]): SmimeType => {
    if (!itemClasses || !itemClasses.length) {
        return SmimeType.None;
    }

    return itemClasses.reduce((smimeType, itemClass) => {
        if (isItemClassSmimeAndNotClearSigned(itemClass)) {
            return SmimeType.Unknown;
        }

        if (smimeType === SmimeType.None && isItemClassSmimeClearSigned(itemClass)) {
            return SmimeType.ClearSigned;
        }

        return smimeType;
    }, SmimeType.None);
};
