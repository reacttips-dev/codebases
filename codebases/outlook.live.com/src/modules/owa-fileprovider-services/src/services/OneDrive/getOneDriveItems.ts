import { assertNever } from 'owa-assert';
import { CORS_MODE_NAME, fetchService, GET_METHOD_NAME } from 'owa-data-provider-info-fetcher';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import AttachmentItemsSortColumn from 'owa-service/lib/contract/AttachmentItemsSortColumn';
import AttachmentItemsSortOrder from 'owa-service/lib/contract/AttachmentItemsSortOrder';
// eslint-disable-next-line node/no-deprecated-api
import { parse as parseUrl } from 'url';
import type FileProviderServiceResponse from '../../types/FileProviderServiceResponse';
import type OneDriveItem from '../../types/OneDriveItem';
import { COLUMN_NAMES, getAllColumnNames } from './columns';
import { ROOT_FOLDER_ID } from './constants';
import { getAPIBaseForId } from './getAPIBase';

function getSortColumnName(sortColumn: AttachmentItemsSortColumn): string {
    switch (sortColumn) {
        case AttachmentItemsSortColumn.Name:
            return COLUMN_NAMES.name;
        case AttachmentItemsSortColumn.Size:
            return COLUMN_NAMES.size;
        default:
            return COLUMN_NAMES.lastModifiedDateTime;
    }
}

function getSortOrderName(sortOrder: AttachmentItemsSortOrder): 'asc' | 'desc' {
    switch (sortOrder) {
        case AttachmentItemsSortOrder.Ascending:
            return 'asc';
        case AttachmentItemsSortOrder.Descending:
            return 'desc';
        default:
            return assertNever(sortOrder);
    }
}

function getFilterQuery(filterType: OneDriveItemFilterType): string {
    switch (filterType) {
        case OneDriveItemFilterType.None:
            return '';
        case OneDriveItemFilterType.Folder:
            return `(${COLUMN_NAMES.folder} ne null)`;
        default:
            return assertNever(filterType);
    }
}

interface GetOneDriveItemsResponse {
    value: OneDriveItem[];
    '@odata.nextLink'?: string;
}

export enum OneDriveItemFilterType {
    None,
    Folder,
}

export interface GetOneDriveItemsPagingInfo {
    maxEntries: number;
    skipToken?: string;
}

export interface GetOneDriveItemsResult {
    items: OneDriveItem[];
    skipToken?: string;
}

export default async function getOneDriveItems(
    apiBaseUrl: 'https://api.onedrive.com',
    providerType: AttachmentDataProviderType.OneDriveConsumer,
    sortColumn: AttachmentItemsSortColumn,
    sortOrder: AttachmentItemsSortOrder,
    folderId?: string,
    filter?: OneDriveItemFilterType,
    pagingInfo?: GetOneDriveItemsPagingInfo
): Promise<FileProviderServiceResponse<GetOneDriveItemsResult>>;
export default async function getOneDriveItems(
    apiBaseUrl: string,
    providerType: AttachmentDataProviderType.OneDrivePro,
    sortColumn: AttachmentItemsSortColumn,
    sortOrder: AttachmentItemsSortOrder,
    folderId?: string,
    filter?: OneDriveItemFilterType,
    pagingInfo?: GetOneDriveItemsPagingInfo
): Promise<FileProviderServiceResponse<GetOneDriveItemsResult>>;
export default async function getOneDriveItems(
    apiBaseUrl: string,
    providerType:
        | AttachmentDataProviderType.OneDriveConsumer
        | AttachmentDataProviderType.OneDrivePro,
    sortColumn: AttachmentItemsSortColumn,
    sortOrder: AttachmentItemsSortOrder,
    folderId?: string,
    filter: OneDriveItemFilterType = OneDriveItemFilterType.None,
    pagingInfo?: GetOneDriveItemsPagingInfo
): Promise<FileProviderServiceResponse<GetOneDriveItemsResult>> {
    folderId = folderId || ROOT_FOLDER_ID;

    const sortColumnName = getSortColumnName(sortColumn);
    const sortOrderName = getSortOrderName(sortOrder);
    const orderByValue = getOrderByValueForProvider(providerType, sortColumnName, sortOrderName);

    let query = `expand=thumbnails(select=medium)&orderby=${orderByValue}&select=${getAllColumnNames()}`;

    if (filter !== OneDriveItemFilterType.None) {
        query = `${query}&filter=${getFilterQuery(filter)}`;
    }

    if (pagingInfo) {
        // If paging info is provided then add the max entries required
        query = `${query}&$top=${pagingInfo.maxEntries}`;

        // If there is a skip token for next page then add that as well
        if (pagingInfo.skipToken) {
            query = `${query}&$skiptoken=${pagingInfo.skipToken}`;
        }
    }

    const url = `${apiBaseUrl}/${getAPIBaseForId(providerType)}/${folderId}/children?${query}`;
    // This header is needed for now while the OneDrive teams fixes an issue with sorting
    // when there are 5000+ items in a folder. The same issue exists with the CSOM APIs we
    // use in OWS right now, so this won't be a regression.
    const headers = { Prefer: 'HonorNonIndexedQueriesWarningMayFailRandomly' };
    const responseBody: string = await fetchService(
        providerType,
        encodeURI(url),
        url,
        {
            method: GET_METHOD_NAME,
            mode: CORS_MODE_NAME,
            datapointNamePrefix: 'getOneDriveItems',
        },
        headers
    );

    const getItemsResponse = JSON.parse(responseBody) as GetOneDriveItemsResponse;
    const skipToken = getItemsResponse['@odata.nextLink']
        ? getSkipToken(decodeURI(getItemsResponse['@odata.nextLink']))
        : null;

    return { errorResponse: null, result: { items: getItemsResponse.value, skipToken } };
}

function getOrderByValueForProvider(
    providerType:
        | AttachmentDataProviderType.OneDriveConsumer
        | AttachmentDataProviderType.OneDrivePro,
    sortColumnName: string,
    sortOrderName: string
): string {
    switch (providerType) {
        case AttachmentDataProviderType.OneDrivePro:
            return `folder,${sortColumnName} ${sortOrderName}`;
        case AttachmentDataProviderType.OneDriveConsumer:
            return `${sortColumnName} ${sortOrderName}`;
        default:
            return assertNever(providerType);
    }
}

function getSkipToken(url: string): string {
    const parsedUrl = parseUrl(url, true /* parseQueryString */);
    return parsedUrl.query ? parsedUrl.query.$skiptoken : null;
}
