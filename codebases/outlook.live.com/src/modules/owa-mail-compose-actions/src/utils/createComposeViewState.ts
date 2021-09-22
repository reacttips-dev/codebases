import type {
    ComposeViewState,
    MailComposeViewStateInitProps,
    ComposeViewStateInitProps,
    SharedFolderComposeViewStateInitProps,
} from 'owa-mail-compose-store';
import { isPublicFolder } from 'owa-folders';
import createMailComposeViewState from './createMailComposeViewState';
import createGroupComposeViewState from '../utils/createGroupComposeViewState';
import createPublicFolderComposeViewState from '../utils/createPublicFolderComposeViewState';
import createSharedFolderComposeViewState from '../utils/createSharedFolderComposeViewState';

export default function createComposeViewState(
    initProps: ComposeViewStateInitProps,
    targetId?: string //target could be publicfolder or group
): ComposeViewState {
    const viewState = targetId
        ? isPublicFolder(targetId)
            ? createPublicFolderComposeViewState({
                  publicFolderId: targetId,
                  ...initProps,
              })
            : createGroupComposeViewState({
                  groupId: targetId,
                  ...initProps,
              })
        : (<SharedFolderComposeViewStateInitProps>initProps).isInSharedFolder
        ? createSharedFolderComposeViewState(<SharedFolderComposeViewStateInitProps>initProps)
        : createMailComposeViewState(<MailComposeViewStateInitProps>initProps);

    return viewState;
}
