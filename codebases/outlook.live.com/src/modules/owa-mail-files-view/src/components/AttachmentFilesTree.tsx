import AttachmentFilesList from './AttachmentFilesList';
import { filesHeaderText } from './FilesViewStrings.locstring.json';
import {
    filesFolderId,
    onFilesTreeRootNodeClicked,
    onFilesFolderShown,
} from 'owa-mail-folder-store';
import getStore from '../store/store';
import { observer } from 'mobx-react-lite';
import { AriaProperties, AriaRoles, generateDomPropertiesForAria } from 'owa-accessibility';
import { logUsage } from 'owa-analytics';
import loc from 'owa-localize';
import { lazyInitializeAttachmentsFolder } from 'owa-mail-attachment-folder';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import TreeNode from 'owa-tree-node/lib/components/TreeNode';
import * as React from 'react';

export interface AttachmentFilesTreeProps extends React.HTMLProps<HTMLDivElement> {
    setSize?: number;
    positionInSet?: number;
    classname?: string;
}

const AttachmentFilesTree = observer(function AttachmentFilesTree(props: AttachmentFilesTreeProps) {
    async function initialize() {
        const initializeAttachmentsFolder = await lazyInitializeAttachmentsFolder.import();
        initializeAttachmentsFolder();

        const viewStates = getUserConfiguration().ViewStateConfiguration.FolderViewState || [];
        let filesFolderViewState;
        for (let i = 0; i < viewStates.length; i++) {
            const folderViewState = JSON.parse(viewStates[i]);
            if (folderViewState.FolderId.Id === filesFolderId) {
                filesFolderViewState = folderViewState;
                break;
            }
        }
        const isExpanded = !filesFolderViewState || filesFolderViewState.IsExpanded;
        onFilesFolderShown(isExpanded);
    }

    React.useEffect(() => {
        initialize();
    }, []);

    const ariaProps: AriaProperties = {
        role: AriaRoles.tree,
    };

    function onRootNodeContextMenu(evt: React.MouseEvent<unknown>) {
        evt.stopPropagation();
        evt.preventDefault();
    }

    function onClick(evt: React.MouseEvent<unknown>) {
        evt.stopPropagation();
        const isExpanded = getStore().isExpanded;
        logUsage(
            'WVNFilesNodeExpansionToggled',
            { isCurrentlyExpanded: isExpanded },
            { isCore: true }
        );
        onFilesTreeRootNodeClicked(!isExpanded);
    }

    const isFilesTreeExpanded = getStore().isExpanded;

    function renderFilesRoot(isFilesTreeExpanded: boolean): JSX.Element {
        return (
            <TreeNode
                chevronProps={{ isExpanded: isFilesTreeExpanded, onClick: onClick }}
                displayName={loc(filesHeaderText)}
                depth={0}
                isRootNode={true}
                isSelected={false}
                key="filesRoot"
                onClick={onClick}
                onContextMenu={onRootNodeContextMenu}
                setSize={props.setSize}
                positionInSet={props.positionInSet}
            />
        );
    }

    return (
        <div
            style={props.style}
            className={props.className}
            {...generateDomPropertiesForAria(ariaProps)}>
            {renderFilesRoot(isFilesTreeExpanded)}
            {isFilesTreeExpanded && <AttachmentFilesList key="filesList" />}
        </div>
    );
});
export default AttachmentFilesTree;
