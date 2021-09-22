import { observer } from 'mobx-react-lite';
import { getGroupsFailedTooltip } from './GroupListTree.locstring.json';
import {
    groupsLeftNav_NewFamilyGroupButton,
    groupsLeftNav_NewGroupButton,
    groupsLeftNav_DiscoverGroupsButton,
    groupsLeftNav_ManageGroupsButton,
} from '../strings.locstring.json';
import loc from 'owa-localize';
import GroupContextMenu from './GroupContextMenu';
import GroupRootContextMenu from './GroupRootContextMenu';
import { GroupRightCharm, GroupRightCharmHover } from './GroupRightCharm';
import { openCreateGroup, openDiscoverGroups } from '../actions/internalActions';
import { onManageGroups } from '../actions/onManageGroup';
import dropMailListRowsOnGroup from '../actions/dropMailListRowsOnGroup';
import { GroupList } from 'owa-group-left-nav';
import { lazyToggleGroupTreeExpansion } from 'owa-group-left-nav-actions';
import { subscribeToAllGroupsUnreadNotifications } from 'owa-group-left-nav-actions/lib/actions/groupsUnreadNotificationsStrategy';
import type LeftNavGroupsContextMenuSchema from 'owa-group-left-nav/lib/store/schema/LeftNavGroupsContextMenu';
import { getLeftNavGroupsStore } from 'owa-group-left-nav/lib/store/store';
import { getGroupsStore } from 'owa-groups-shared-store';
import type GroupInformation from 'owa-groups-shared-store/lib/schema/GroupInformation';
import { getUnifiedGroupsSettingsStore } from 'owa-groups-shared-store/lib/UnifiedGroupsSettingsStore';
import { isGroupNodeSelected, lazySelectGroup } from 'owa-mail-folder-forest-actions';
import { getAnchorForContextMenu } from 'owa-positioning';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { lazyLogFloodgateActivity } from 'owa-floodgate-feedback-view';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import TreeNode, { ChevronProps } from 'owa-tree-node/lib/components/TreeNode';
import * as React from 'react';
import {
    hideGroupContextMenu,
    showGroupContextMenu,
} from 'owa-group-left-nav/lib/actions/showHideGroupContextMenu';
import type { DragData } from 'owa-dnd/lib/utils/dragDataUtil';
import { DraggableItemTypes } from 'owa-dnd/lib/utils/DraggableItemTypes';
import type { MailListRowDragData } from 'owa-mail-types/lib/types/MailListRowDragData';
import { Icon } from '@fluentui/react/lib/Icon';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import { DirectionalHint } from '@fluentui/react/lib/Callout';
import { isFeatureEnabled } from 'owa-feature-flags';
import { ControlIcons } from 'owa-control-icons';
import { isConsumer } from 'owa-session-store';
import { logUsage } from 'owa-analytics';
import {
    lazyLoadGroupFolders,
    lazyToggleGroupListNodeExpansion,
} from 'owa-group-folder-tree-actions';
import { GroupFolderChildren, getGroupFolderChildFolders } from 'owa-group-left-nav-folders-mail';
import { groupListNodesViewStateStore } from 'owa-group-left-nav-folders-store';

import styles from './GroupListTree.scss';

export interface GroupListTreeProps {
    className?: string;
    setSize?: number;
    positionInSet?: number;
}

const leftNavGroupsStore = getLeftNavGroupsStore();
const groupsStore = getGroupsStore();
const floodgateSurveyDelay = 1000;

/**
 * Group list that renders a root node and all groups supplied to it and their children.
 */
export default observer(function GroupListTree(props: GroupListTreeProps) {
    const isGroupsTreeCollapsed = getUserConfiguration().UserOptions.IsGroupsTreeCollapsed;
    return (
        <GroupList
            className={props.className}
            selectGroup={selectGroupInternal}
            isSelected={isGroupNodeSelectedInternal}
            isGroupsTreeCollapsed={isGroupsTreeCollapsed}
            toggleGroupTreeExpansion={toggleGroupTreeExpansion}
            renderGroupListCustomNodes={buttonsToRender}
            renderRightCharm={renderRightCharm}
            renderRightCharmHover={renderRightCharmHover}
            onChildNodeContextMenuOpened={onContextMenuOpened}
            renderChildNodeContextMenu={renderGroupListItemContextMenu}
            onRootNodeContextMenuOpened={onRootContextMenuOpened}
            renderRootNodeContextMenu={renderGroupRootContextMenu}
            renderRootNodeRightCharm={renderGroupRootNodeRightCharm}
            renderRootNodeRightCharmHover={renderGroupRootNodeRightCharm}
            onListNodeDrop={onListNodeDrop}
            canDropOnListNode={canDropOnListNode}
            onMouseEnterShowMoreButton={subscribeToRemainingNotificationsIfNeeded}
            onShowMoreEvent={subscribeToRemainingNotificationsIfNeeded}
            setSize={props.setSize}
            positionInSet={props.positionInSet}
            renderGroupFolderChildren={renderGroupFolderChildren}
            groupListNodeChevronProps={getGroupListNodeChevronProps}
        />
    );
});

function renderGroupRootNodeRightCharm() {
    return leftNavGroupsStore.loadGroupsError ? (
        <TooltipHost
            content={loc(getGroupsFailedTooltip)}
            directionalHint={DirectionalHint.bottomCenter}>
            <Icon
                className={styles.errorIcon}
                title={''}
                iconName={ControlIcons.Error}
                ariaLabel={loc(getGroupsFailedTooltip)}
            />
        </TooltipHost>
    ) : null;
}

function hideGroupContextMenuInternal() {
    hideGroupContextMenu(leftNavGroupsStore);
}

function renderRightCharm(groupId: string, customData: any): JSX.Element {
    return <GroupRightCharm groupId={groupId} />;
}

function renderRightCharmHover(groupId: string, customData: any): JSX.Element {
    return <GroupRightCharmHover groupId={groupId} />;
}

function renderGroupFolderChildren(groupId: string): JSX.Element | null {
    const groupSmtp = groupId.toLowerCase();
    const folderIdsToRender = getGroupFolderChildFolders(groupSmtp);
    const groupViewState = groupListNodesViewStateStore.groupListNodesViewStates.get(groupSmtp);
    const shouldRenderFolders = groupViewState?.isExpanded && folderIdsToRender?.length > 0;

    if (shouldRenderFolders) {
        return (
            <GroupFolderChildren
                groupId={groupSmtp}
                nestDepth={2}
                folderIdsToRender={folderIdsToRender}
            />
        );
    }
    return null;
}

function getGroupListNodeChevronProps(groupId: string): ChevronProps {
    // Check if the node is expandable / should have chevrons
    const groupSmtp = groupId.toLowerCase();

    const onChevronClicked = (evt: React.MouseEvent<unknown> | KeyboardEvent) => {
        evt.stopPropagation();
        lazyToggleGroupListNodeExpansion.importAndExecute(groupSmtp);
    };
    const childFolders = getGroupFolderChildFolders(groupSmtp);

    if (childFolders?.length) {
        const isExpanded = groupListNodesViewStateStore.groupListNodesViewStates.get(groupSmtp)
            ?.isExpanded;
        return { isExpanded: isExpanded, onClick: onChevronClicked };
    }
    return undefined;
}

function selectGroupInternal(groupId: string, customData: any) {
    lazySelectGroup.importAndExecute(groupId, 'groups');
    if (
        isFeatureEnabled('tri-floodgateForConsumerGroups') &&
        isConsumer() &&
        isHostAppFeatureEnabled('floodgate')
    ) {
        setTimeout(function () {
            lazyLogFloodgateActivity.import().then(logFloodgateActivity => {
                logFloodgateActivity('ConsumerGroupsClicked');
            });
        }, floodgateSurveyDelay);
    }

    // load folder hierarchy for group
    if (isFeatureEnabled('grp-loadFolders')) {
        lazyLoadGroupFolders.importAndExecute(groupId.toLowerCase());
    }
}

function isGroupNodeSelectedInternal(groupId: string, customData: any): boolean {
    return isGroupNodeSelected(groupId, 'groups');
}

function toggleGroupTreeExpansion() {
    lazyToggleGroupTreeExpansion.importAndExecute();
}

function subscribeToRemainingNotificationsIfNeeded() {
    if (isFeatureEnabled('grp-unreadCountTop5AndFavorites')) {
        subscribeToAllGroupsUnreadNotifications();
    }
}

function onContextMenuOpened(evt: React.MouseEvent<HTMLElement>, group: GroupInformation) {
    showGroupContextMenu(
        leftNavGroupsStore,
        group.basicInformation.SmtpAddress,
        group,
        getAnchorForContextMenu(evt),
        false // IsRootNode
    );
}

function onRootContextMenuOpened(evt: React.MouseEvent<HTMLElement>) {
    const isGroupCreationEnabled = getUnifiedGroupsSettingsStore().groupCreationEnabled;
    const isDiscoverGroupsEnabled = !isConsumer();
    if (!isGroupCreationEnabled && !isDiscoverGroupsEnabled) {
        return null;
    }
    showGroupContextMenu(
        leftNavGroupsStore,
        null, // GroupId
        null, // GroupInformation
        getAnchorForContextMenu(evt),
        true // IsRootNode
    );
}

function noContextMenu(evt: React.MouseEvent<unknown>) {
    evt.stopPropagation();
    evt.preventDefault();
}

function launchCreateGroup(evt: React.MouseEvent<unknown>) {
    evt.stopPropagation();
    openCreateGroup();
}

function launchCreateFamilyGroup(evt: React.MouseEvent<unknown>) {
    evt.stopPropagation();
    const familyUrl = 'https://account.microsoft.com/family/';
    window.open(familyUrl);
}

function launchDiscoverGroups(evt: React.MouseEvent<unknown>) {
    evt.stopPropagation();
    openDiscoverGroups();
}

function onManageGroups_0(evt: React.MouseEvent<unknown>) {
    evt.stopPropagation();
    onManageGroups();
}

function onListNodeDrop(dragData: DragData, groupId: string) {
    const itemType = dragData.itemType;
    switch (itemType) {
        case DraggableItemTypes.MultiMailListMessageRows:
        case DraggableItemTypes.MailListRow:
            dropMailListRowsOnGroup(dragData as MailListRowDragData, groupId);
            break;
    }
}

function canDropOnListNode(dragData: DragData) {
    switch (dragData.itemType) {
        case DraggableItemTypes.MultiMailListMessageRows:
        case DraggableItemTypes.MailListRow:
            return 'move';
        default:
            return 'none';
    }
}

function renderCreateGroupButton(): JSX.Element {
    return (
        <TreeNode
            displayName={loc(groupsLeftNav_NewGroupButton)}
            isCustomActionNode={true}
            isRootNode={false}
            key={'NewGroup'}
            onClick={launchCreateGroup}
            onContextMenu={noContextMenu}
        />
    );
}

function renderCreateFamilyGroupButton(): JSX.Element {
    return (
        <TreeNode
            displayName={loc(groupsLeftNav_NewFamilyGroupButton)}
            isCustomActionNode={true}
            isRootNode={false}
            key={'NewFamilyGroup'}
            onClick={launchCreateFamilyGroup}
            onContextMenu={noContextMenu}
        />
    );
}

function renderDiscoverGroupsButton(): JSX.Element {
    return (
        <TreeNode
            displayName={loc(groupsLeftNav_DiscoverGroupsButton)}
            isCustomActionNode={true}
            isRootNode={false}
            key={'DiscoverGroups'}
            onClick={launchDiscoverGroups}
            onContextMenu={noContextMenu}
        />
    );
}

function renderManageGroupsButton(): JSX.Element {
    return (
        <TreeNode
            displayName={loc(groupsLeftNav_ManageGroupsButton)}
            isCustomActionNode={true}
            isRootNode={false}
            key={'ManageGroups'}
            onClick={onManageGroups_0}
            onContextMenu={noContextMenu}
        />
    );
}

function renderGroupListItemContextMenu(
    withContextMenuGroup: LeftNavGroupsContextMenuSchema
): JSX.Element {
    return (
        <GroupContextMenu
            anchorPoint={withContextMenuGroup.anchor}
            groupId={withContextMenuGroup.group.basicInformation.SmtpAddress}
            onDismiss={hideGroupContextMenuInternal}
        />
    );
}

function renderGroupRootContextMenu(
    withContextMenuGroup: LeftNavGroupsContextMenuSchema
): JSX.Element {
    return (
        <GroupRootContextMenu
            anchorPoint={withContextMenuGroup.anchor}
            onDismiss={hideGroupContextMenuInternal}
        />
    );
}

function renderCreateGroupButtonAndModal(isGroupsTreeCollapsed: boolean): JSX.Element {
    const isGroupCreationEnabled = getUnifiedGroupsSettingsStore().groupCreationEnabled;
    if (!isGroupCreationEnabled) {
        return null;
    }
    return <div>{!isGroupsTreeCollapsed && renderCreateGroupButton()}</div>;
}

function renderCreateFamilyGroupButtonAndModal(isGroupsTreeCollapsed: boolean): JSX.Element {
    const isCreateFamilyGroupEnabled = isConsumer() && isFeatureEnabled('grp-create-family-group');
    if (!isCreateFamilyGroupEnabled) {
        return null;
    }

    const isFamilyGroupPresent = leftNavGroupsStore.hasLoadedFromServer && hasFamilyGroup();
    return (
        <div>
            {!isGroupsTreeCollapsed && !isFamilyGroupPresent && renderCreateFamilyGroupButton()}
        </div>
    );
}

function hasFamilyGroup(): boolean {
    for (let groupId of leftNavGroupsStore.myOrgGroups) {
        const group = groupsStore.groups.get(groupId);
        if (group?.basicInformation?.Kind == 3) {
            return true;
        }
    }

    return false;
}

function renderDiscoverGroupsButtonAndModal(isGroupsTreeCollapsed: boolean): JSX.Element {
    const isDiscoverGroupsEnabled = !isConsumer();
    if (!isDiscoverGroupsEnabled) {
        return null;
    }
    return <div>{!isGroupsTreeCollapsed && renderDiscoverGroupsButton()}</div>;
}

function renderManageGroupsButtonAndModal(isGroupsTreeCollapsed: boolean): JSX.Element {
    const isManageGroupsEnabled = !isConsumer();
    if (!isManageGroupsEnabled) {
        return null;
    } else {
        logUsage('ManageGroupsRendered');
    }
    return <div>{!isGroupsTreeCollapsed && renderManageGroupsButton()}</div>;
}

function buttonsToRender() {
    const isGroupsTreeCollapsed = getUserConfiguration().UserOptions.IsGroupsTreeCollapsed;
    return [
        renderCreateGroupButtonAndModal(isGroupsTreeCollapsed),
        renderCreateFamilyGroupButtonAndModal(isGroupsTreeCollapsed),
        renderDiscoverGroupsButtonAndModal(isGroupsTreeCollapsed),
        renderManageGroupsButtonAndModal(isGroupsTreeCollapsed),
    ];
}
