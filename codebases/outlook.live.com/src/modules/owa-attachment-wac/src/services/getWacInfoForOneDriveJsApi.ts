import { DatapointStatus, PerformanceDatapoint } from 'owa-analytics';
import type AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import fetchDataProviderResourceRequest from 'owa-service/lib/factory/fetchDataProviderResourceRequest';
import fetchDataProviderResourceOperation from 'owa-service/lib/operation/fetchDataProviderResourceOperation';
import { trace } from 'owa-trace';

export default async function getWacInfoForOneDriveJsApi(
    providerType: AttachmentDataProviderType,
    url: string,
    isEdit: boolean,
    redeemSharingLinkIfNecessary?: boolean,
    returnEvenIfNoWacInfo?: boolean
): Promise<OneDriveVroomOpenWithOfficeBundleResponse | null> {
    const datapoint: PerformanceDatapoint = new PerformanceDatapoint('getWacInfoForOneDriveJsApi', {
        isCore: true,
    });
    if (redeemSharingLinkIfNecessary) {
        datapoint.addCustomData({
            redeemSharingLinkIfNecessary: redeemSharingLinkIfNecessary,
        });
    }
    try {
        const base64Value: string = btoa(url);
        const base64EncodedUrl: string =
            'u!' +
            base64Value
                .replace(/^\=+|\=+$/g, '')
                .replace('/', '_')
                .replace('+', '-');
        const schemaHost = new RegExp(/.+?\:\/\/.+?(\/)/g).exec(url)[0];

        const action = isEdit ? 'Open' : 'View';
        const vroomUrl = `${schemaHost}_api/v2.0/shares/${base64EncodedUrl}/root?select=openWith/wac,officeBundle,@content.downloadUrl,name,size,currentUserRole,sensitivityLabel&action=${action}`;

        const headers: any = new Object();
        if (redeemSharingLinkIfNecessary) {
            headers.prefer = 'redeemSharingLinkIfNecessary';
        }

        const fetchRequest = fetchDataProviderResourceRequest({
            ProviderType: providerType,
            Url: vroomUrl,
            Headers: JSON.stringify(headers),
        });

        const fetchStartTime: number = new Date().getTime();
        const result = await fetchDataProviderResourceOperation(fetchRequest);
        if (result.Status === 200 && result.Body) {
            const responseStartTime: number = new Date().getTime();
            const response = JSON.parse(result.Body) as OneDriveVroomOpenWithOfficeBundleResponse;

            response.fetchStartTime = fetchStartTime;
            response.responseStartTime = responseStartTime;

            // for links that the user has not redeemed yet,
            // response.openWith will be empty, don't run these code because of script error
            if (response.openWith.wac || !returnEvenIfNoWacInfo) {
                // OpenWith.Wac.fileGetUrl is not valid. Use the value of @content.downloadUrl.
                response.openWith.wac.fileGetUrl = response['@content.downloadUrl'];

                if (response.openWith.wac.accessTokenExpiry) {
                    // Change it to DateTime
                    response.openWith.wac.accessTokenExpiry = new Date(
                        Number(response.openWith.wac.accessTokenExpiry)
                    );
                }

                // If we did not open it in EDIT mode, force readOnly to true.
                if (!isEdit && response.currentUserRole) {
                    response.currentUserRole.readOnly = true;
                }
            }

            datapoint.end();

            return response;
        } else {
            // File deleted, no permission or other error
            datapoint.addCustomData({
                StatusCode: result.Status,
            });
            const headerString: string = result.Headers;
            if (headerString) {
                const headers = JSON.parse(headerString) as OneDriveVroomResponseHeaders;
                if (headers) {
                    datapoint.addCustomData({
                        SharePointError: headers.SharePointError,
                        SPClientServiceRequestDuration: headers.SPClientServiceRequestDuration,
                        SPRequestGuid: headers.SPRequestGuid,
                    });
                }
            }

            throw new Error(`Result status is: ${result.Status} or empty response body.`);
        }
    } catch (error) {
        datapoint.endWithError(DatapointStatus.ServerError, error);
        trace.warn(
            `Something went wrong while calling fetchDataProviderResourceOperation: ${error}`
        );
    }

    return null;
}

export interface OfficeBundle {
    url: string;
    version: string;
}

export interface OpenWith {
    wac: Wac;
}

export interface Wac {
    accessToken: string;
    accessTokenExpiry: Date;
    applicationUrl: string;
    bootstrapperUrl: string;
    fileGetUrl: string;
    licenseCheckForEditIsEnabled: boolean;
    userId: string;
    wopiSrc: string;
    clientThrottlingProtection: string;
    requestedCallThrottling: string;
}

export interface CurrentUserRole {
    blocksDownload: boolean;
    readOnly: boolean;
}

export interface OneDriveVroomOpenWithOfficeBundleResponse {
    officeBundle: OfficeBundle;
    openWith: OpenWith;
    fetchStartTime: number;
    responseStartTime: number;
    name: string;
    size: number;
    currentUserRole: CurrentUserRole;
    sensitivityLabel: {
        displayName: string;
        id: string;
        protectionEnabled: boolean;
    };
}

interface OneDriveVroomResponseHeaders {
    SharePointError: string;
    SPClientServiceRequestDuration: string;
    SPRequestGuid: string;
}
