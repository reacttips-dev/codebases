import tryCreateDataURIFromImage from './tryCreateDataURIFromImage';
import inlineImageStore from '../store/store';
import { logUsage } from 'owa-analytics';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

const CONTENT_TYPE_ATTRIBUTE_NAME = 'contenttype';
const FIREFOX_BROWSER_NAME = 'firefox';
const GIF_CONTENT_TYPE_NAME = 'gif';
const IMAGE_TAG_NAME = 'img';
const ORIGINAL_SRC_ATTRIBUTE_NAME = 'originalsrc';
const RESTORE_IMAGE_CALLBACK_TIMEOUT_LENGTH = 500;
const SOURCE_ATTRIBUTE_NAME = 'src';
const USER_SELECT_ALL_VALUE = 'all';
const USER_SELECT_NONE_VALUE = 'none';

interface ImageToRestore {
    image: HTMLImageElement;
    sourceToRestore: string;
    shouldSetUserSelectNone: boolean;
}

class ImageCopyHandler {
    private imagesToRestore: ImageToRestore[];

    constructor() {
        this.imagesToRestore = [];
    }

    public dispose() {
        this.imagesToRestore = null;
    }

    public handleCopy(images: HTMLImageElement[]) {
        // Iterate over the array of images and try to create dataURIs for those that have attachment download links for their source.
        // If we're able to create one, replace the src on the image so pasting elsewhere will render correctly.
        const length = images.length;
        const isFirefox = navigator.userAgent.toLowerCase().indexOf(FIREFOX_BROWSER_NAME) > -1;

        // Attachment code has logic to fall back to the window's origin. Check both URLs.
        const downloadUrlBase = getUserConfiguration().ApplicationSettings.DownloadUrlBase;
        const fallbackURL = window.location.origin;
        for (let idx = 0; idx < length; idx++) {
            const image = images[idx] as HTMLImageElement;
            const imageSrc = image.getAttribute(SOURCE_ATTRIBUTE_NAME);
            if (
                imageSrc &&
                (imageSrc.indexOf(downloadUrlBase) == 0 || imageSrc.indexOf(fallbackURL) == 0)
            ) {
                const originalSrc = image.getAttribute(ORIGINAL_SRC_ATTRIBUTE_NAME);

                // First try to get the dataURI from the store, if we don't have it, try to create one now.
                let dataURI = inlineImageStore.inlineImages[originalSrc];
                if (!dataURI) {
                    dataURI = tryCreateDataURIFromImage(image);
                }
                if (dataURI) {
                    let gifSource: string = null;
                    let shouldSetUserSelectNone = false;

                    const contentType = image.getAttribute(CONTENT_TYPE_ATTRIBUTE_NAME);
                    if (contentType && contentType.indexOf(GIF_CONTENT_TYPE_NAME) != -1) {
                        // If this image is a gif, assume it's animated and save its src to restore later.
                        // Note: Currently, contenttype is only stamped on the image for compose. Copying gifs from the reading pane will not be detected.
                        // This results in the gif animation stopping until the next time it is loaded.
                        gifSource = imageSrc;
                    }

                    if (isFirefox && image.style.webkitUserSelect == USER_SELECT_NONE_VALUE) {
                        // If this is firefox and the image has userSelect = 'none', we need to temporarily replace it with 'all' to actually copy the image.
                        image.style.webkitUserSelect = USER_SELECT_ALL_VALUE;
                        shouldSetUserSelectNone = true;
                    }

                    if (gifSource || shouldSetUserSelectNone) {
                        this.imagesToRestore.push({
                            image: image,
                            sourceToRestore: gifSource,
                            shouldSetUserSelectNone: shouldSetUserSelectNone,
                        } as ImageToRestore);
                    }

                    image.removeAttribute(ORIGINAL_SRC_ATTRIBUTE_NAME);
                    image.src = dataURI;
                } else {
                    // If the dataURI is still null at this point, log this occurrence.
                    logUsage('ImageCopyHandlerNullDataURI');
                }
            }
        }

        if (this.imagesToRestore.length > 0) {
            setTimeout(this.restoreImageAttributes, RESTORE_IMAGE_CALLBACK_TIMEOUT_LENGTH);
        }
    }

    private restoreImageAttributes = () => {
        if (this.imagesToRestore) {
            let imageToRestore = this.imagesToRestore.pop();

            while (imageToRestore) {
                const { image, sourceToRestore, shouldSetUserSelectNone } = imageToRestore;
                if (sourceToRestore) {
                    image.src = sourceToRestore;
                }
                if (shouldSetUserSelectNone) {
                    image.style.webkitUserSelect = USER_SELECT_NONE_VALUE;
                }
                imageToRestore = this.imagesToRestore.pop();
            }
        }
    };
}

let imageCopyHandler: ImageCopyHandler;
export function handleImageCopy(target: HTMLDivElement | HTMLImageElement[]): void {
    if (!imageCopyHandler) {
        imageCopyHandler = new ImageCopyHandler();
    }

    const images = Array.isArray(target)
        ? target
        : Array.prototype.slice.call(target.getElementsByTagName(IMAGE_TAG_NAME));
    imageCopyHandler.handleCopy(images);
}

export function cleanupImageCopyHandler(): void {
    if (imageCopyHandler) {
        imageCopyHandler.dispose();
        imageCopyHandler = null;
    }
}
