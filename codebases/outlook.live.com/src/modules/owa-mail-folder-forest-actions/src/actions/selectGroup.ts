import datapoints from './datapoints';
import selectNodeInFolderForest from './selectNodeInFolderForest';
import onAfterSelectingNode from './helpers/onAfterSelectingNode';
import {
    lazyLoadGroupAction,
    lazyOnAfterNewGroupSelected,
    lazyOnAfterGroupDetailsSucceeded,
} from 'owa-group-shared-actions';
import { lazySetGroupHeaderCallbacks } from 'owa-group-header-actions';
import { lazySetGroupFilesHubCallbacks } from 'owa-group-fileshub-init';
import { folderForestStore, getSelectedNode } from 'owa-mail-folder-forest-store';
import { FolderForestNode, FolderForestNodeType } from 'owa-favorites-types';
import type { FolderForestTreeType } from 'owa-graph-schema';
import { mutatorAction } from 'satcheljs';
import { wrapFunctionForDatapoint } from 'owa-analytics';

export interface SelectGroupState {
    selectedNode: FolderForestNode;
}

/**
 * Switch Group action, extracted to accurately track the SwitchGroup CTQ
 * by returning a promise for selecting the node
 * @param groupId the groupId
 */
const switchGroup = wrapFunctionForDatapoint(
    datapoints.switchGroup,
    function switchGroup(groupId: string, treeType: FolderForestTreeType): Promise<void> {
        return selectGroupInternal(groupId, treeType);
    }
);

/**
 * NavigateFromMeToWe action, extracted to accurately track the
 * NavigateFromMeToWe CTQ by returning a promise for selecting the node
 * @param groupId the groupId
 */
const navigateFromMeToWe = wrapFunctionForDatapoint(
    datapoints.navigateFromMeToWe,
    function navigateFromMeToWe(groupId: string, treeType: FolderForestTreeType): Promise<void> {
        return selectGroupInternal(groupId, treeType);
    }
);

/**
 * General select group action
 * @param groupId
 */
function selectGroupInternal(groupId: string, treeType: FolderForestTreeType): Promise<void> {
    return selectNodeInFolderForest({
        id: groupId,
        type: FolderForestNodeType.Group,
        treeType: treeType,
    });
}

/**
 * Select a group
 * @param groupId the groupId
 */
export default wrapFunctionForDatapoint(
    datapoints.selectGroup,
    async function selectGroup(
        groupId: string,
        treeType: FolderForestTreeType,
        onLoadGroupSuccess?: () => void,
        onLoadGroupError?: () => void
    ) {
        const currentNode = getSelectedNode();
        let groupLoadPromises = Promise.resolve();
        if (currentNode.id && currentNode.id.toLowerCase() == groupId.toLowerCase()) {
            // Do not perform the rest of selecting group logic when
            // user navigates to the node with the same id
            // (Switch between favorites and groups list in the left nav)
            setSelectedNodeTreeType(treeType);
        } else {
            // route the action based on whether or not it should be logged
            // as switchGroup or navigateFromMeToWe
            if (currentNode.type == FolderForestNodeType.Group) {
                switchGroup(groupId, treeType);
            } else {
                navigateFromMeToWe(groupId, treeType);
            }
            const onSuccess = () => {
                lazyOnAfterGroupDetailsSucceeded.importAndExecute(groupId);
                if (onLoadGroupSuccess) {
                    onLoadGroupSuccess();
                }
            };
            groupLoadPromises = Promise.all([
                lazyLoadGroupAction.import().then(loadGroupAction => {
                    loadGroupAction(
                        groupId,
                        true /* skipGetMembers */,
                        onSuccess,
                        onLoadGroupError
                    );
                }),
                lazySetGroupHeaderCallbacks.importAndExecute(),
                lazySetGroupFilesHubCallbacks.importAndExecute(),
            ]).then(() => lazyOnAfterNewGroupSelected.importAndExecute(groupId));
        }
        // Called after selecting same/different group
        // #15945 - We should try to merge SelectFolder, SelectPersona, SelectGroup logic and move this method into a common place
        onAfterSelectingNode();
        await groupLoadPromises;
    }
);

const setSelectedNodeTreeType = mutatorAction(
    'setSelectedNodeTreeType',
    (treeType: FolderForestTreeType) => {
        folderForestStore.selectedNode.treeType = treeType;
    }
);
