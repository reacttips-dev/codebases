export default function tryGetExtensionFromFileType(
    fileType: string | undefined
): string | undefined {
    return getImageExtension(fileType || '');
}

/**
 * The below entries are curated from :
 * https://github.com/jshttp/mime-db/blob/master/db.json
 * Only these are relevant for inline image cases which we have.
 * Feel free to add other types if the scope of this utility increases for other types
 */
const mimeDb = {
    'image/bmp': '.bmp',
    'image/x-ms-bmp': '.bmp',
    'image/gif': '.gif',
    'image/jpeg': '.jpeg',
    'image/png': '.png',
    'image/vnd.adobe.photoshop': '.psd',
    'image/tiff': '.tiff',
};

const EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;

/**
 * Get file extension from mimeType
 * The util is a shortened version of the extension method present at :
 * https://github.com/jshttp/mime-types/blob/master/index.js
 * Adding the "mime-types" library causes major size increase, hence we are extracting this method out of it
 * @param mimeType
 */
function getImageExtension(mimeType: string): string | undefined {
    const match = EXTRACT_TYPE_REGEXP.exec(mimeType);
    // Eg: if mimeType is image/gif:base64, then match would be of the format
    // ["image/gif", "image/gif", index: 0, input: "image/gif", groups: undefined]
    return match && match.length > 1 && mimeDb[match[1].toLowerCase()];
}

export function getMimeTypeFromExtension(fileExtension: string): string {
    let mimeType: string = '';
    Object.entries(mimeDb).forEach(mime => {
        if (mime[1] === fileExtension) {
            mimeType = mime[0];
        }
    });
    return mimeType;
}
