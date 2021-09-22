import { manageFilesText } from './FilesViewStrings.locstring.json';
import LoadingFileNode from './LoadingFileNode';
import getStore from '../store/store';
import { observer } from 'mobx-react-lite';
import { logUsage } from 'owa-analytics';
import { assertNever } from 'owa-assert';
import loc from 'owa-localize';
import { AttachmentFileNodeList, FilesTreeLoadState } from 'owa-mail-attachment-folder';
import TreeNode from 'owa-tree-node/lib/components/TreeNode';
import { getFilesHubPath } from 'owa-url';
import { getHostLocation } from 'owa-url/lib/hostLocation';
import * as React from 'react';

const AttachmentFilesList = observer(function AttachmentFilesList() {
    const url = getFilesHubPath() + getHostLocation().search;

    return (
        <>
            {renderFilesNodes()}
            {renderManageFilesComponent()}
        </>
    );

    function renderFilesNodes(): JSX.Element {
        const loadState = getStore().loadState;
        switch (loadState) {
            case FilesTreeLoadState.notLoaded:
                return renderLoadingFilesList();
            case FilesTreeLoadState.loaded:
            case FilesTreeLoadState.loadFailed:
                return <AttachmentFileNodeList />;
            default:
                return assertNever(loadState);
        }
    }

    function renderLoadingFilesList() {
        return (
            <>
                <LoadingFileNode index={'1'} />
                <LoadingFileNode index={'2'} />
            </>
        );
    }

    function preventDefault(evt: React.MouseEvent<unknown>) {
        evt.stopPropagation();
        evt.preventDefault();
    }

    function onManageFilesNodeClicked() {
        const loadState = getStore().loadState;
        logUsage('WVNManageFilesClickedFromFolderTree', { loadState: loadState }, { isCore: true });
        window.open(url, '_blank');
    }

    function renderManageFilesComponent(): JSX.Element {
        return (
            <TreeNode
                displayName={loc(manageFilesText)}
                isCustomActionNode={true}
                isRootNode={false}
                key={'manageFiles'}
                onClick={onManageFilesNodeClicked}
                onContextMenu={preventDefault}
            />
        );
    }
});
export default AttachmentFilesList;
