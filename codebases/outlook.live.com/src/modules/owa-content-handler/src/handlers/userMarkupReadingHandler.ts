import type { ContentHandler } from 'owa-controls-content-handler-base';
import type { ClientItem } from 'owa-mail-store';
import type UserNote from 'owa-mail-store/lib/store/schema/UserNote';
import {
    KeywordMarkupData,
    lazyGetItemUserMarkupKeywords,
    lazyGetItemUserMarkupMap,
    lazyMarkInstanceOfUserMarkup,
    lazyRemoveUserMarkupPopupEventListener,
    UserMarkup,
} from 'owa-user-highlighting';

export const USER_MARKUP_READING_HANDLER_NAME = 'userMarkupReadingHandler';

const handleReadingExistingUserMarkups = (
    item: ClientItem,
    keywordToMarkupMap?: Map<string, KeywordMarkupData>
) => (element: HTMLElement, keyword: string, instance: number) => {
    markExistingUserMarkup(item, element, keyword, instance, keywordToMarkupMap?.get(keyword));
};

export async function markExistingUserMarkup(
    item: ClientItem,
    element: HTMLElement,
    keyword: string,
    instance?: number,
    markupData?: KeywordMarkupData
) {
    const markInstanceOfUserMarkup = await lazyMarkInstanceOfUserMarkup.import();
    markInstanceOfUserMarkup(element, item, keyword, instance, markupData);
}

export async function removeUserMarkupEvents(elements: HTMLElement[]) {
    if (elements?.length > 0) {
        const removeUserMarkupPopupEventListener = await lazyRemoveUserMarkupPopupEventListener.import();
        elements.forEach(element => {
            removeUserMarkupPopupEventListener(element);
        });
    }
}

export default async function createUserMarkupReadingHandler(
    item: ClientItem,
    itemUserMarkupData: UserMarkup
): Promise<ContentHandler> {
    const itemUserHighlights: string[] = itemUserMarkupData?.userHighlightData || [];
    const itemUserNotes: UserNote[] = itemUserMarkupData?.userNoteData || [];

    const getItemUserMarkupKeywords = await lazyGetItemUserMarkupKeywords.import();
    const getItemUserMarkupMap = await lazyGetItemUserMarkupMap.import();

    const keywords = getItemUserMarkupKeywords(itemUserHighlights, itemUserNotes);
    const map = getItemUserMarkupMap(itemUserHighlights, itemUserNotes);

    return {
        cssSelector: null,
        keywords: keywords,
        handler: handleReadingExistingUserMarkups(item, map),
        undoHandler: removeUserMarkupEvents,
        markAccuracy: 'partially',
    };
}
