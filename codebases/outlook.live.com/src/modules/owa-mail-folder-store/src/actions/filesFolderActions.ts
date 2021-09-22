import { action } from 'satcheljs';

export const onFilesFolderShown = action('ON_FILES_FOLDER_SHOWN', (isExpanded: boolean) => ({
    isExpanded: isExpanded,
}));

export const onFilesTreeRootNodeClicked = action(
    'FILES_TREE_ROOT_NODE_CLICKED',
    (isExpanded: boolean) => ({
        isExpanded: isExpanded,
    })
);
