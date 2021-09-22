import { ITEM_CLASS_SMIME_CLEAR_SIGNED } from 'owa-smime-adapter/lib/utils/constants';
import { ITEM_CLASS_SMIME } from 'owa-smime-adapter/lib/utils/bootConstants';

export function isItemClassSmimeClearSigned(itemClass: string): boolean {
    return itemClass && itemClass.indexOf(ITEM_CLASS_SMIME_CLEAR_SIGNED) === 0;
}

export function isItemClassSmimeAndNotClearSigned(itemClass: string): boolean {
    return (
        itemClass &&
        itemClass.indexOf(ITEM_CLASS_SMIME) === 0 &&
        !isItemClassSmimeClearSigned(itemClass)
    );
}

export function isItemClassSmime(itemClass: string): boolean {
    return itemClass && itemClass.indexOf(ITEM_CLASS_SMIME) === 0;
}

export function isItemClassMeetingMessage(itemClass: string) {
    return itemClass.match(/^ipm\.(appointment|schedule\.meeting(?!\.notification))/i);
}
