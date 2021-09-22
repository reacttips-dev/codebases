import { OneDriveFolderToUploadToIdentifierType } from '../services/OneDrive/uploadFileToOneDrive';
import { assertNever } from 'owa-assert';

export function getSelectedFolderId(
    type: OneDriveFolderToUploadToIdentifierType,
    identifier: string
): string | null {
    switch (type) {
        case OneDriveFolderToUploadToIdentifierType.Id:
            return identifier;
        case OneDriveFolderToUploadToIdentifierType.SpecialFolder:
            return null; //Special folders are referenced using the folder path
        default:
            assertNever(type);
    }
    return null;
}
