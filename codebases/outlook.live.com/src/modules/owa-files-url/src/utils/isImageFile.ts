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
    '.tiff',
    '.tif',
];

export default function isImageFile(fileName: string): boolean {
    if (!fileName) {
        return false;
    }

    let extension: string = null;
    const start: number = fileName.lastIndexOf('.');
    if (start > 0) {
        extension = fileName.substr(start).toLowerCase();
    }

    if (extension) {
        return imageFileExtensions.indexOf(extension.toLowerCase()) >= 0;
    }

    return false;
}
