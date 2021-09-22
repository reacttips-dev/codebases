import { onFilesTreeRootNodeClicked } from '../actions/filesFolderActions';
import toggleFolderNodeExpansion from '../actions/toggleFolderNodeExpansion';
import { filesFolderId } from '../utils/constants';
import { orchestrator } from 'satcheljs';

export default orchestrator(onFilesTreeRootNodeClicked, () => {
    toggleFolderNodeExpansion(filesFolderId);
});
