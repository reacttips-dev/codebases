import { ARCHIVE_FOLDERS_TREE_TYPE, SHARED_FOLDERS_TREE_TYPE } from 'owa-folders-constants';
import { getSelectedNode } from 'owa-mail-folder-forest-store';

// To fix the XRF access issue, we set RemoteExecute for archive and shared folder scenarios.
// For CreateItem, we do not set X-AnchorMailbox header, the request will always hit primary mailbox user's mailbox server.
// On server side code, we have code fix to check the flag when reply/replyall/forward emails.
export default function shouldRemoteExecuteForSelectedNode() {
    const selectedNode = getSelectedNode();
    return !!(
        selectedNode &&
        (selectedNode.treeType === SHARED_FOLDERS_TREE_TYPE ||
            selectedNode.treeType === ARCHIVE_FOLDERS_TREE_TYPE)
    );
}
