import { observer } from 'mobx-react-lite';
/* tslint:disable:jsx-no-lambda WI:47728 */
import * as React from 'react';
import TreeNode, { ChevronProps } from 'owa-tree-node/lib/components/TreeNode';
import { ControlIcons } from 'owa-control-icons';
import type { PublicFolder } from '../store/publicFolderTable';
import publicFolderPickerStore from '../store/publicFolderPickerStore';
import { loadPublicFolder } from '../actions/loadPublicFolders';
import { selectPublicFolderNode } from '../actions/updatePublicFolderPickerProps';
import { togglePublicFolderNodeExpansion } from '../actions/updatePublicFolder';
import getPublicFolderFromFolderId from '../selectors/getPublicFolderFromFolderId';
import { isPublicFolderInFavorites } from 'owa-favorites';
import removePublicFolderFromFavorites from '../actions/removePublicFolderFromFavorites';

import styles from './styles/PublicFolderPicker.scss';

export interface PublicFolderNodeProps {
    depth: number; // root is 0, every sub node increase this number by 1.
    folderId: string;
}

export default observer(function PublicFolderNode(props: PublicFolderNodeProps) {
    const renderMyTreeNodeDisplay = React.useRef(function (folder: PublicFolder) {
        switch (folder.FolderClass) {
            case 'IPF.Note':
            case 'IPF.Appointment':
            case 'IPF.Contact':
                return <span> {folder.DisplayName} </span>;
            default:
                return <span className={styles.greyed}> {folder.DisplayName} </span>;
        }
    });
    const folder_0 = {
        get(): PublicFolder {
            return getPublicFolderFromFolderId(props.folderId);
        },
    };
    const getChevronProps = (folder: PublicFolder): ChevronProps => {
        // Check if the node is expandable / should have chevrons
        if (isFolderExpandable(folder)) {
            return { isExpanded: folder.isExpanded, onClick: onChevronClicked };
        } else {
            return null;
        }
    };
    const onChevronClicked = (evt: React.MouseEvent<unknown> | KeyboardEvent) => {
        evt.stopPropagation();
        togglePublicFolderNodeExpansion(folder_0.get());
        if (folder_0.get().isExpanded) {
            loadPublicFolder(props.folderId);
        }
    };
    const onClick = (evt: React.MouseEvent<unknown> | KeyboardEvent) => {
        selectPublicFolderNode(folder_0.get().FolderId.Id);
    };
    const chevronProps: ChevronProps = getChevronProps(folder_0.get());
    const toggleFavorite = () => {
        removePublicFolderFromFavorites(folder_0.get());
    };
    return (
        <TreeNode
            chevronProps={chevronProps}
            customIcon={getIconFromType(folder_0.get().FolderClass)}
            depth={props.depth}
            displayName={folder_0.get().DisplayName}
            key={props.folderId}
            isRootNode={false}
            onClick={onClick}
            isSelected={folder_0.get().FolderId.Id == publicFolderPickerStore.selectedFolderId}
            renderCustomTreeNodeDisplay={() => {
                return renderMyTreeNodeDisplay.current(folder_0.get());
            }}
            isFavorited={isPublicFolderInFavorites(props.folderId)}
            toggleFavorite={toggleFavorite}
        />
    );
});

function getIconFromType(folderClass: string) {
    switch (folderClass) {
        case 'IPF.Note':
            return ControlIcons.Mail;
        case 'IPF.Appointment':
            return ControlIcons.Calendar;
        case 'IPF.Contact':
            return ControlIcons.Contact;
        default:
            return ControlIcons.FabricFolder;
    }
}

function isFolderExpandable(folder: PublicFolder) {
    if (folder != null && folder.ChildFolderCount == 0) {
        return false;
    }
    return true;
}
