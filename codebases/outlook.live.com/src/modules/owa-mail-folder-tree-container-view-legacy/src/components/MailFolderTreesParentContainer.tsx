import * as React from 'react';
import PrimaryMailFolderTreeContainer from './PrimaryMailFolderTreeContainer';
import { ArchiveMailFolderTreeContainer, SharedFolderTreeParentContainer } from './lazyFolderTrees';
import { getArchiveFolderTreeRootFolder } from 'owa-folders';
import { observer } from 'mobx-react';
import { LazyFolderPermissionsDialog } from 'owa-mail-folder-permissions';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export interface MailFolderTreesParentContainerProps {
    isFavoriteOrGroupListShown: boolean;
    leftNavStyleWithSectionHeaders: string;
    leftNavStyleWithNoSectionHeaders: string;
    setSize: number;
    positionInSet: number;
    primarySmtp?: string;
    showRootNode?: boolean;
}

/**
 * Parent container component hosting primary, archive and shared folder tree containers
 */
function MailFolderTreesParentContainer(props: MailFolderTreesParentContainerProps) {
    const {
        leftNavStyleWithSectionHeaders,
        leftNavStyleWithNoSectionHeaders,
        isFavoriteOrGroupListShown,
        showRootNode,
        primarySmtp,
        setSize,
    } = props;

    let { positionInSet } = props;

    // Primary root node should be shown in case of any one of the Favorites or Groups or Archive mailbox or Shared Folders is shown
    const shouldShowPrimaryRootNode =
        showRootNode !== undefined ? showRootNode : isFavoriteOrGroupListShown || !isConsumer();
    const { PolicySettings } = getUserConfiguration();

    return (
        <>
            <PrimaryMailFolderTreeContainer
                showRootNode={shouldShowPrimaryRootNode}
                className={
                    shouldShowPrimaryRootNode
                        ? leftNavStyleWithSectionHeaders
                        : leftNavStyleWithNoSectionHeaders
                }
                primarySmtp={primarySmtp}
                setSize={setSize}
                positionInSet={positionInSet}
            />
            {!isConsumer() && (
                <>
                    {PolicySettings.ShowOnlineArchiveEnabled &&
                        getArchiveFolderTreeRootFolder() != null && (
                            <ArchiveMailFolderTreeContainer
                                className={leftNavStyleWithSectionHeaders}
                                setSize={setSize}
                                positionInSet={++positionInSet}
                            />
                        )}
                    <SharedFolderTreeParentContainer
                        className={leftNavStyleWithSectionHeaders}
                        setSize={setSize}
                        positionInSet={++positionInSet}
                    />
                    <LazyFolderPermissionsDialog />
                </>
            )}
        </>
    );
}
export default observer(MailFolderTreesParentContainer);
