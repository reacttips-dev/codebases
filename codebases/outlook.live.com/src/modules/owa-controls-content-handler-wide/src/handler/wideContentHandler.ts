import type { ContentHandler } from 'owa-controls-content-handler-base';
import { INLINEIMAGE_ATTRIBUTE_LOADSTATUS } from 'owa-inline-image-consts';
import scaleElement, { undoScaleAllElements } from './scaleElement';

export const WIDE_CONTENT_HANDLER_NAME = 'wideContentHandler';
export const TABLE_TAG = 'table';
const IMG_TAG = 'img';

export class WideContentHandler implements ContentHandler {
    public readonly cssSelector = TABLE_TAG;
    public readonly keywords = null;

    private handlingContentTimer: any;
    private imagesInTables: HTMLImageElement[] = [];
    private tablesToProcess: HTMLElement[] = [];
    private scaleElementIntervalId: any;
    private availableWidth = 0;

    constructor(
        private waitAllImagesLoaded: boolean,
        private wideContentHostClassName: string,
        private scaleElementContainerClassName: string,
        private scaleElementsInterval: number,
        private isRTL: (element: HTMLElement) => boolean,
        private onScaleElement: (
            elementWrapper: HTMLElement,
            element: HTMLElement,
            scale: number
        ) => void,
        private onUndoScaleElement: (elementWrapper: HTMLElement) => void,
        private onAllElementsFinallyScaled: () => void,
        private traceError: (message: string) => void
    ) {}

    public readonly undoHandler = (elements: HTMLElement[]): void => {
        // reclaim resources
        if (this.handlingContentTimer) {
            clearTimeout(this.handlingContentTimer);
        }
        if (this.waitAllImagesLoaded) {
            if (this.scaleElementIntervalId) {
                clearInterval(this.scaleElementIntervalId);
            }
            this.imagesInTables.forEach(image => {
                image.removeEventListener('load', this.onImageComplete);
                image.removeEventListener('error', this.onImageComplete);
            });
        }

        // Undo scale
        undoScaleAllElements(
            elements,
            this.scaleElementContainerClassName,
            this.wideContentHostClassName,
            this.onUndoScaleElement
        );
    };

    public readonly doneHandlingMatchedElements = (
        tables: HTMLElement[],
        htmlContentRef?: HTMLElement
    ): void => {
        if (tables.length > 0) {
            if (this.handlingContentTimer) {
                clearTimeout(this.handlingContentTimer);
            }
            // Delay the wide content handler to avoid forced reflow by getting clientwidth.
            this.handlingContentTimer = setTimeout(() => {
                this.handlingContentTimer = null;

                this.tablesToProcess = tables;
                this.availableWidth = htmlContentRef ? htmlContentRef.clientWidth : 0;
                this.filterMatchedDescendants(tables, TABLE_TAG);
                this.imagesInTables = this.getImagesInTables(tables);
                if (this.waitAllImagesLoaded) {
                    this.imagesInTables.forEach(image => {
                        image.addEventListener('load', this.onImageComplete);
                        image.addEventListener('error', this.onImageComplete);
                    });

                    // Process tables each {this.scaleElementsInterval}ms so user can view the latest content in tables at a proper scale
                    if (this.scaleElementIntervalId) {
                        clearInterval(this.scaleElementIntervalId);
                    }
                    this.scaleElementIntervalId = setInterval(() => {
                        this.checkImageStatus(true);
                    }, this.scaleElementsInterval);

                    // Scale tables incase table has fixed width
                    this.checkImageStatus(true);
                } else {
                    // We want to process tables, but before that,
                    // if there're images inside tables, we need to wait for images to finish loading.
                    // else process tables directly.
                    if (this.imagesInTables.length > 0) {
                        this.processImages();
                    } else {
                        this.processTables();
                    }
                }
            }, 0);
        } else {
            this.onAllElementsFinallyScaled();
        }
    };

    private processImages = (startTime?: number): void => {
        try {
            if (!startTime) {
                startTime = new Date().getTime();
            }
            let imgPendingCount = this.imagesInTables.length;
            for (let i = 0; i < this.imagesInTables.length; i++) {
                let img = this.imagesInTables[i];
                if (
                    !img ||
                    !img.src ||
                    // !(OWA pending inline image) && image complete
                    // The presence of INLINEIMAGE_ATTRIBUTE_LOADSTATUS (data-loadstatus)
                    // indicates the image is being loaded
                    (!img.getAttribute(INLINEIMAGE_ATTRIBUTE_LOADSTATUS) && img.complete)
                ) {
                    imgPendingCount--;
                }
            }

            if (imgPendingCount == 0 || new Date().getTime() - startTime >= 2000) {
                // safety net: if after 2s, still not all images have finished loading
                // just process the tables.
                this.processTables();
            } else {
                window.requestAnimationFrame(() => {
                    this.processImages(startTime);
                });
            }
        } catch (e) {
            // VSO #25782. IE/Edge appear to choke on this method for an unknown reason. Swallow the exception to avoid component errors.
            this.traceError('Error processing images in wideContentHandler: ' + e);
        }
    };

    private processTables = (): void => {
        for (let i = 0; i < this.tablesToProcess.length; i++) {
            scaleElement(
                this.tablesToProcess[i],
                this.availableWidth,
                this.isRTL,
                this.scaleElementContainerClassName,
                this.onScaleElement
            );
        }
    };

    private filterMatchedDescendants = (elements: HTMLElement[], tagName: string): void => {
        let curIndex = 0;
        while (elements.length > 0 && curIndex < elements.length) {
            let matchedDescendants = elements[curIndex].querySelectorAll(tagName);
            for (let i = 0; i < matchedDescendants.length; i++) {
                let index = elements.indexOf(matchedDescendants[i] as HTMLElement);
                if (index >= 0) {
                    // index may not exist if it has been removed before by another ancestor
                    elements.splice(index, 1); // Remove matched descendants in original array
                    if (index < curIndex) {
                        curIndex--;
                    }
                }
            }
            curIndex++;
        }
    };

    private getImagesInTables = (tables: HTMLElement[]): HTMLImageElement[] => {
        let images: HTMLElement[] = [];
        for (let i = 0; i < tables.length; i++) {
            let table = tables[i];
            let imageDescendants = table.querySelectorAll(IMG_TAG);
            for (let j = 0; j < imageDescendants.length; j++) {
                images.push(imageDescendants[j]);
            }
        }
        return images as HTMLImageElement[];
    };

    private onImageComplete = () => {
        // Delay check image status so INLINEIMAGE_ATTRIBUTE_LOADSTATUS is updated
        setTimeout(() => {
            this.checkImageStatus(false);
        }, 0);
    };

    private checkImageStatus = (forceScale: boolean) => {
        try {
            let imgPendingCount = this.imagesInTables.length;
            for (let i = 0; i < this.imagesInTables.length; i++) {
                let img = this.imagesInTables[i] as HTMLImageElement;
                if (
                    !img ||
                    !img.src ||
                    // !(OWA pending inline image) && image complete
                    // The presence of INLINEIMAGE_ATTRIBUTE_LOADSTATUS (data-loadstatus)
                    // indicates the image is being loaded
                    (!img.getAttribute(INLINEIMAGE_ATTRIBUTE_LOADSTATUS) && img.complete)
                ) {
                    imgPendingCount--;
                }
            }
            if (imgPendingCount === 0) {
                this.processTables();
                if (this.scaleElementIntervalId) {
                    clearInterval(this.scaleElementIntervalId);
                }
                this.onAllElementsFinallyScaled();
            } else if (forceScale) {
                this.processTables();
            }
        } catch (e) {
            this.traceError('Error checkImageStatus in wideContentHandler: ' + e);
        }
    };
}
