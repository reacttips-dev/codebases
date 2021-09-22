import RequestedCapabilities from 'owa-service/lib/contract/RequestedCapabilities';
import { getExtensibilityContext } from 'owa-addins-store';

const permissionQueryParamName: string = 'permission';

export default function buildConsentUrl(requestedCapabilities: RequestedCapabilities): string {
    // enum member is necessary here rather than the value
    const capabilities: string = getStringFromType(requestedCapabilities);
    const consentUrl: string = getExtensibilityContext().ConsentUrl;

    let formattedConsentUrl: string;

    if (consentUrl.indexOf('?') > 0) {
        const urlComponents = consentUrl.split('?');
        formattedConsentUrl = `${urlComponents[0]}?${permissionQueryParamName}=${capabilities}&${urlComponents[1]}`;
    } else if (consentUrl.indexOf('#') > 0) {
        const urlComponents = consentUrl.split('#');
        formattedConsentUrl = `${urlComponents[0]}?${permissionQueryParamName}=${capabilities}#${urlComponents[1]}`;
    } else {
        formattedConsentUrl = `${consentUrl}?${permissionQueryParamName}=${capabilities}`;
    }

    return formattedConsentUrl;
}

function getStringFromType(requestedCapabilities: RequestedCapabilities): string {
    switch (requestedCapabilities) {
        case RequestedCapabilities.ReadItem:
            return 'ReadItem';
        case RequestedCapabilities.ReadWriteMailbox:
            return 'ReadWriteMailbox';
        case RequestedCapabilities.ReadWriteItem:
            return 'ReadWriteItem';
        default:
            return 'Restricted';
    }
}
