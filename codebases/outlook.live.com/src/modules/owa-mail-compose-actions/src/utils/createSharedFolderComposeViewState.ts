import type {
    SharedFolderComposeViewState,
    SharedFolderComposeViewStateInitProps,
} from 'owa-mail-compose-store';
import createMailComposeViewState from './createMailComposeViewState';

export default function createSharedFolderComposeViewState(
    props: SharedFolderComposeViewStateInitProps
): SharedFolderComposeViewState {
    return <SharedFolderComposeViewState>{
        ...createMailComposeViewState(props),
        isInSharedFolder: props.isInSharedFolder,
        folderOwnerEmailAddress: props.folderOwnerEmailAddress,
        folderPermission: props.folderPermission,
    };
}
