import { format } from 'owa-localize';
import { getLocalizedString } from '../../localization/getLocalizedString';

export default function formatList(items: string[]): string {
    // Algorithm for formatting a localized list of items taken from http://cldr.unicode.org/translation/lists
    if (!items || items.length === 0) {
        return '';
    } else if (items.length === 1) {
        return items[0];
    } else if (items.length === 2) {
        return format(getLocalizedString('formatStringTwoItems'), items[0], items[1]);
    } else {
        let fullString = format(getLocalizedString('formatStringNItemsStart'), items[0], items[1]);
        for (let i = 2; i < items.length - 1; i++) {
            fullString = format(
                getLocalizedString('formatStringNItemsMiddle'),
                fullString,
                items[i]
            );
        }
        fullString = format(
            getLocalizedString('formatStringNItemsEnd'),
            fullString,
            items[items.length - 1]
        );
        return fullString;
    }
}
