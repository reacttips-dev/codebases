import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type GetFileItemsJsonResponse from 'owa-service/lib/contract/GetFileItemsJsonResponse';
import getFileItemsRequest from 'owa-service/lib/factory/getFileItemsRequest';
import getFileItemsOperation from 'owa-service/lib/operation/getFileItemsOperation';
import { getHeaders } from 'owa-headers';
import UnifiedGroupIdentityType from 'owa-service/lib/contract/UnifiedGroupIdentityType';
import type IndexedPageView from 'owa-service/lib/contract/IndexedPageView';
import indexedPageView from 'owa-service/lib/factory/indexedPageView';
import MailboxFileType from 'owa-service/lib/contract/MailboxFileType';
import { getVariantEnvironment } from 'owa-metatags';

const defaultPageView: IndexedPageView = {
    BasePoint: 'Beginning',
    Offset: 0,
};

const getPagingSettings = function (maxFiles: number) {
    const setting = indexedPageView(defaultPageView);
    setting.MaxEntriesReturned = maxFiles;
    return setting;
};

const getFileTypeSettings = function () {
    switch (getVariantEnvironment()) {
        case 'Gallatin':
        case 'ITAR':
            return [MailboxFileType.SharePoint];
        default:
            return [MailboxFileType.All];
    }
};

export function getFileItems(
    groupSmtpAddress: string,
    maxFiles: number
): Promise<GetFileItemsJsonResponse> {
    return getFileItemsOperation(
        {
            Header: getJsonRequestHeader(),
            Body: getFileItemsRequest({
                GroupIdentity: {
                    Value: groupSmtpAddress,
                    Type: UnifiedGroupIdentityType.SmtpAddress,
                },
                FilesPaging: getPagingSettings(maxFiles),
                FileTypes: getFileTypeSettings(),
            }),
        },
        {
            headers: getHeaders(groupSmtpAddress, 'GetFileItems-FH-REACT-NoCache', true),
        }
    );
}

export function getFileItemsFromCache(
    groupSmtpAddress: string,
    maxFiles: number
): Promise<GetFileItemsJsonResponse> {
    return getFileItemsOperation(
        {
            Header: getJsonRequestHeader(),
            Body: getFileItemsRequest({
                GroupIdentity: {
                    Value: groupSmtpAddress,
                    Type: UnifiedGroupIdentityType.SmtpAddress,
                },
                CacheOptions: {
                    MaxAgeInSeconds: -1,
                    Hash: null,
                },
                IsBackgroundCall: false,
                FilesPaging: getPagingSettings(maxFiles),
                FileTypes: getFileTypeSettings(),
            }),
        },
        {
            headers: getHeaders(groupSmtpAddress, 'GetFileItems-FH-REACT-Cache', true),
        }
    );
}

export function getFileItemsRefresh(
    groupSmtpAddress: string,
    maxFiles: number
): Promise<GetFileItemsJsonResponse> {
    return getFileItemsOperation(
        {
            Header: getJsonRequestHeader(),
            Body: getFileItemsRequest({
                GroupIdentity: {
                    Value: groupSmtpAddress,
                    Type: UnifiedGroupIdentityType.SmtpAddress,
                },
                CacheOptions: {
                    MaxAgeInSeconds: -1,
                    Hash: 'ffffffffffff',
                },
                IsBackgroundCall: true,
                FilesPaging: getPagingSettings(maxFiles),
                FileTypes: getFileTypeSettings(),
            }),
        },
        {
            headers: getHeaders(groupSmtpAddress, 'GetFileItems-FH-REACT-BGRefresh', true),
        }
    );
}
