import { observer } from 'mobx-react-lite';
import { useManagedMutation } from 'owa-apollo-hooks';
import type { MailboxInfo } from 'owa-client-ids';
import { lazyCreateNewFolder } from 'owa-folder-createnew';
import { CreateFolderDocument } from 'owa-folder-createnew/lib/graphql/__generated__/CreateFolderMutation.interface';
import {
    ARCHIVE_FOLDERS_TREE_TYPE,
    PRIMARY_FOLDERS_TREE_TYPE,
    SHARED_FOLDERS_TREE_TYPE,
} from 'owa-folders-constants';
import type { FolderForestTreeType } from 'owa-graph-schema';
import loc, { format } from 'owa-localize';
import { lazyDismissMailFolderTextField } from 'owa-mail-folder-store';
import { initiateMailFolderTextField } from 'owa-mail-folder-store/lib/actions/folderTextFieldActions';
import { RenameFolderDocument } from 'owa-mail-folder-store/lib/graphql/__generated__/RenameFolderMutation.interface';
import TreeNode from 'owa-tree-node/lib/components/TreeNode';
import * as React from 'react';
import {
    newFolderAction,
    newFolderAnnouncementText,
    renameFolderAnnouncementText,
} from './FolderOperation.locstring.json';
import FolderTextField from './FolderTextField';
import { shouldRenderNodeInEditMode } from './utils/shouldRenderNodeInEditMode';

export interface FolderOperationNodeProps {
    folderId: string;
    treeType: FolderForestTreeType;
    nestDepth: number;
    operationType: string;
    originalValue?: string;
    mailboxInfo: MailboxInfo;
    ariaAnnouncementLabel?: string;
}

export default observer(function FolderOperationNode(props: FolderOperationNodeProps) {
    const [folderUpdateText, setFolderUpdateText] = React.useState('');
    const [createFolderMutation] = useManagedMutation(CreateFolderDocument);
    const [renameFolderMutation] = useManagedMutation(RenameFolderDocument);

    const onNewFolderTextFieldEntry = React.useCallback(
        (value: string) => {
            lazyDismissMailFolderTextField.importAndExecute();

            const parentId = props.folderId;
            lazyCreateNewFolder.importAndExecute(createFolderMutation, {
                parentId: parentId,
                displayName: value,
                mailboxInfo: props.mailboxInfo,
            });
            setFolderUpdateText(format(loc(newFolderAnnouncementText), value));
        },
        [setFolderUpdateText, props.folderId]
    );

    const onRenameFolderTextFieldEntry = React.useCallback(
        (value: string, folderId: string) => {
            lazyDismissMailFolderTextField.importAndExecute();

            const oldFolderName = props.originalValue;
            const newFolderName = (value || '').trim(); // remove trailing whitespace

            if (!newFolderName || newFolderName === oldFolderName) {
                // Folder name didn't change. So nothing more
                return;
            }

            renameFolderMutation({
                variables: {
                    id: folderId,
                    newDisplayName: newFolderName,
                    mailboxInfo: props.mailboxInfo,
                },
                optimisticResponse: {
                    __typename: 'Mutation',
                    renameFolder: {
                        id: folderId,
                        __typename: 'MailFolder',
                        DisplayName: newFolderName,
                    },
                },
            });

            const announcementText = props.ariaAnnouncementLabel || renameFolderAnnouncementText;
            setFolderUpdateText(format(loc(announcementText), value));
        },
        [setFolderUpdateText]
    );

    const onNewFolderNodeClicked = React.useCallback(
        (evt: React.MouseEvent<unknown> | React.KeyboardEvent) => {
            evt.stopPropagation();
            evt.preventDefault();
            initiateMailFolderTextField(
                props.folderId,
                'new',
                props.treeType,
                props.mailboxInfo.mailboxSmtpAddress
            );
        },
        [props.folderId, props.treeType]
    );

    let nodeToReturn;
    if (
        props.operationType == 'new' ||
        (props.operationType == 'newNode' &&
            shouldRenderNodeInEditMode(props.folderId, 'new', props.mailboxInfo.mailboxSmtpAddress))
    ) {
        nodeToReturn = (
            <FolderTextField nestDepth={props.nestDepth} onEntry={onNewFolderTextFieldEntry} />
        );
    } else if (props.operationType == 'rename') {
        nodeToReturn = (
            <FolderTextField
                nestDepth={props.nestDepth}
                onEntry={onRenameFolderTextFieldEntry}
                defaultValue={props.originalValue}
                folderId={props.folderId}
            />
        );
    } else if (
        props.operationType == 'newNode' &&
        (props.treeType === PRIMARY_FOLDERS_TREE_TYPE ||
            props.treeType === ARCHIVE_FOLDERS_TREE_TYPE ||
            props.treeType === SHARED_FOLDERS_TREE_TYPE)
    ) {
        nodeToReturn = (
            <TreeNode
                displayName={loc(newFolderAction)}
                isCustomActionNode={true}
                isRootNode={false}
                key={'newFolder'}
                onClick={onNewFolderNodeClicked}
            />
        );
    }

    if (nodeToReturn) {
        return (
            <>
                {nodeToReturn}
                <span className="screenReaderOnly" aria-live="assertive" aria-atomic="true">
                    {folderUpdateText}
                </span>
            </>
        );
    }

    return null;
});
