import { OfficeOnlineApp } from '../types/OfficeOnlineApp';

/**
 * Get the office online app which supports the extension. If none found then it returns null
 * @param extension The extension to check if its supported by office online app and which one
 * @return Which office online app is the extension related to otherwise null
 */
export function getOfficeOnlineAppFromExtension(extension: string): OfficeOnlineApp | null {
    switch (extension) {
        case '.doc':
        case '.docm':
        case '.docx':
        case '.dot':
        case '.dotm':
        case '.dotx':
        case '.odt':
        case '.rtf':
            return OfficeOnlineApp.Word;
        case '.csv':
        case '.ods':
        case '.xls':
        case '.xlsb':
        case '.xlsm':
        case '.xlsx':
            return OfficeOnlineApp.Excel;
        case '.odp':
        case '.pot':
        case '.potm':
        case '.potx':
        case '.pps':
        case '.ppsm':
        case '.ppsx':
        case '.ppt':
        case '.pptm':
        case '.pptx':
            return OfficeOnlineApp.PowerPoint;
        default:
            return null;
    }
}
