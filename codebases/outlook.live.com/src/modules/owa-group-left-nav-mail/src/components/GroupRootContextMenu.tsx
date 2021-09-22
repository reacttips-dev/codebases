import { observer } from 'mobx-react-lite';
import {
    groupsLeftNav_NewGroupButton,
    groupsLeftNav_DiscoverGroupsButton,
    groupsLeftNav_ManageGroupsButton,
} from '../strings.locstring.json';
import loc from 'owa-localize';
import type { IPoint } from '@fluentui/react/lib/Utilities';
import { openCreateGroup, openDiscoverGroups } from '../actions/internalActions';
import { onManageGroups } from '../actions/onManageGroup';

import * as React from 'react';
import {
    ContextualMenu,
    DirectionalHint,
    IContextualMenuItem,
} from '@fluentui/react/lib/ContextualMenu';
import { getUnifiedGroupsSettingsStore } from 'owa-groups-shared-store';
import { isConsumer } from 'owa-session-store';

export interface GroupContextMenuProps {
    anchorPoint: IPoint;
    onDismiss: (ev?: any) => void;
}

export default observer(function GroupRootContextMenu(props: GroupContextMenuProps) {
    const createMenuItems = (): IContextualMenuItem[] => {
        const isGroupCreationEnabled = getUnifiedGroupsSettingsStore().groupCreationEnabled;
        const isDiscoverGroupsEnabled = !isConsumer();
        const isManageGroupsEnabled = !isConsumer();
        const menuItems = [];
        if (isGroupCreationEnabled) {
            menuItems.push(
                getContextMenuItem(
                    'newGroup',
                    loc(groupsLeftNav_NewGroupButton),
                    false /* disabled */,
                    onCreateGroup
                )
            );
        }
        if (isDiscoverGroupsEnabled) {
            menuItems.push(
                getContextMenuItem(
                    'discoverGroups',
                    loc(groupsLeftNav_DiscoverGroupsButton),
                    false /* disabled */,
                    onDiscoverGroups
                )
            );
        }
        if (isManageGroupsEnabled) {
            menuItems.push(
                getContextMenuItem(
                    'manageGroups',
                    loc(groupsLeftNav_ManageGroupsButton),
                    false /* disabled */,
                    onManageGroups_0
                )
            );
        }
        return menuItems;
    };
    const onCreateGroup = () => {
        openCreateGroup();
        props.onDismiss();
    };
    const onDiscoverGroups = () => {
        openDiscoverGroups();
        props.onDismiss();
    };
    const { anchorPoint, onDismiss } = props;
    const items: IContextualMenuItem[] = createMenuItems();
    return (
        <ContextualMenu
            shouldFocusOnMount={true}
            target={anchorPoint}
            directionalHint={DirectionalHint.bottomLeftEdge}
            onDismiss={onDismiss}
            items={items}
        />
    );
});

function getContextMenuItem(
    menuKey: string,
    menuName: string,
    isMenuDisabled: boolean,
    onClickHandler: (
        ev?: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>,
        item?: IContextualMenuItem
    ) => any
): IContextualMenuItem {
    return {
        key: menuKey,
        name: menuName,
        disabled: isMenuDisabled,
        onClick: onClickHandler,
    };
}
function onManageGroups_0() {
    onManageGroups();
}
