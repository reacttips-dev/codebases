import { logUsage } from 'owa-analytics';

const CANVAS_2D_CONTEXT_TYPE = '2d';
const CANVAS_ELEMENT_NAME = 'canvas';
const DATA_URL_TYPE = 'image/png';

export default function tryCreateDataURIFromImage(imgElement: HTMLImageElement): string {
    try {
        const canvas = document.createElement(CANVAS_ELEMENT_NAME);

        // First try to use the natural width and height of the image.
        let width = imgElement.naturalWidth;
        let height = imgElement.naturalHeight;
        if (!(width > 0 && height > 0)) {
            // If either natural dimension is 0, use the normal dimensions and log this occurrence.
            logUsage('CreateDataURIMissingNaturalDimensions');
            width = imgElement.width;
            height = imgElement.height;
        }

        if (width > 0 && height > 0) {
            canvas.width = width;
            canvas.height = height;
            canvas.getContext(CANVAS_2D_CONTEXT_TYPE).drawImage(imgElement, 0, 0);
            return canvas.toDataURL(DATA_URL_TYPE);
        }
    } catch (ex) {
        // Just assume the operation is not successful and a null will be retured in the end
    }

    return null;
}
