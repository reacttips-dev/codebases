import {
    GET_METHOD_NAME,
    PATCH_METHOD_NAME,
    POST_METHOD_NAME,
    PUT_METHOD_NAME,
} from 'owa-data-provider-info-fetcher';
import {
    BOX_BASE_API_ROUTE,
    DROPBOX_SHARE_BASE_API_ROUTE,
    GDRIVE_BASE_API_ROUTER,
    getDriveAPIBase,
    getSharesAPIBase,
    ONE_DRIVE_CONUSMER_API_URL,
} from 'owa-fileprovider-services';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';

interface FileProviderRequest {
    requestUrlFormat: string;
    method: string;
    body?: any;
    additional_headers?: any;
    dataPointName: string;
}

export interface FileProviderRequestSet {
    providerType: AttachmentDataProviderType;
    create_shared_link_request: FileProviderRequest; // either retrieve an existing shared link or create a new shared link if it doesn't exist
    create_org_shared_link_request?: FileProviderRequest;
    get_shared_link_request?: FileProviderRequest;
    change_link_permission_request?: FileProviderRequest;
    get_file_permission_request?: FileProviderRequest;
    get_file_info_request?: FileProviderRequest;
    get_drive_item_request?: FileProviderRequest;
    get_shared_item_request?: FileProviderRequest;
    get_image_urls_request?: FileProviderRequest;
}

export default function getRequest(
    providerType: AttachmentDataProviderType
): FileProviderRequestSet {
    switch (providerType) {
        case AttachmentDataProviderType.Box:
            return BoxRequests;
        case AttachmentDataProviderType.Dropbox:
            return DropboxRequests;
        case AttachmentDataProviderType.OneDrivePro:
            return OneDriveProRequests;
        case AttachmentDataProviderType.OneDriveConsumer:
            return OneDriveConsumerRequests;
        case AttachmentDataProviderType.GDrive:
            return GDriveRequests;
        default:
            throw new Error(`File provider ${providerType} is not supported.`);
    }
}

export const BoxRequests = {
    providerType: AttachmentDataProviderType.Box,
    // more info: https://box-content.readme.io/reference#create-a-shared-link-for-a-file
    create_shared_link_request: {
        requestUrlFormat: `${BOX_BASE_API_ROUTE}/{0}/{1}`,
        method: PUT_METHOD_NAME,
        body: {
            shared_link: {
                access: 'open', // other access levels: collaborators or null
                permissions: {
                    can_download: true, // if false, item won't be downloadable
                    can_preview: true,
                },
            },
        },
        dataPointName: 'BoxCreateLink',
    },
    // more info: https://box-content.readme.io/reference#get-a-shared-item
    get_file_info_request: {
        requestUrlFormat: `${BOX_BASE_API_ROUTE}/shared_items`,
        method: GET_METHOD_NAME,
        additional_headers: {
            BoxApi: 'shared_link={0}',
        },
        dataPointName: 'GetBoxFileInfo',
    },
};

export const DropboxRequests = {
    providerType: AttachmentDataProviderType.Dropbox,
    // more info: https://www.dropbox.com/developers/documentation/http/documentation#sharing-list_shared_links
    get_shared_link_request: {
        requestUrlFormat: `${DROPBOX_SHARE_BASE_API_ROUTE}/list_shared_links`,
        method: POST_METHOD_NAME,
        body: {
            path: null, // need to provide
            direct_only: true /* suppress links to parent folders */,
        },
        dataPointName: 'DropboxCreateLink',
    },
    // more info: https://www.dropbox.com/developers/documentation/http/documentation#sharing-create_shared_link_with_settings
    create_shared_link_request: {
        requestUrlFormat: `${DROPBOX_SHARE_BASE_API_ROUTE}/create_shared_link_with_settings`,
        method: POST_METHOD_NAME,
        body: {
            path: null, // need to provide
            settings: { requested_visibility: 'public' },
        },
        dataPointName: 'DropboxCreateNewLink',
    },
    // more info: https://www.dropbox.com/developers/documentation/http/documentation#sharing-get_shared_link_metadata
    get_file_info_request: {
        requestUrlFormat: `${DROPBOX_SHARE_BASE_API_ROUTE}/get_shared_link_metadata`,
        method: POST_METHOD_NAME,
        body: {
            url: null, // need to provider
        },
        dataPointName: 'GetDropboxFileInfo',
    },
};

export const OneDriveProRequests = {
    providerType: AttachmentDataProviderType.OneDrivePro,
    // more info: https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_invite
    create_shared_link_request: {
        requestUrlFormat: `https://{0}/${getSharesAPIBase(
            AttachmentDataProviderType.OneDrivePro
        )}/{1}/driveItem/invite`,
        method: POST_METHOD_NAME,
        additional_headers: {
            prefer: 'getDefaultLink',
            // OneDrive telemetry headers
            // https://microsoft.sharepoint-df.com/:w:/t/SPO-CK/ETJMk-nrEYJAujSjbZGL2qUBP22614p18dqIXn7L3wAimw?e=ChhVl2
            Application: 'Outlook_Web',
            Scenario: 'ShareFile',
            ScenarioType: 'AUO',
        },
        dataPointName: 'OneDriveProCreateLink',
    },
    create_org_shared_link_request: {
        requestUrlFormat: `https://{0}/${getSharesAPIBase(
            AttachmentDataProviderType.OneDrivePro
        )}/{1}/driveItem/createLink`,
        method: POST_METHOD_NAME,
        body: {
            type: 'edit',
            scope: 'organization',
        },
        dataPointName: 'OneDriveProCreateOrgLink',
    },
    get_file_info_request: {
        requestUrlFormat: `https://{0}/${getSharesAPIBase(
            AttachmentDataProviderType.OneDrivePro
        )}/{1}/?expand=sharepointIds,permission,driveItem(select=webDavUrl,name,folder,package)`,
        method: GET_METHOD_NAME,
        dataPointName: 'GetODBFileInfo',
    },
    get_shared_item_request: {
        requestUrlFormat: `https://{0}/${getSharesAPIBase(
            AttachmentDataProviderType.OneDrivePro
        )}/{1}/`,
        method: GET_METHOD_NAME,
        dataPointName: 'GetODBSharedItem',
        additional_headers: {
            prefer: 'redeemSharingLinkIfNecessary',
        },
    },
};

export const OneDriveConsumerRequests = {
    providerType: AttachmentDataProviderType.OneDriveConsumer,
    // more info: https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_createlink
    create_shared_link_request: {
        requestUrlFormat: `${ONE_DRIVE_CONUSMER_API_URL}/${getDriveAPIBase(
            AttachmentDataProviderType.OneDriveConsumer
        )}/items/{0}/action.createLink`,
        method: POST_METHOD_NAME,
        body: {
            type: null, // need to provide
        },
        dataPointName: 'OneDriveConsumerCreateLink',
    },
    change_link_permission_request: {
        requestUrlFormat: `${ONE_DRIVE_CONUSMER_API_URL}/${getSharesAPIBase(
            AttachmentDataProviderType.OneDriveConsumer
        )}/{0}/root/action.createLink`,
        method: POST_METHOD_NAME,
        body: {
            type: null, // need to provide
        },
        dataPointName: 'OneDriveConsumerChangeLinkPermission',
    },
    get_drive_item_request: {
        requestUrlFormat: `${ONE_DRIVE_CONUSMER_API_URL}/${getSharesAPIBase(
            AttachmentDataProviderType.OneDriveConsumer
        )}/{0}/driveItem?select=webDavUrl,id,name,file`,
        method: GET_METHOD_NAME,
        dataPointName: 'GetODCDriveItem',
    },
    get_file_permission_request: {
        requestUrlFormat: `${ONE_DRIVE_CONUSMER_API_URL}/${getSharesAPIBase(
            AttachmentDataProviderType.OneDriveConsumer
        )}/{0}/driveItem/permissions`,
        method: GET_METHOD_NAME,
        dataPointName: 'GetODCFilePermission',
    },
    get_image_urls_request: {
        requestUrlFormat: `${ONE_DRIVE_CONUSMER_API_URL}/${getSharesAPIBase(
            AttachmentDataProviderType.OneDriveConsumer
        )}/{0}/root/thumbnails/?select=c200x150_Crop,large`,
        method: GET_METHOD_NAME,
        dataPointName: 'GetODCImageUrl',
    },
};

export const GDriveRequests = {
    providerType: AttachmentDataProviderType.GDrive,
    // more info: https://developers.google.com/drive/api/v3/reference/files/get
    get_file_info_request: {
        requestUrlFormat: `${GDRIVE_BASE_API_ROUTER}/{0}?fields=id,name,webViewLink,mimeType,capabilities,permissions,permissionIds`,
        method: GET_METHOD_NAME,
        dataPointName: 'GetGDriveFileInfo',
    },
    // more info: https://developers.google.com/drive/api/v3/reference/permissions/create
    create_shared_link_request: {
        requestUrlFormat: `${GDRIVE_BASE_API_ROUTER}/{0}/permissions`,
        method: POST_METHOD_NAME,
        body: {
            role: null, // need to provide
            type: 'anyone',
        },
        dataPointName: 'GDriveCreateLink',
    },
    // more info: https://developers.google.com/drive/api/v3/reference/permissions/update
    change_link_permission_request: {
        requestUrlFormat: `${GDRIVE_BASE_API_ROUTER}/{0}/permissions/{1}`,
        method: PATCH_METHOD_NAME,
        body: {
            role: null, // need to provide
        },
        dataPointName: 'GDriveChangeLinkPermission',
    },
};
