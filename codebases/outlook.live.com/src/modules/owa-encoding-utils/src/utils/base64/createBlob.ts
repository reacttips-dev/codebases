import decode from './decode';
import { MIME_BINARY_FILE_CONTENT_TYPE, SLICE_SIZE } from './constants';

/**
 * Create blob object from base64 encoded string
 * @param base64Data The base64 encoded data
 * @param contentType The MIME content type
 */
export default function createBlob(
    base64Data: string,
    contentType = MIME_BINARY_FILE_CONTENT_TYPE
): Blob {
    const byteCharacters = decode(base64Data);
    if (!byteCharacters) {
        return null;
    }
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += SLICE_SIZE) {
        const slice = byteCharacters.slice(offset, offset + SLICE_SIZE);
        const byteNumbers = [];
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
}
