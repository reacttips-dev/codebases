import { observer } from 'mobx-react-lite';
import { AriaProperties, AriaRoles, generateDomPropertiesForAria } from 'owa-accessibility';
import { logUsage } from 'owa-analytics';
import Droppable from 'owa-dnd/lib/components/Droppable';
import type DropEffect from 'owa-dnd/lib/store/schema/DropEffect';
import createDropViewState from 'owa-dnd/lib/utils/createDropViewState';
import type { DragData } from 'owa-dnd/lib/utils/dragDataUtil';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getGroupsStore } from 'owa-groups-shared-store';
import type GroupInformation from 'owa-groups-shared-store/lib/schema/GroupInformation';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import loc from 'owa-localize';
import type UnifiedGroup from 'owa-service/lib/contract/UnifiedGroup';
import TreeNode, { ChevronProps } from 'owa-tree-node/lib/components/TreeNode';
import * as React from 'react';
import toggleIsShowingAllGroups from '../mutators/toggleIsShowingAllGroups';
import type LeftNavGroupsContextMenuSchema from '../store/schema/LeftNavGroupsContextMenu';
import { getLeftNavGroupsStore } from '../store/store';
import { MAX_GROUP_NODES_WHEN_COLLAPSED } from '../utils/constants';
import {
    Groups,
    groupsLeftNav_ShowLessButton,
    groupsLeftNav_ShowMoreButton,
} from './GroupList.locstring.json';
import GroupListNode from './GroupListNode';

export interface GroupListProps extends React.HTMLProps<HTMLDivElement> {
    selectGroup: (groupId: string, customData: any) => void; // select group callback when a node is selected.
    isSelected: (groupId: string, customData: any) => boolean; // Callback to determine if a given node is selected
    isGroupsTreeCollapsed: boolean;
    toggleGroupTreeExpansion: () => void;
    renderRightCharm: (groupId: string, customData: any) => JSX.Element;
    renderRightCharmHover: (groupId: string, customData: any) => JSX.Element;
    onChildNodeContextMenuOpened: (evt: React.MouseEvent<unknown>, group: GroupInformation) => void; // Callback to be called to open the Child Nodes context menu
    renderGroupListCustomNodes: () => JSX.Element[];
    canDropOnListNode?: (dragData: DragData) => DropEffect;
    customData?: any;
    onListNodeDrop?: (dragData: DragData, groupId: string) => void;
    onRootNodeContextMenuOpened?: (evt: React.MouseEvent<unknown>) => void; // Callback to be called to open the group root node context menu
    renderChildNodeContextMenu?: (
        withContextMenuGroup: LeftNavGroupsContextMenuSchema
    ) => JSX.Element; // The context menu that should be rendered when right clicking on a Child Node
    renderRootNodeContextMenu?: (
        withContextMenuGroup: LeftNavGroupsContextMenuSchema
    ) => JSX.Element; // The context menu that should be rendered when right clicking on the group root node
    renderRootNodeRightCharm?: () => JSX.Element;
    renderRootNodeRightCharmHover?: () => JSX.Element;
    onMouseEnterShowMoreButton?: () => void;
    onShowMoreEvent?: () => void;
    setSize?: number;
    positionInSet?: number;
    renderGroupFolderChildren?: (groupId: string) => JSX.Element | null; // function to render child folders of a group
    groupListNodeChevronProps?: (groupId: string) => ChevronProps; // Chevronprops for a group - to render chevron to the left of group node
}

const groupsStore = getGroupsStore();
const leftNavGroupsStore = getLeftNavGroupsStore();

/**
 * Group list that renders a root node and all groups supplied to it and their children.
 */
export default observer(function GroupList(props: GroupListProps) {
    const isDragOverExpandCollapseNode = React.useRef(false);
    const renderNode = (group: UnifiedGroup): JSX.Element => {
        return (
            <GroupListNode
                selectGroup={props.selectGroup}
                isSelected={props.isSelected}
                renderRightCharm={props.renderRightCharm}
                renderRightCharmHover={props.renderRightCharmHover}
                displayName={group.DisplayName}
                groupId={group.SmtpAddress}
                key={group.SmtpAddress}
                onContextMenu={props.onChildNodeContextMenuOpened}
                customData={props.customData}
                onListNodeDrop={props.onListNodeDrop}
                canDropOnListNode={props.canDropOnListNode}
                renderGroupFolderChildren={props.renderGroupFolderChildren}
                groupListNodeChevronProps={props.groupListNodeChevronProps}
            />
        );
    };
    const onRootNodeChevronClicked = (evt: React.MouseEvent<unknown> | KeyboardEvent) => {
        evt.stopPropagation();
        props.toggleGroupTreeExpansion();
    };
    const renderGroupRoot = (isGroupsTreeCollapsed: boolean): JSX.Element => {
        const chevronProps: ChevronProps = {
            isExpanded: !isGroupsTreeCollapsed,
            onClick: onRootNodeChevronClicked,
        };
        return (
            <TreeNode
                chevronProps={chevronProps}
                depth={0}
                displayName={loc(Groups)}
                isRootNode={isRootNode}
                key={'Groups_root'}
                onClick={chevronProps.onClick}
                onContextMenu={onRootContextMenu}
                renderRightCharm={props.renderRootNodeRightCharm}
                renderRightCharmHover={props.renderRootNodeRightCharmHover}
                setSize={props.setSize}
                positionInSet={props.positionInSet}
            />
        );
    };
    const isRootNode = !(
        isFeatureEnabled('nh-boot-acctmonaccounts') && isHostAppFeatureEnabled('acctmonaccounts')
    );

    const onRootContextMenu = (evt: React.MouseEvent<unknown>) => {
        const { onRootNodeContextMenuOpened } = props;
        if (onRootNodeContextMenuOpened) {
            evt.stopPropagation();
            evt.preventDefault();
            onRootNodeContextMenuOpened(evt);
        }
    };
    const renderChildren = (
        myOrgGroups: string[],
        isGroupsTreeCollapsed: boolean
    ): JSX.Element[] => {
        const renderedNodes: JSX.Element[] = [];
        if (isGroupsTreeCollapsed) {
            return renderedNodes;
        }
        /*
            We either show the top 5 Groups in Prankie order or all Groups sorted by DisplayName
        */
        if (leftNavGroupsStore.shouldShowAllGroups) {
            const unsortedGroups: GroupInformation[] = [];
            myOrgGroups.forEach(groupId => {
                const group = groupsStore.groups.get(groupId);
                unsortedGroups.push(group);
            });
            unsortedGroups
                .sort((group1: GroupInformation, group2: GroupInformation) => {
                    return group1.basicInformation.DisplayName.localeCompare(
                        group2.basicInformation.DisplayName
                    );
                })
                .forEach(group => {
                    renderedNodes.push(renderNode(group.basicInformation));
                });
        } else {
            myOrgGroups.slice(0, MAX_GROUP_NODES_WHEN_COLLAPSED).forEach(groupId => {
                const group = groupsStore.groups.get(groupId);
                renderedNodes.push(renderNode(group.basicInformation));
            });
        }
        return renderedNodes;
    };
    const renderCollapseExpandNode = (isGroupsTreeCollapsed: boolean): any => {
        if (isGroupsTreeCollapsed) {
            return null;
        }
        const nodeDisplayName = leftNavGroupsStore.shouldShowAllGroups
            ? loc(groupsLeftNav_ShowLessButton)
            : loc(groupsLeftNav_ShowMoreButton);
        const emptyDropViewState = createDropViewState();
        return (
            <Droppable
                dropViewState={emptyDropViewState}
                onDrop={onDropOnCollapseExpandNode}
                canDrop={canDropOnCollapseExpandNode}
                onDragOver={onDragOverCollapseExpandNode}
                onDragLeave={onDragLeaveCollapseExpandNode}>
                <TreeNode
                    displayName={nodeDisplayName}
                    isCustomActionNode={true}
                    isRootNode={false}
                    key={'groupsCollapseExpandNode'}
                    onClick={onCollapseExpandNodeClick}
                    onContextMenu={noContextMenu}
                    onMouseEnter={props.onMouseEnterShowMoreButton}
                />
            </Droppable>
        );
    };
    const canDropOnCollapseExpandNode = (dragData: DragData) => {
        if (!leftNavGroupsStore.shouldShowAllGroups && props.canDropOnListNode) {
            return props.canDropOnListNode(dragData);
        }
        return false;
    };
    const onDragOverCollapseExpandNode = (dragData: DragData) => {
        isDragOverExpandCollapseNode.current = true;
        setTimeout(() => {
            if (
                isDragOverExpandCollapseNode.current &&
                !getLeftNavGroupsStore().shouldShowAllGroups
            ) {
                toggleCollapseExpandNode();
            }
        }, 1000);
    };
    const onDragLeaveCollapseExpandNode = () => {
        isDragOverExpandCollapseNode.current = false;
    };
    const onCollapseExpandNodeClick = (evt: React.MouseEvent<unknown> | KeyboardEvent) => {
        evt.stopPropagation();
        toggleCollapseExpandNode();
    };
    const toggleCollapseExpandNode = () => {
        const joinedGroupCount = leftNavGroupsStore.myOrgGroups.length;
        logUsage('GroupList_ToggleShouldShowAllGroups', {
            isShowMore: !leftNavGroupsStore.shouldShowAllGroups,
            joinedGroupCount: joinedGroupCount >= 21 ? '21+' : joinedGroupCount,
        });
        if (props.onShowMoreEvent) {
            props.onShowMoreEvent();
        }
        toggleIsShowingAllGroups();
    };
    const groupIds = leftNavGroupsStore.myOrgGroups;
    const ariaProps: AriaProperties = {
        role: AriaRoles.tree,
    };
    const isGroupsTreeCollapsed = props.isGroupsTreeCollapsed;
    return (
        <div
            style={props.style}
            className={props.className}
            {...generateDomPropertiesForAria(ariaProps)}>
            {renderGroupRoot(isGroupsTreeCollapsed)}
            {renderChildren(groupIds, isGroupsTreeCollapsed)}
            {leftNavGroupsStore.withContextMenuGroup &&
                (leftNavGroupsStore.withContextMenuGroup.isRootNode
                    ? props.renderRootNodeContextMenu?.(leftNavGroupsStore.withContextMenuGroup)
                    : props.renderChildNodeContextMenu?.(leftNavGroupsStore.withContextMenuGroup))}
            {groupIds.length > MAX_GROUP_NODES_WHEN_COLLAPSED &&
                renderCollapseExpandNode(isGroupsTreeCollapsed)}
            {props.renderGroupListCustomNodes?.()}
        </div>
    );
});

function onDropOnCollapseExpandNode() {
    // No-Op
}

function noContextMenu(evt: React.MouseEvent<unknown>) {
    evt.stopPropagation();
    evt.preventDefault();
}
