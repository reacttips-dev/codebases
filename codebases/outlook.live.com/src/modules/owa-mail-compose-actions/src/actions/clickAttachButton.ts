import {
    CreateAttachmentHandler,
    FileSelectionFilter,
    InsertLinkHandler,
    lazyAttachmentFilePicker,
} from 'owa-attachment-filepicker';
import { lazyGetAvailableLocalAttachmentSize } from 'owa-attachment-well-data';
import {
    fetchUploadFolder,
    getUploadFolder,
    UploadFolder,
    UploadFolderMailboxType,
} from 'owa-attachments-upload-folder';
import { isGroupTableSelected } from 'owa-group-utils';
import loc from 'owa-localize';
import type { ComposeViewState } from 'owa-mail-compose-store';
import { UploadToGroupFiles } from './clickAttachButton.locstring.json';
import trySaveMessage, { isSaving } from './trySaveMessage';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import getComposeUniqueState from '../utils/getComposeUniqueState';

export default async function clickAttachButton(
    isInline: boolean,
    attachmentHandler: CreateAttachmentHandler,
    linkHandler: InsertLinkHandler,
    viewState: ComposeViewState,
    targetWindow: Window
) {
    if (!viewState.itemId && !isSaving(viewState)) {
        trySaveMessage(viewState);
    }

    const maximumClassicAttachmentSize = (await lazyGetAvailableLocalAttachmentSize.import())(
        viewState.attachmentWell
    );
    let uploadFolder = getAttachmentUploadFolder(viewState);
    if (!uploadFolder) {
        uploadFolder = await fetchAttachmentUploadFolder(viewState);
    }
    const uploadText = getUploadText(viewState);
    lazyAttachmentFilePicker.importAndExecute(attachmentHandler, linkHandler, {
        fileSelectionFilter: isInline ? FileSelectionFilter.Images : FileSelectionFilter.None,
        maxAllowedLocalFilesSize: maximumClassicAttachmentSize,
        supportsInsertLink: !!linkHandler,
        uploadConfiguration: {
            folderName: uploadFolder ? uploadFolder.folderName : null,
            uploadText: uploadText,
            uploadDisabled: isGroupTableSelected() && getGroupId(viewState) && isConsumer(),
            composeUniqueState: getComposeUniqueState(viewState),
        },
        targetWindow,
    });
}

function getAttachmentUploadFolder(viewState: ComposeViewState): UploadFolder {
    if (isGroupTableSelected() && getGroupId(viewState)) {
        const mailboxId = viewState.attachmentWell.groupId;
        return getUploadFolder(mailboxId);
    }
    return getUploadFolder();
}

function fetchAttachmentUploadFolder(viewState: ComposeViewState): Promise<UploadFolder> {
    if (isGroupTableSelected() && getGroupId(viewState)) {
        const mailboxId = viewState.attachmentWell.groupId;
        return fetchUploadFolder(mailboxId, UploadFolderMailboxType.Group);
    }
    return fetchUploadFolder();
}

function getGroupId(viewState: ComposeViewState): string | null {
    return viewState.attachmentWell?.groupId;
}

function getUploadText(viewState: ComposeViewState): string | null {
    return isGroupTableSelected() && getGroupId(viewState) ? loc(UploadToGroupFiles) : null;
}
