import { getOwaUrlWithAddedQueryParameters } from './getOwaUrlWithAddedQueryParameters';

export default function getTaskItemReadDeepLinkUrl(itemId: string): string {
    let popoutQuerystringProps = {
        viewmodel: 'TaskReadingPaneViewModelPopOutFactory',
        ItemID: encodeURIComponent(itemId),
        ispopout: '1',
    };

    return getOwaUrlWithAddedQueryParameters(popoutQuerystringProps);
}
