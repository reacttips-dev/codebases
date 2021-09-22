import { logUsage } from 'owa-analytics';
import { lazyPreviewImageInSxS } from 'owa-attachment-preview-sxs-actions';
import { getAttachmentUrlForClassic } from 'owa-attachment-url';
import type { ClientAttachmentId, ClientItemId } from 'owa-client-ids';
import type { ContentHandler } from 'owa-controls-content-handler-base';
import AttachmentUrlType from 'owa-files-url/lib/schema/AttachmentUrlType';
import getMailboxInfoFromImageElement from 'owa-inline-image-loader/lib/utils/getMailboxInfoFromImageElement';
import type { ImageGalleryItem } from 'owa-sxsdata';
import { INLINEIMAGE_ATTRIBUTE_DATA_CUSTOM } from 'owa-inline-image-consts';

const DOCUMENT_NODE_TYPE = 9;
const CLICK_EVENT_NAME = 'click';
const ATTRIBUTE_ITEMID = 'data-itemid';

export const EVENT_KEY = 'imageSxS.evts';

// The define the max depth level in looking up for anchor tag
const ANCHORTAG_SEARCH_DEPTH_LEVEL = 5;

// Only care about inline image backed up attachment. In other words, images that have a data-custom attribute
const IMAGESXS_HANDLER_SELECTOR = `img[${INLINEIMAGE_ATTRIBUTE_DATA_CUSTOM}]`;

export const IMAGESXS_HANDLER_NAME = 'imageSxSHandler';

const ImageSxSClickedEventName = 'ImageSxSClicked';

function doneProcessingImages(elements: HTMLElement[]) {
    if (elements && elements.length > 0) {
        const imageGallery: ImageGalleryItem[] = [];
        elements.forEach((element: HTMLElement) => {
            const imageGalleryItem = prepareImageGalleryItemFromImageElement(
                element as HTMLImageElement
            );
            const dataItemId = element.getAttribute(ATTRIBUTE_ITEMID);
            const itemId: ClientItemId = dataItemId
                ? {
                      Id: decodeURIComponent(dataItemId),
                      mailboxInfo: getMailboxInfoFromImageElement(
                          element as HTMLImageElement,
                          null /* userIdentity*/
                      ),
                  }
                : null;

            if (imageGalleryItem) {
                imageGallery.push(imageGalleryItem);

                // Skip adding handler if the image is wrapped in an anchor tag
                if (!isElementWrappedInAnchorTag(element)) {
                    element.style.cursor = 'pointer';
                    const clickHandler: () => void = () => {
                        // Trigger preview.
                        lazyPreviewImageInSxS.import().then(previewImageInSxS => {
                            previewImageInSxS(
                                imageGalleryItem,
                                imageGallery.splice(0),
                                itemId,
                                element
                            );
                        });

                        // Log the user click event.
                        logUsage(ImageSxSClickedEventName, [imageGallery.length /* imageCount */]);
                    };

                    // Remember the listener added on the element so that it can be removed later
                    element.addEventListener(CLICK_EVENT_NAME, clickHandler);
                    element[EVENT_KEY] = clickHandler;
                }
            }
        });
    }
}

function undoProcessImages(elements: HTMLElement[]) {
    if (elements && elements.length > 0) {
        elements.forEach((element: HTMLElement) => {
            const clickHandler: any = element[EVENT_KEY];
            if (clickHandler) {
                element.removeEventListener(CLICK_EVENT_NAME, clickHandler);
                element[EVENT_KEY] = null;
            }
        });
    }
}

function prepareImageGalleryItemFromImageElement(imageElement: HTMLImageElement): ImageGalleryItem {
    const dataCustom = imageElement.getAttribute(INLINEIMAGE_ATTRIBUTE_DATA_CUSTOM);
    if (dataCustom && dataCustom.length > 0) {
        // TODO: Consider IMAGEPREVIEW_MIN_WIDTH_HEIGHT = 50 for enabling SxS
        // This likely runs before inlineimageloader so we don't have dimention
        // unless we create some level of dependency to InineImageLoader.cs
        const attachmentId: ClientAttachmentId = {
            Id: decodeURIComponent(dataCustom),
            mailboxInfo: getMailboxInfoFromImageElement(imageElement, null /* userIdentity*/),
        };

        const previewUrl = getAttachmentUrlForClassic(attachmentId, AttachmentUrlType.Preview);
        const thumbnailUrl = getAttachmentUrlForClassic(attachmentId, AttachmentUrlType.Thumbnail);
        const downloadUrl = getAttachmentUrlForClassic(
            attachmentId,
            AttachmentUrlType.FullFile,
            true /* addIsDownloadQueryParam */
        );

        return {
            id: attachmentId,
            downloadUrl: downloadUrl,
            previewUrl: previewUrl,
            thumbnailUrl: thumbnailUrl,
        };
    } else {
        return null;
    }
}

function isElementWrappedInAnchorTag(element: HTMLElement): boolean {
    let parentElement = element!.parentElement;
    let depth = 1;
    while (
        parentElement &&
        parentElement.nodeType != DOCUMENT_NODE_TYPE &&
        depth <= ANCHORTAG_SEARCH_DEPTH_LEVEL
    ) {
        if (parentElement.tagName.toLowerCase() == 'a') {
            return true;
        }
        parentElement = parentElement.parentElement;
        depth++;
    }

    return false;
}

const imageSxSHandler: ContentHandler = {
    cssSelector: IMAGESXS_HANDLER_SELECTOR,
    keywords: null,
    doneHandlingMatchedElements: doneProcessingImages,
    undoHandler: undoProcessImages,
};

export default imageSxSHandler;
