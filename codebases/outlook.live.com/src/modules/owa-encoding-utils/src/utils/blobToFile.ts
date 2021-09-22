/**
 * Utility to convert blob to file
 * @param blob
 * @param fileName
 */
export default function blobToFile(blob: Blob, fileName: string): File {
    if (!blob) {
        return null;
    }
    // new File constructor is not supported in IE and Edge, hence using typecasting
    let file: any = blob;
    file.name = fileName;
    file.lastModified = new Date();
    return <File>file;
}
