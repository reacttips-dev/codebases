import { logUsage } from 'owa-analytics';
import { getEncodedUrlForVroom } from 'owa-data-provider-info-fetcher';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import { format } from 'owa-localize';
import { SharingLinkScopeExistingAccess, SharingLinkTypeView } from '../index';
import getRequest, { FileProviderRequestSet } from '../utils/FileProviderQueryConfig';
import { getResponseFromFileProvider } from '../utils/getResponseFromFileProvider';
import type {
    CreateSharingLinkFromFileProviderResult,
    SharingLinkFromFileProvider,
} from './CreateSharingLinkFromFileProviderResult';

export async function createSharingLinkFromOneDrivePro(
    originalUrl: string,
    providerEndpointUrl: string,
    shouldEnforceOrgLink?: boolean
): Promise<CreateSharingLinkFromFileProviderResult> {
    const request: FileProviderRequestSet = getRequest(AttachmentDataProviderType.OneDrivePro);
    const oneDriveProRequest = shouldEnforceOrgLink
        ? request.create_org_shared_link_request
        : request.create_shared_link_request;

    let hostname = new URL(originalUrl).hostname;

    /* The location field of group files doesn't have domain name so need to get it from providerEndpointUrl.
       We also need to compose full url (originalUrl) from providerEndpointUrl and file name and pass it along. */
    if (hostname === null && providerEndpointUrl) {
        hostname = new URL(providerEndpointUrl).hostname;
        originalUrl = 'https://' + hostname + originalUrl;
    }

    const requestUrl: string = format(
        oneDriveProRequest.requestUrlFormat,
        hostname,
        getEncodedUrlForVroom(originalUrl)
    );

    try {
        const responseText: string = await getResponseFromFileProvider(
            request.providerType,
            requestUrl,
            oneDriveProRequest.additional_headers,
            oneDriveProRequest.method,
            oneDriveProRequest.body ? JSON.stringify(oneDriveProRequest.body) : null,
            originalUrl,
            oneDriveProRequest.dataPointName
        );

        const parsedResponse = JSON.parse(responseText);
        return shouldEnforceOrgLink ? parsedResponse : parsedResponse.value[0];
    } catch (e) {
        const error = e as Error;
        let errorObj;
        try {
            errorObj = JSON.parse(error.toString());
        } catch (err) {
            // Only some code throw the JSON error while JSON.parse would throw for all the other general errors .
        }

        const statusCode = errorObj?.responseStatus;
        logUsage('createSharingLinkFromOneDriveProUseFallback', {
            statusCode: statusCode,
        });
    }

    // Fall back to returning the originalUrl (canonical url) for OneDrivePro.
    // If enforceOrgLink is set to true return null instead of the canonical url.
    const sharingLink: SharingLinkFromFileProvider = {
        webUrl: shouldEnforceOrgLink ? null : originalUrl,
        type: SharingLinkTypeView,
        scope: SharingLinkScopeExistingAccess,
    };

    return {
        expirationDateTime: null,
        shareId: null,
        link: sharingLink,
    };
}
