import leftNavGroupsStore from '../store/store';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { shallowCompare } from '@fluentui/react/lib/Utilities';
import type GroupInformation from 'owa-groups-shared-store/lib/schema/GroupInformation';
import KeyboardCharCodes from 'owa-hotkeys/lib/utils/keyboardCharCodes';
import TreeNode, { ChevronProps } from 'owa-tree-node/lib/components/TreeNode';
import * as React from 'react';
import toggleGroupFavoriteFromLeftNav from '../actions/toggleGroupFavoriteFromLeftNav';

export interface GroupNodeProps extends React.HTMLProps<HTMLDivElement> {
    selectGroup: (groupId: string, customData: any) => void; // select group callback when a node is selected.
    isSelected: (groupId: string, customData: any) => boolean; // Callback to determine if a given node is selected
    renderRightCharm: (groupId: string, customData: any) => JSX.Element;
    renderRightCharmHover: (groupId: string, customData: any) => JSX.Element;
    displayName: string;
    groupId: string;
    isFavorited?: boolean;

    // Optional parameters
    customData?: any;
    chevronProps?: ChevronProps;
    customIcon?: string;
    isDroppedOver?: boolean;
    isBeingDragged?: boolean;
    onContextMenu?: (evt: React.MouseEvent<unknown>, group?: GroupInformation) => void;
    renderCustomTreeNodeDisplay?: (textClassName: string) => JSX.Element; // Method to render the main content (if not specified the tree node will render the default UI)
    showHoverStateOnDroppedOver?: boolean;
}

@observer
export default class GroupNode extends React.Component<GroupNodeProps, {}> {
    @computed
    get isSelected(): boolean {
        return this.props.isSelected(this.props.groupId, this.props.customData);
    }

    @computed
    get isWithContextMenuOpen(): boolean {
        return (
            leftNavGroupsStore.withContextMenuGroup &&
            this.props.groupId == leftNavGroupsStore.withContextMenuGroup.groupId
        );
    }

    shouldComponentUpdate(nextProps: GroupNodeProps, nextState: {}) {
        return !shallowCompare(this.props, nextProps);
    }

    render() {
        return (
            <TreeNode
                chevronProps={this.props.chevronProps}
                customIcon={this.props.customIcon}
                depth={1}
                displayName={this.props.displayName}
                isBeingDragged={this.props.isBeingDragged}
                isDroppedOver={this.props.isDroppedOver}
                isRootNode={false}
                isSelected={this.isSelected}
                isWithContextMenuOpen={this.isWithContextMenuOpen}
                key={this.props.groupId}
                onClick={this.onClick}
                onContextMenu={this.props.onContextMenu}
                onKeyDown={this.onKeyDown}
                renderCustomTreeNodeDisplay={this.props.renderCustomTreeNodeDisplay}
                renderRightCharm={this.renderRightCharm}
                renderRightCharmHover={this.renderRightCharmHover}
                showAsHoverOnDroppedOver={this.props.showHoverStateOnDroppedOver}
                isFavorited={this.props.isFavorited}
                toggleFavorite={this.toggleFavorite}
            />
        );
    }

    private onClick = (evt: React.MouseEvent<unknown>) => {
        evt.stopPropagation();
        this.props.selectGroup(this.props.groupId, this.props.customData);
    };

    private toggleFavorite = () => {
        toggleGroupFavoriteFromLeftNav(this.props.groupId);
    };

    private onKeyDown = (evt: React.KeyboardEvent<unknown>) => {
        switch (evt.keyCode) {
            case KeyboardCharCodes.Enter:
            case KeyboardCharCodes.Space:
                evt.stopPropagation();
                this.props.selectGroup(this.props.groupId, this.props.customData);
                break;
        }
    };

    private renderRightCharm = (): JSX.Element => {
        return this.props.renderRightCharm(this.props.groupId, this.props.customData);
    };

    private renderRightCharmHover = (): JSX.Element => {
        return this.props.renderRightCharmHover(this.props.groupId, this.props.customData);
    };
}
