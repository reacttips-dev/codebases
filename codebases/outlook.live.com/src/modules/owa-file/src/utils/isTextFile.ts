import getExtensionFromFileName from './getExtensionFromFileName';

const textFileExtensions: string[] = ['.txt', '.xml', '.log'];

export function isTextFile(fileName: string): boolean {
    const extension: string | null = getExtensionFromFileName(fileName);

    return isTextExtension(extension);
}

export function isTextExtension(extension: string | null) {
    if (extension) {
        return textFileExtensions.indexOf(extension.toLowerCase()) >= 0;
    }

    return false;
}
