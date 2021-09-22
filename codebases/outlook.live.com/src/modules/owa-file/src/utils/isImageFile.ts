import getExtensionFromFileName from './getExtensionFromFileName';
import tryGetExtensionFromFileType from './tryGetExtensionFromFileType';
import {
    isMac,
    isBrowserIE,
    isBrowserEdge,
    isBrowserEDGECHROMIUM,
    isBrowserSafari,
} from 'owa-user-agent/lib/userAgent';

const imageFileExtensions: string[] = [
    '.bmp',
    '.gif',
    '.jpe',
    '.jpeg',
    '.jpg',
    '.jfif',
    '.dib',
    '.png',
    '.psd',
];

const tiffFileExtensions: string[] = ['.tiff', '.tif'];

export default function isImageFile(
    fileName: string,
    fileType?: string,
    considerTiffAsImage: boolean = true
): boolean {
    // Sometimes, exchange server returns us the name like ATT00001, so it is necessary to check
    // for fileType as well if fileName does not contain the extension.
    // https://o365exchange.visualstudio.com/O365%20Core/_git/Substrate?version=GBmaster&path=/sources/dev/EdgeExtensibility/src/Core/EmailMessage/Attachment.cs
    const extension: string | undefined =
        getExtensionFromFileName(fileName) || tryGetExtensionFromFileType(fileType);

    return isImageExtension(extension, considerTiffAsImage);
}

export function isImageExtension(
    extension: string | undefined,
    considerTiffAsImage: boolean = true
): boolean {
    if (extension) {
        return (
            imageFileExtensions.indexOf(extension.toLowerCase()) >= 0 ||
            (considerTiffAsImage &&
                tiffFileExtensions.indexOf(extension.toLowerCase()) >= 0 &&
                isTiffSupported())
        );
    }

    return false;
}

// The Tiff image format support by browsers is taken from
// https://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support
function isTiffSupported(): boolean {
    return (
        isBrowserEdge() ||
        isBrowserEDGECHROMIUM() ||
        isBrowserSafari() ||
        (isBrowserIE() && !isMac())
    );
}
