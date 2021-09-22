import { getOrigin } from 'owa-url';
import { Version, ObjectType } from '../utils/restAPIConstants';
import { HttpReadyState, HttpStatusCode } from 'owa-http-status-codes';
import { HttpConstants } from '../utils/httpConstants';
import type { GroupFoldersRestResponse } from '../schema/GroupFoldersRestResponse';
import type { GroupFolder } from '../schema/GroupFolder';

const REQUEST_ACCESSTOKEN_ERROR_MSG = 'Access token is null or empty';
const REQUEST_EMPTY_RESPONSE_MSG = 'Response is empty';
const REQUEST_ERROR_MSG = 'Request failed';
const REQUEST_TIMEOUT_MSG = 'Request timed out';

/**
 * Get child folders of Group or Group Folder. Returns maximum of 10 folders.
 * If there are more than 10, NextLink param in response can be used to get remaining folders.
 * @param accessToken auth token for rest api
 * @param groupId the smtp address of group
 * @param folderId the folder whose child folders are queried
 * @param url rest api url
 */
export async function getGroupFoldersRest(
    accessToken: string,
    groupId: string,
    folderId?: string,
    url?: string
): Promise<GroupFoldersRestResponse> {
    if (!accessToken) {
        return {
            Success: false,
            ErrorMessage: REQUEST_ACCESSTOKEN_ERROR_MSG,
        };
    }

    return new Promise<GroupFoldersRestResponse>((resolve, reject) => {
        const endpointUrl = getEndpointUrl(groupId, folderId, url);
        const request = new XMLHttpRequest();

        request.open(HttpConstants.Get, endpointUrl, true);
        request.setRequestHeader(
            HttpConstants.AuthorizationTag,
            HttpConstants.BearerTokenHeader + accessToken
        );
        request.setRequestHeader(HttpConstants.XAnchorMailbox, groupId);

        request.onreadystatechange = function () {
            if (request.readyState === HttpReadyState.Done) {
                if (request.status === HttpStatusCode.OK) {
                    resolve(
                        parseResponseText(
                            request.status === HttpStatusCode.OK,
                            request.responseText
                        )
                    );
                } else {
                    resolve({
                        Success: false,
                        ErrorMessage:
                            'Request failed with status ' +
                            request.status +
                            '. Message: ' +
                            request.responseText,
                    });
                }
            }
        };

        request.ontimeout = function () {
            resolve({
                Success: false,
                ErrorMessage: REQUEST_TIMEOUT_MSG,
            });
        };
        request.onerror = function () {
            resolve({
                Success: false,
                ErrorMessage: REQUEST_ERROR_MSG,
            });
        };
        request.send();
    });
}

const getEndpointUrl = (groupId: string, folderId?: string, url?: string): string => {
    if (url) {
        return url;
    }
    const originUrl = getOrigin();
    let endpointUrl = `${originUrl}${Version.Beta}${ObjectType.Groups}${groupId}/${ObjectType.MailFolders}`;
    if (folderId) {
        endpointUrl = `${endpointUrl}/${folderId}/${ObjectType.ChildFolders}`;
    }

    return endpointUrl;
};

function parseResponseText(isSuccess: boolean, responseText: string): GroupFoldersRestResponse {
    try {
        const response =
            responseText && responseText.length > 0 ? JSON.parse(responseText) : undefined;

        if (isSuccess) {
            const nextLink = response['@odata.nextLink'];
            const folders: GroupFolder[] = [];
            response.value?.forEach(folder => {
                const groupFolder: GroupFolder = {
                    __type: 'GroupFolder',
                    OdataId: folder['@odata.id'],
                    Id: folder.Id,
                    ParentFolderId: folder.ParentFolderId,
                    DisplayName: folder.DisplayName,
                    UnreadItemCount: folder.UnreadItemCount,
                    TotalItemCount: folder.TotalItemCount,
                    ChildFolderCount: folder.ChildFolderCount,
                    IsHidden: folder.IsHidden,
                    SizeInBytes: folder.SizeInBytes,
                    WellKnownName: folder.WellKnownName,
                    ChildFolderIds: [],
                };
                folders.push(groupFolder);
            });
            return {
                Success: true,
                Folders: folders,
                NextLink: nextLink,
            };
        } else {
            const errorMessage = response?.error?.message ?? REQUEST_EMPTY_RESPONSE_MSG;
            return {
                Success: false,
                ErrorMessage: errorMessage,
            };
        }
    } catch (error) {
        const errorMessage = error.message;
        return {
            Success: false,
            ErrorMessage: errorMessage,
        };
    }
}
