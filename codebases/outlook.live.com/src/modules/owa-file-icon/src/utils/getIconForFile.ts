import getCDNIconUrl from './getCDNIconUrl';
import getFileSpriteIconClass from './getFileSpriteIconClass';
import { getExtensionFromFileName } from 'owa-file';

/**
 * Important Notes:
 * When adding a new FileIcon, we need to add extraSmall, small and medium icons into sprite icons.
 * Developers need to change Chicago code to upload cdn icons into CDN or pass true as useGenericCDNIcon.
 */

export interface FileIcon {
    extraSmall: string; // The sprite icon css for extra small size
    small: string; // The sprite icon css for small size
    medium: string; // The sprite icon css for medium size
    large: string; // The sprite icon css for large size
    cdn: string; // The cnd icon url
}

const fileIconMap: { [key: string]: FileIcon } = {};
export function getFileIconFromSprite(iconName: string): FileIcon {
    if (iconName in fileIconMap) {
        return fileIconMap[iconName];
    }

    fileIconMap[iconName] = {
        extraSmall: getFileSpriteIconClass(`${iconName}_16x16`),
        small: getFileSpriteIconClass(`${iconName}_20x20`),
        medium: getFileSpriteIconClass(`${iconName}_32x32`),
        large: getFileSpriteIconClass(`${iconName}_64x64`),
        cdn: getCDNIconUrl(`${iconName}_16x16`),
    };

    return fileIconMap[iconName];
}

let folderIcon: FileIcon;
function getFolderIcon(): FileIcon {
    folderIcon = folderIcon || {
        extraSmall: null, // There is no extra small icon available for folder
        small: getFileSpriteIconClass('folder_20x20'),
        medium: getFileSpriteIconClass('folder_32x32'),
        large: getFileSpriteIconClass('folder_64x64'),
        cdn: getCDNIconUrl('folder_16x16'),
    };
    return folderIcon;
}

const accessFileExtension = 'accdb';
const audioFileExtension = 'audio';
const calendarFileExtension = 'calendar';
const codeFileExtension = 'code';
const csvFileExtension = 'csv';
const excelFileExtension = 'xlsx';
const excelTemplateFileExtension = 'xltx';
const exeFileExtension = 'exe';
const genericFileExtension = 'generic';
const gdocFileExtension = 'gdoc';
const gformFileExtension = 'gform';
const gsheetFileExtension = 'gsheet';
const gslideFileExtension = 'gslide';
const infopathFileExtension = 'infopath';
const linkFileExtension = 'link';
const msgFileExtension = 'email';
const oneFileExtension = 'one';
const onepkgFileExtension = 'onetoc';
const pblshFileExtension = 'pblsh';
const pdfFileExtension = 'pdf';
const photoFileExtension = 'photo';
const powerpointFileExtension = 'pptx';
const powerpointTemplateFileExtension = 'potx';
const powerpointSlideShowFileExtension = 'ppsx';
const projectFileExtension = 'project';
const projectTemplateFileExtension = 'mpt';
const rpmsgFileExtension = 'rpmsg';
const txtFileExtension = 'txt';
const vectorFileExtension = 'vector';
const videoFileExtension = 'video';
const visioDrawingFileExtension = 'vsdx';
const visioStencilFileExtension = 'vssx';
const visioTemplateFileExtension = 'vstx';
const wordFileExtension = 'docx';
const wordTemplateFileExtension = 'dotx';
const zipFileExtension = 'zip';

const wellKnownFileIconMap: { [key: string]: string } = Object.freeze({
    '.3g2': videoFileExtension,
    '.3gp': videoFileExtension,
    '.aac': audioFileExtension,
    '.accdb': accessFileExtension,
    '.accdc': accessFileExtension,
    '.accde': accessFileExtension,
    '.accdr': accessFileExtension,
    '.accdt': accessFileExtension,
    '.acs': accessFileExtension,
    '.ai': vectorFileExtension,
    '.aiff': audioFileExtension,
    '.ape': audioFileExtension,
    '.apk': exeFileExtension,
    '.application': exeFileExtension,
    '.app': exeFileExtension,
    '.appref-ms': exeFileExtension,
    '.appx': exeFileExtension,
    '.asf': videoFileExtension,
    '.aspx': codeFileExtension,
    '.asx': videoFileExtension,
    '.avi': videoFileExtension,
    '.bmp': photoFileExtension,
    '.csv': csvFileExtension,
    '.dib': photoFileExtension,
    '.dgn': vectorFileExtension,
    '.doc': wordFileExtension,
    '.docm': wordFileExtension,
    '.docx': wordFileExtension,
    '.dot': wordTemplateFileExtension,
    '.dotm': wordFileExtension,
    '.dotx': wordTemplateFileExtension,
    '.email': msgFileExtension,
    '.emf': vectorFileExtension,
    '.eml': msgFileExtension,
    '.eps': vectorFileExtension,
    '.exe': exeFileExtension,
    '.flac': audioFileExtension,
    '.flv': videoFileExtension,
    '.gdraw': vectorFileExtension,
    '.gif': photoFileExtension,
    '.htm': codeFileExtension,
    '.html': codeFileExtension,
    '.ical': calendarFileExtension,
    '.icalendar': calendarFileExtension,
    '.ico': photoFileExtension,
    '.ics': calendarFileExtension,
    '.indd': vectorFileExtension,
    '.indt': vectorFileExtension,
    '.ipa': exeFileExtension,
    '.jfif': photoFileExtension,
    '.jpe': photoFileExtension,
    '.jpeg': photoFileExtension,
    '.jpg': photoFileExtension,
    '.log': txtFileExtension,
    '.lync': genericFileExtension,
    '.m1v': videoFileExtension,
    '.m4a': audioFileExtension,
    '.mdb': accessFileExtension,
    '.mht': codeFileExtension,
    '.mov': videoFileExtension,
    '.mp2': audioFileExtension,
    '.mp3': audioFileExtension,
    '.mp4': videoFileExtension,
    '.mpa': audioFileExtension,
    '.mpe': videoFileExtension,
    '.mpeg': videoFileExtension,
    '.mpg': videoFileExtension,
    '.mpp': projectFileExtension,
    '.mpt': projectTemplateFileExtension,
    '.mpv2': videoFileExtension,
    '.msg': msgFileExtension,
    '.msi': exeFileExtension,
    '.odp': powerpointFileExtension,
    '.ods': excelFileExtension,
    '.odt': wordFileExtension,
    '.ogg': audioFileExtension,
    '.one': oneFileExtension,
    '.onepkg': onepkgFileExtension,
    '.onetoc': onepkgFileExtension,
    '.onetoc2': onepkgFileExtension,
    '.oxps': vectorFileExtension,
    '.pd': vectorFileExtension,
    '.pdf': pdfFileExtension,
    '.plt': vectorFileExtension,
    '.png': photoFileExtension,
    '.pot': powerpointFileExtension,
    '.potm': powerpointFileExtension,
    '.potx': powerpointTemplateFileExtension,
    '.ppa': powerpointFileExtension,
    '.ppam': powerpointFileExtension,
    '.pps': powerpointFileExtension,
    '.ppsm': powerpointFileExtension,
    '.ppsx': powerpointSlideShowFileExtension,
    '.ppt': powerpointFileExtension,
    '.pptm': powerpointFileExtension,
    '.pptx': powerpointFileExtension,
    '.pro': vectorFileExtension,
    '.ps': vectorFileExtension,
    '.psd': photoFileExtension,
    '.pub': pblshFileExtension,
    '.rpmsg': rpmsgFileExtension,
    '.rtf': txtFileExtension,
    '.sketch': vectorFileExtension,
    '.srt': videoFileExtension,
    '.svg': vectorFileExtension,
    '.svgz': vectorFileExtension,
    '.swf': videoFileExtension,
    '.tif': photoFileExtension,
    '.tiff': photoFileExtension,
    '.txt': txtFileExtension,
    '.url': linkFileExtension,
    '.vcs': calendarFileExtension,
    '.vdx': visioDrawingFileExtension,
    '.vob': videoFileExtension,
    '.vsd': visioDrawingFileExtension,
    '.vsdx': visioDrawingFileExtension,
    '.vsl': visioDrawingFileExtension,
    '.vss': visioDrawingFileExtension,
    '.vssx': visioStencilFileExtension,
    '.vst': visioTemplateFileExtension,
    '.vstx': visioTemplateFileExtension,
    '.wav': audioFileExtension,
    '.webm': videoFileExtension,
    '.wm': audioFileExtension,
    '.wma': audioFileExtension,
    '.wmd': videoFileExtension,
    '.wmf': vectorFileExtension,
    '.wms': videoFileExtension,
    '.wmv': videoFileExtension,
    '.wmz': videoFileExtension,
    '.wps': wordFileExtension,
    '.wri': wordFileExtension,
    '.xap': exeFileExtension,
    '.xcl': excelFileExtension,
    '.xd': vectorFileExtension,
    '.xla': excelFileExtension,
    '.xlam': excelFileExtension,
    '.xls': excelFileExtension,
    '.xlsb': excelFileExtension,
    '.xlsm': excelFileExtension,
    '.xlsx': excelFileExtension,
    '.xlt': excelFileExtension,
    '.xltm': excelFileExtension,
    '.xltx': excelTemplateFileExtension,
    '.xml': codeFileExtension,
    '.xps': vectorFileExtension,
    '.xsn': infopathFileExtension,
    '.zip': zipFileExtension,
});

const wellKnownItemIconMimeTypeMap: {
    [key: string]: string;
} = Object.freeze({
    'application/vnd.google-apps.document': gdocFileExtension,
    'application/vnd.google-apps.spreadsheet': gsheetFileExtension,
    'application/vnd.google-apps.presentation': gslideFileExtension,
    'application/vnd.google-apps.form': gformFileExtension,
    'application/onenote': oneFileExtension,
    'application/pdf': pdfFileExtension,
});

export function getConvertedExtension(fileName: string, mimeType?: string): string | undefined {
    let convertedExtension: string | undefined = undefined;

    const fileExtension = getExtensionFromFileName(fileName);

    if (fileExtension) {
        convertedExtension = wellKnownFileIconMap[fileExtension.toLowerCase()];
    }

    if (!convertedExtension && mimeType && mimeType in wellKnownItemIconMimeTypeMap) {
        convertedExtension = wellKnownItemIconMimeTypeMap[mimeType];
    }

    return convertedExtension;
}

/* Get icon for file */
export default function getIconForFile(
    fileName: string,
    isFolder: boolean = false,
    mimeType?: string
): FileIcon {
    if (isFolder) {
        return getFolderIcon();
    }

    const convertedExtension = getConvertedExtension(fileName, mimeType);

    if (convertedExtension) {
        return getFileIconFromSprite(convertedExtension);
    }

    // If the extension exists in the well known types then return that icon else a generic icon
    return getFileIconFromSprite(genericFileExtension);
}
