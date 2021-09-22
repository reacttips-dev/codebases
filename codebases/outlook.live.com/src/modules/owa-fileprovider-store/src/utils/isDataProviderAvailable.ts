import getAttachmentPolicy from 'owa-session-store/lib/utils/getAttachmentPolicy';
import {
    lazyLoadProviders,
    getFileProvider,
    ProviderLoadStateOption,
    getProviderLoadState,
    FileProviderViewState,
} from '../index';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';

//Returns true if an attachment data provider is available for uploading to cloud
//Note - groupsOnlyOneDrive is treated as a valid data provider in groups scenarios only
export function isDataProviderAvailable(isGroupsScenario: boolean): boolean {
    const attachmentPolicy = getAttachmentPolicy();
    return (
        (attachmentPolicy?.AttachmentDataProviderAvailable && !isGroupsOnlyOneDrive()) ||
        (isGroupsScenario && attachmentPolicy?.GroupsOneDriveDataProviderAvailable)
    );
}

//Returns true if it is a groups only OneDrive. Groups only OneDrive is a fake OneDriveProAttachmentDataProvider
//which does not have a name when it is created on the server
const isGroupsOnlyOneDrive = (): boolean => {
    if (getProviderLoadState() === ProviderLoadStateOption.NotLoaded) {
        lazyLoadProviders
            .import()
            .then(loadProviders => loadProviders((providers: FileProviderViewState[]) => {}));
    }

    const odbProvider = getFileProvider(AttachmentDataProviderType.OneDrivePro.toString());
    if (!odbProvider) {
        return false; //if it is not ODB then it is not groups only OneDruve
    } else {
        return !odbProvider.name;
    }
};
