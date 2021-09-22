import { action } from 'satcheljs';
import type WacUrlInfo from 'owa-attachment-wac/lib/types/WacUrlInfo';
import type { ClientItemId } from 'owa-client-ids';

export const tryQueueGetWacInfo = action('tryQueueGetWacInfo', (url: string) => ({
    url,
}));

export const queueGetWacInfo = action('queueGetWacInfo', (url: string) => ({
    url,
}));

export const processGetWacInfoQueue = action('processGetWacInfoQueue');
export const getWacInfoQueueShift = action('getWacInfoQueueShift');

export const onStartGetWacInfoOperation = action('onStartGetWacInfoOperation', (url: string) => ({
    url,
}));
export const onFinishGetWacInfoOperation = action('onFinishGetWacInfoOperation', (url: string) => ({
    url,
}));

export const pushSupressedUrl = action('pushSupressedUrl', (url: string) => ({
    url,
}));

export const onGetWacInfoSuccess = action(
    'onGetWacInfoSuccess',
    (url: string, wacUrlInfo: WacUrlInfo | null, needRedeem?: boolean) => ({
        url,
        wacUrlInfo,
        needRedeem,
    })
);

export const addGenericLinkClickListener = action(
    'addGenericLinkClickListener',
    (element: HTMLElement, isSafeLinkWrapped: boolean, isSafeLinkVerified: boolean) => ({
        element,
        isSafeLinkWrapped,
        isSafeLinkVerified,
    })
);

export const addOpenDocumentPreviewEventListener = action(
    'addOpenDocumentPreviewEventListener',
    (
        element: HTMLElement,
        href: string,
        itemId: ClientItemId,
        isSafeLinkWrapped: boolean,
        isSafeLinkVerified: boolean,
        isOfficeSPLink: boolean
    ) => ({
        element,
        href,
        itemId,
        isSafeLinkWrapped,
        isSafeLinkVerified,
        isOfficeSPLink,
    })
);
