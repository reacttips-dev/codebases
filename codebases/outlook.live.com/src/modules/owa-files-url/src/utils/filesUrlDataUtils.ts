import type { FilesUrlData } from '../schema/FilesUrlData';

const filesUrlDataByProviderTypes: { [userIdentity: string]: FilesUrlData } = {};

// selector to get the current cached data
export function getFilesUrlDataByUserIdentity(userIdentity: string) {
    return filesUrlDataByProviderTypes[userIdentity];
}

// Used to add or override cached data
export function saveUrlData(userIdentity: string, filesUrlData: FilesUrlData): void {
    const currentData = filesUrlDataByProviderTypes[userIdentity];
    filesUrlDataByProviderTypes[userIdentity] = {
        ...currentData,
        ...filesUrlData,
    };
}

// Used for testing only
export function resetInstanceForTesting() {
    Object.keys(filesUrlDataByProviderTypes).forEach(function (key) {
        filesUrlDataByProviderTypes[key] = {};
    });
}
