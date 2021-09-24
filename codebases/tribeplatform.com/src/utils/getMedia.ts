import { largeSizes, sizes } from '../theme/foundations/sizes';
const allSizeNames = Object.keys(largeSizes);
const sizeEntries = Object.entries(sizes.container);
const sizeNameMap = {
    xs: 'thumb',
    sm: 'small',
    md: 'medium',
    lg: 'large',
    full: 'full',
};
/**
 * Finds the closest matching URL for a given size name
 *
 * @param size - size to fit
 * @param urls - Media type's "urls" object
 */
function getClosestSizeURL(size, urls) {
    switch (size) {
        case 'xs':
        case 'sm':
        case 'md':
        case 'lg':
        case 'full':
            return urls[sizeNameMap[size]];
        default:
            // If requested size is smaller than "sm", return "thumb"
            if (allSizeNames.indexOf(size) < allSizeNames.indexOf('sm')) {
                return urls.thumb;
            }
            // Otherwise return the full size
            return urls.full;
    }
}
/**
 * Tries to find the closest size to the given
 * number of pixels
 *
 * @param requestedPX - number of approximate pixels
 * @param urls - Media type's "urls" object
 */
function getLargestAvailableImageURL(requestedPX, urls) {
    for (let i = 0; i < sizeEntries.length; i++) {
        const [size, px] = sizeEntries[i];
        const matchedSizeURL = urls[sizeNameMap[size]];
        // If requested pixels are matching current pixels
        if (requestedPX <= parseInt(px, 10) && matchedSizeURL) {
            return matchedSizeURL;
        }
    }
    const availableSizeNames = Object.keys(urls);
    const largestSizeName = availableSizeNames[availableSizeNames.length - 1];
    if (largestSizeName)
        return urls[largestSizeName];
}
/**
 * Walks through all the variations that the media
 * has and finds the one that fits the most to the
 * given size or dimensions
 *
 * @param media - Image media to read the props from
 * @param options - size or dimensions to fit
 */
export function getMediaURL(media, { size, dimensions: { w, h } = {} } = {}) {
    if (!media)
        return null;
    if (media.__typename === 'Emoji') {
        return media.text;
    }
    const { urls, url } = media;
    // If size URLs weren't passed, return main URL
    if (!urls && url) {
        return url;
    }
    // If no main URL and no size URLs were passed
    if (!url && !urls) {
        return null;
    }
    // If size is valid
    if (size) {
        const requestedSize = urls[sizeNameMap[size]];
        if (requestedSize)
            return requestedSize;
        // If the given size is valid, return largest size
        if (largeSizes[size]) {
            return getClosestSizeURL(size, urls);
        }
    }
    // Check if specific width was requested
    if (w) {
        const largestWidth = getLargestAvailableImageURL(w, urls);
        if (largestWidth)
            return largestWidth;
    }
    // Check if specific height was requested
    if (h) {
        const largestHeight = getLargestAvailableImageURL(h, urls);
        if (largestHeight)
            return largestHeight;
    }
    return url;
}
const toDataURL = url => {
    return fetch(url)
        .then(response => {
        return response.blob();
    })
        .then(blob => {
        return URL.createObjectURL(blob);
    });
};
export const downloadImage = async (src) => {
    try {
        const a = document.createElement('a');
        a.href = await toDataURL(src);
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error while downloading image', e.message);
    }
};
//# sourceMappingURL=getMedia.js.map