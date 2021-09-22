import { shallowCompare } from '@fluentui/react/lib/Utilities';
import { observer } from 'mobx-react';
import { ControlIcons } from 'owa-control-icons';
import Droppable from 'owa-dnd/lib/components/Droppable';
import type DropEffect from 'owa-dnd/lib/store/schema/DropEffect';
import type { DragData } from 'owa-dnd/lib/utils/dragDataUtil';
import { DraggableItemTypes } from 'owa-dnd/lib/utils/DraggableItemTypes';
import { isGroupInFavorites } from 'owa-favorites';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getGroupsStore } from 'owa-groups-shared-store';
import type GroupInformation from 'owa-groups-shared-store/lib/schema/GroupInformation';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import type { ChevronProps } from 'owa-tree-node/lib/components/TreeNode';
import * as React from 'react';
import getGroupNodeViewStateFromId from '../selector/getGroupNodeViewStateFromId';
import { default as GroupNode, GroupNodeProps } from './GroupNode';

export interface GroupListNodeProps extends GroupNodeProps {
    onListNodeDrop?: (dragData: DragData, groupId: string) => void;
    canDropOnListNode: (dragData: DragData) => DropEffect;
    renderGroupFolderChildren?: (groupId: string) => JSX.Element | null; // function to render child folders of a group
    groupListNodeChevronProps?: (groupId: string) => ChevronProps; // to render chevron to the left of group node
}

@observer
export default class GroupListNode extends React.Component<GroupListNodeProps, {}> {
    shouldComponentUpdate(nextProps: GroupNodeProps, nextState: {}) {
        return !shallowCompare(this.props, nextProps);
    }

    render() {
        const viewState = getGroupNodeViewStateFromId(this.props.groupId);

        return (
            <Droppable
                dropViewState={viewState.drop}
                onDrop={this.onDrop}
                canDrop={this.props.canDropOnListNode}>
                <GroupNode
                    selectGroup={this.props.selectGroup}
                    isSelected={this.props.isSelected}
                    renderRightCharm={this.props.renderRightCharm}
                    renderRightCharmHover={this.props.renderRightCharmHover}
                    chevronProps={
                        isFeatureEnabled('grp-loadFolders') ? this.getChevronProps() : null
                    }
                    customIcon={isFeatureEnabled('grp-loadFolders') ? ControlIcons.Group : null}
                    displayName={this.props.displayName}
                    groupId={this.props.groupId}
                    isDroppedOver={viewState.drop.isDragOver}
                    onContextMenu={this.onContextMenu}
                    renderCustomTreeNodeDisplay={null}
                    customData={this.props.customData}
                    showHoverStateOnDroppedOver={
                        viewState.drop.draggableItemType == DraggableItemTypes.MailListRow ||
                        viewState.drop.draggableItemType ==
                            DraggableItemTypes.MultiMailListMessageRows
                    }
                    isFavorited={
                        isFeatureEnabled('nh-boot-acctmonaccounts') &&
                        isHostAppFeatureEnabled('acctmonaccounts') &&
                        isGroupInFavorites(this.props.groupId)
                    }
                />

                {/* Render group folders*/}
                {isFeatureEnabled('grp-loadFolders') && this.renderGroupFolderChildren()}
            </Droppable>
        );
    }

    private onContextMenu = (evt: React.MouseEvent<unknown>, group: GroupInformation) => {
        const { onContextMenu, groupId } = this.props;

        if (onContextMenu) {
            evt.stopPropagation();
            evt.preventDefault();

            const groupSmtp = groupId.toLowerCase();
            const groups = getGroupsStore().groups;
            if (groups.has(groupSmtp)) {
                const group = groups.get(groupSmtp);
                onContextMenu(evt, group);
            }
        }
    };

    private onDrop = (dragData: DragData) => {
        if (this.props.onListNodeDrop) {
            this.props.onListNodeDrop(dragData, this.props.groupId);
        }
    };

    private renderGroupFolderChildren = (): JSX.Element => {
        if (this.props.renderGroupFolderChildren) {
            return this.props.renderGroupFolderChildren(this.props.groupId);
        }
        return null;
    };

    private getChevronProps = (): ChevronProps => {
        if (this.props.groupListNodeChevronProps) {
            return this.props.groupListNodeChevronProps(this.props.groupId);
        }
        return undefined;
    };
}
