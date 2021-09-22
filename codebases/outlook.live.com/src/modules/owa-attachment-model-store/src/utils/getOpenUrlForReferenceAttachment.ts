import { isStringNullOrWhiteSpace } from 'owa-localize';
import { ONE_DRIVE_PRO } from 'owa-attachment-constants/lib/fileProviders';
import { isGuestUrlPermissionLevel } from 'owa-attachment-permission';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';

function formatSharePointMySiteHostUrl(url: string) {
    if (isStringNullOrWhiteSpace(url)) {
        return null;
    }

    url = url.trim();
    if (url[url.length - 1] != '/') {
        url += '/';
    }

    return url;
}

export function tryReplaceSchemeAndServerInUrl(
    originalUrl: string,
    replacementUrl: string
): string {
    // Regex to match various components of a URL. Following are the components at index
    // [1] - Scheme e.g. http or https
    // [2] - Host name e.g. microsoft.com
    // [3] - Port number e.g. 8080
    // [4] - Rest of the path and query e.g. /some/path , /some/path?query=get
    const re = new RegExp('^(https?)\\:[\\/\\\\]{2}([\\w\\.-]+)(\\:[0-9]{1,4})?(.*)$', 'i');
    const originalUrlComponents = re.exec(originalUrl);
    const replacementUrlComponents = re.exec(replacementUrl);
    let foundSchemeAndHost: boolean;
    let foundPath: boolean;
    let newUrl: string;
    if (
        originalUrlComponents &&
        replacementUrlComponents &&
        originalUrlComponents.length >= 5 &&
        replacementUrlComponents.length >= 5
    ) {
        // Get the scheme and host name
        if (replacementUrlComponents[1] && replacementUrlComponents[2]) {
            newUrl = replacementUrlComponents[1] + '://' + replacementUrlComponents[2];
            foundSchemeAndHost = true;
        }

        // Get the port if it exists
        if (replacementUrlComponents[3]) {
            newUrl += replacementUrlComponents[3];
        }

        // Get the rest of the path
        if (originalUrlComponents[4]) {
            foundPath = true;
            newUrl += originalUrlComponents[4];
        }
    }

    return foundSchemeAndHost && foundPath ? newUrl : null;
}

export default function getOpenUrlForReferenceAttachment(attachment: ReferenceAttachment): string {
    let openUrl: string = attachment.AttachLongPathName;
    if (
        isGuestUrlPermissionLevel(attachment.PermissionType) ||
        attachment.ProviderType !== ONE_DRIVE_PRO
    ) {
        return openUrl;
    }

    const userConfiguration = getUserConfiguration();
    const applicationSettings = userConfiguration.ApplicationSettings;
    if (openUrl !== null && applicationSettings !== null) {
        const isPublicLogon =
            applicationSettings.VDirIsPublicProperty ||
            (userConfiguration.PublicComputersDetectionEnabled &&
                userConfiguration.SessionSettings.IsPublicComputerSession);
        let replacementUrl: string;
        if (isPublicLogon) {
            replacementUrl = formatSharePointMySiteHostUrl(
                applicationSettings.ExternalSPMySiteHostURL
            );
        } else {
            replacementUrl = formatSharePointMySiteHostUrl(
                applicationSettings.InternalSPMySiteHostURL
            );
        }

        if (replacementUrl !== null) {
            openUrl = tryReplaceSchemeAndServerInUrl(openUrl, replacementUrl);
        }
    }

    return openUrl !== null ? openUrl : attachment.AttachLongPathName;
}
