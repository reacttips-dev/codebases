import { assertNever } from 'owa-assert';
import { CompletionStatus, SliceAction, startBlobSlicingTask } from 'owa-blob-slicer';
import { CORS_MODE_NAME, POST_METHOD_NAME } from 'owa-data-provider-info-fetcher';
import { fetchService } from 'owa-data-provider-info-fetcher/lib/fetcher/fetchService';
import { HttpStatusCode, isSuccessStatusCode } from 'owa-http-status-codes';
import type AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import type { FileProviderServiceResponseGeneric } from '../../types/FileProviderServiceResponse';
import type OneDriveFile from '../../types/OneDriveFile';
import type { OneDriveIdentitySet } from '../../types/OneDriveIdentitySet';
import type OneDrivePackage from '../../types/OneDrivePackage';
import { FetchResponse, fetchWithProgress } from '../../utils/fetchWithProgress';
import { DEFAULT_UPLOAD_SLICE_SIZE, ROOT_FOLDER_ID } from './constants';
import { getAPIBaseForId, getDriveAPIBase } from './getAPIBase';

interface UploadSessionResponse {
    uploadUrl: string;
    expirationDateTime: string;
}

export interface OneDriveUploadedFile {
    id: string;
    createdBy: OneDriveIdentitySet;
    lastModifiedBy: OneDriveIdentitySet;
    lastModifiedDateTime: string;
    name: string;
    size: number;
    webUrl: string;
    file: OneDriveFile;
    parentReference: {
        id: string;
        path: string;
    };
    package?: OneDrivePackage;
}

export type FileProviderServiceResponse<T> = FileProviderServiceResponseGeneric<
    T,
    FetchResponse | Response
>;
export interface UploadFileToOneDriveResult {
    uploadPromise: Promise<FileProviderServiceResponse<OneDriveUploadedFile>>;
    cancel: () => Promise<FileProviderServiceResponse<void>>;
}

export type ProgressHandler = (event: Pick<ProgressEvent, 'loaded' | 'total'>) => void;

export const enum OneDriveFolderToUploadToIdentifierType {
    Id,
    SpecialFolder,
}

export interface FileToUpload {
    fileName: string;
    fileBlob: Blob;
}

export interface UploadFileToOneDriveParams {
    fileToUpload: FileToUpload;
    folderInfo?: {
        type: OneDriveFolderToUploadToIdentifierType;
        identifier: string;
    };
    sliceSize?: number;
    conflictBehavior?: 'rename' | 'fail' | 'overwrite';
    onProgress?: ProgressHandler;
}

const defaultProperties: Partial<UploadFileToOneDriveParams> = Object.freeze<
    Partial<UploadFileToOneDriveParams>
>({
    folderInfo: {
        type: OneDriveFolderToUploadToIdentifierType.Id,
        identifier: ROOT_FOLDER_ID,
    },
    sliceSize: DEFAULT_UPLOAD_SLICE_SIZE,
    conflictBehavior: 'rename',
    onProgress: () => {},
});

export function uploadFileToOneDrive(
    providerType: AttachmentDataProviderType.OneDriveConsumer,
    apiBaseUrl: 'https://api.onedrive.com',
    params: UploadFileToOneDriveParams
): UploadFileToOneDriveResult;
export function uploadFileToOneDrive(
    providerType: AttachmentDataProviderType.OneDrivePro,
    apiBaseUrl: string,
    params: UploadFileToOneDriveParams
): UploadFileToOneDriveResult;
export function uploadFileToOneDrive(
    providerType:
        | AttachmentDataProviderType.OneDriveConsumer
        | AttachmentDataProviderType.OneDrivePro,
    apiBaseUrl: string,
    params: UploadFileToOneDriveParams
): UploadFileToOneDriveResult {
    let cancelFunc: () => Promise<FileProviderServiceResponse<void>> = () =>
        Promise.resolve({ errorResponse: null, result: null });

    const uploadFilePromise: () => Promise<
        FileProviderServiceResponse<OneDriveUploadedFile>
    > = async () => {
        assignDefaultValueForParams(params);
        const {
            fileToUpload: { fileName, fileBlob },
            folderInfo: { type, identifier },
            conflictBehavior,
            sliceSize,
            onProgress,
        } = params;

        let url: string;
        switch (type) {
            case OneDriveFolderToUploadToIdentifierType.Id:
                url = `${apiBaseUrl}/${getAPIBaseForId(providerType)}/${identifier}:/${encodeURI(
                    fileName
                )}:/createUploadSession`;
                break;
            case OneDriveFolderToUploadToIdentifierType.SpecialFolder:
                url = `${apiBaseUrl}/${getDriveAPIBase(providerType)}/${identifier}:/${encodeURI(
                    fileName
                )}:/createUploadSession`;
                break;
            default:
                assertNever(type);
        }

        const requestBody = {
            item: {
                '@name.conflictBehavior': conflictBehavior,
            },
        };

        // We create the upload session and if it is successful only then
        // we are able to upload the file
        const uploadSessionResponseBody: string = await fetchService(
            providerType,
            url,
            url,
            {
                method: POST_METHOD_NAME,
                mode: CORS_MODE_NAME,
                body: JSON.stringify(requestBody),
                datapointNamePrefix: 'createUploadSession',
            },
            null
        );
        // Upload session was created so we should now start the upload
        const { uploadPromise, cancel } = startUploadingFile(
            JSON.parse(uploadSessionResponseBody) as UploadSessionResponse,
            fileBlob,
            sliceSize,
            onProgress
        );

        cancelFunc = cancel;
        return uploadPromise;
    };

    return {
        uploadPromise: uploadFilePromise(),
        cancel: () => cancelFunc(),
    };
}

function startUploadingFile(
    uploadSession: UploadSessionResponse,
    fileBlob: Blob,
    sliceSize: number,
    onProgress: ProgressHandler
): UploadFileToOneDriveResult {
    const { uploadUrl } = uploadSession;
    const totalFileSize = fileBlob.size;

    let createdOneDriveFile: OneDriveUploadedFile | null = null;
    let errorResponse: FetchResponse | null = null;

    const actionForSlice = createActionForSlice(
        uploadUrl,
        sliceSize,
        totalFileSize,
        onProgress,
        file => {
            // File upload succeeded
            createdOneDriveFile = file;
        },
        error => {
            // Error in uploading file slice
            errorResponse = error;
        }
    );

    // This will start the upload
    const { onCompletePromise, cancel } = startBlobSlicingTask(fileBlob, actionForSlice, {
        sliceSize: sliceSize,
        numberOfSlicesToParallelize: 1, // OneDrive does not support out of order slice upload so it has to be sequential
    });

    // We create a new function that contains the
    // promise of completing the upload and will return
    // the approriate result back to user.
    const uploadAction = async (): Promise<FileProviderServiceResponse<OneDriveUploadedFile>> => {
        let result: CompletionStatus | null = null;
        try {
            result = await onCompletePromise;
        } catch {
            // If the promise for blob task fails then
            // it means some request failed so we return
            // back the error response
            return { errorResponse, result: null };
        }

        switch (result) {
            case CompletionStatus.Completed:
                if (createdOneDriveFile) {
                    return {
                        errorResponse: null,
                        result: createdOneDriveFile,
                    };
                } else {
                    return { errorResponse, result: null };
                }
            case CompletionStatus.Cancelled:
                throw new Error('Upload was cancelled');
            default:
                return assertNever(result);
        }
    };

    const uploadActionPromise = uploadAction();
    return {
        uploadPromise: uploadActionPromise,
        cancel: async () => {
            // First we cancel the blob slicing task so that
            // no more slices are uploaded
            cancel();

            try {
                // After canceling we await for the upload promise
                // which will reject in case of cancellation and then
                // we will call cancel on the upload session
                await uploadActionPromise;
            } finally {
                // Then we delete the upload session so that the
                // paritally uploaded file is removed
                return cancelUploadSession(uploadUrl);
            }
        },
    };
}

function createActionForSlice(
    uploadUrl: string,
    sliceSize: number,
    totalFileSize: number,
    onProgress: ProgressHandler,
    onFileUploadComplete: (file: OneDriveUploadedFile) => void,
    onErrorInUploadingSlice: (errorResponse: FetchResponse) => void
): SliceAction {
    // This creates the progress handler for the slice upload
    const createSliceProgressHandler = (sliceNumber: number) => {
        const { rangeStart } = getCurrentSliceRange(sliceNumber, sliceSize, totalFileSize);
        return (event: ProgressEvent) => {
            // As we need to report the progress of the whole file
            // so considering the upload is sequential, we calculate
            // the range uploaded based on which slice is it.
            const { loaded } = event;
            const currentlyTotalUploaded = rangeStart + loaded;
            onProgress({
                loaded: currentlyTotalUploaded,
                total: totalFileSize,
            });
        };
    };

    // The action which will be executed for each slice.
    // We upload the slice in this action
    const actionForSlice: SliceAction = async (blobSlice: Blob, sliceNumber: number) => {
        const headers = getHeadersForUploading(sliceNumber, sliceSize, totalFileSize);
        const sliceProgressHandler = createSliceProgressHandler(sliceNumber);
        const response = await fetchWithProgress(uploadUrl, sliceProgressHandler, {
            method: 'PUT',
            body: blobSlice,
            headers: headers,
        });

        if (response.status === 201 || response.status === HttpStatusCode.OK) {
            // If the status code is `Created` or `OK` then it means the file
            // was successfully created hence we parse the response which should
            // contain the file information
            const responseBody = await response.text();
            const createdOneDriveFile = JSON.parse(responseBody) as OneDriveUploadedFile;
            onFileUploadComplete(createdOneDriveFile);
        }

        if (!isSuccessStatusCode(response.status)) {
            // If there was some error in uploading then we
            // store the error response so it can be returned upstream
            onErrorInUploadingSlice(response);
            throw new Error('Unable to upload file');
        }
    };

    return actionForSlice;
}

function getHeadersForUploading(
    sliceNumber: number,
    sliceSize: number,
    totalSize: number
): Headers {
    const { rangeStart, rangeEnd } = getCurrentSliceRange(sliceNumber, sliceSize, totalSize);
    const headers = new Headers({
        'Content-Range': `bytes ${rangeStart}-${rangeEnd}/${totalSize}`,
        Accept: 'application/json',
    });

    return headers;
}

/**
 * This will return the range of bytes in the current slice both start and end inclusive.
 * For example for uploading 5 bytes it would indicate `{rangeStart: 0, rangeEnd: 4}` as
 * the slice is from 0th byte to 4th byte.
 */
function getCurrentSliceRange(sliceNumber: number, sliceSize: number, totalSize: number) {
    const rangeStart = sliceNumber * sliceSize;
    const rangeEnd = Math.min(rangeStart + sliceSize, totalSize) - 1;

    return { rangeStart, rangeEnd };
}

async function cancelUploadSession(uploadUrl: string): Promise<FileProviderServiceResponse<null>> {
    const response = await fetch(uploadUrl, {
        method: 'DELETE',
    });

    if (isSuccessStatusCode(response.status)) {
        return { errorResponse: null, result: null };
    } else {
        return { errorResponse: response, result: null };
    }
}

function assignDefaultValueForParams(params: UploadFileToOneDriveParams) {
    Object.keys(defaultProperties).forEach(key => {
        params[key] = params[key] || defaultProperties[key];
    });
}
