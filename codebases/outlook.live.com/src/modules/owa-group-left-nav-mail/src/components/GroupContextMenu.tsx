import { observer } from 'mobx-react-lite';
import { useComputed } from 'owa-react-hooks/lib/useComputed';
import { groupsLeftNavMenu_Copy } from './GroupContextMenu.locstring.json';
import { markAllAsRead } from 'owa-locstrings/lib/strings/markallasread.locstring.json';
import { CopyToClipboardPromptText } from 'owa-locstrings/lib/strings/copytoclipboardprompttext.locstring.json';
import { CopyToClipboardMacPromptText } from 'owa-locstrings/lib/strings/copytoclipboardmacprompttext.locstring.json';
import { addToFavoritesText } from 'owa-locstrings/lib/strings/addtofavoritestext.locstring.json';
import { removeFromFavoritesText } from 'owa-locstrings/lib/strings/removefromfavoritestext.locstring.json';
import loc from 'owa-localize';
import type { IPoint } from '@fluentui/react/lib/Utilities';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isGroupInFavorites } from 'owa-favorites';
import { lazyToggleFavoriteGroup } from 'owa-group-favorite-button';
import { createGroupMailTableQuery, getListViewTypeForGroup } from 'owa-group-mail-list-actions';
import { getGroupsStore } from 'owa-groups-shared-store';
import type GroupInformation from 'owa-groups-shared-store/lib/schema/GroupInformation';
import * as markReadActions from 'owa-mail-mark-read-actions';
import { getTableViewFromTableQuery } from 'owa-mail-triage-table-utils';

import { isMac } from 'owa-user-agent/lib/userAgent';
import * as React from 'react';
import {
    ContextualMenu,
    DirectionalHint,
    IContextualMenuItem,
} from '@fluentui/react/lib/ContextualMenu';

export interface GroupContextMenuProps {
    groupId: string;
    anchorPoint: IPoint;
    onDismiss: (ev?: any) => void;
    commonContextMenuItems?: IContextualMenuItem[];
}

export default observer(function GroupContextMenu(props: GroupContextMenuProps) {
    const group = useComputed(
        (): GroupInformation => {
            const groupSmtp = props.groupId.toLowerCase();
            const groups = getGroupsStore().groups;
            return groups.get(groupSmtp);
        }
    );
    const createMenuItems = (): IContextualMenuItem[] => {
        const isInFavorites = isGroupInFavorites(group.get().basicInformation.SmtpAddress);
        const menuItems = [
            getContextMenuItem(
                'markAllAsRead',
                loc(markAllAsRead),
                false, // disabled
                onMarkAllAsRead
            ),
            getContextMenuItem(
                'copyEmailAddress',
                loc(groupsLeftNavMenu_Copy),
                false /* disabled */,
                onCopyEmailAddress
            ),
        ];
        if (isFeatureEnabled('tri-favorites-roaming')) {
            menuItems.push(
                getContextMenuItem(
                    isInFavorites ? 'removeFromFavorites' : 'addToFavorites',
                    isInFavorites ? loc(removeFromFavoritesText) : loc(addToFavoritesText),
                    false, // disabled
                    onToggleFavorite
                )
            );
        }
        return menuItems;
    };
    const onMarkAllAsRead = () => {
        const groupSmtp = group.get().basicInformation.SmtpAddress;
        const tableQuery = createGroupMailTableQuery(groupSmtp, getListViewTypeForGroup());
        const tableView = getTableViewFromTableQuery(tableQuery);
        markReadActions.lazyMarkAsReadInTable.importAndExecute(
            'ContextMenu',
            tableView.virtualSelectAllExclusionList,
            true /* isActingOnAllItemsInTable */,
            true /* isReadValueToSet */,
            [] /* rowKeysToActOn */,
            tableView
        );
        props.onDismiss();
    };
    const onToggleFavorite = async () => {
        const toggleFavoriteGroup = await lazyToggleFavoriteGroup.import();
        toggleFavoriteGroup(group.get().basicInformation.SmtpAddress);
        props.onDismiss();
    };
    const onCopyEmailAddress = () => {
        // To copy the text to the clipboard, we will create a hidden input box,
        // add the text to be copied, select it, copy it and then remove the input box.
        // In case the browser doesn't support copy to clipboard, this process will fail and we will show
        // a user prompt with the text to be copied and the user will be able to copy it manually
        const copyInput = document.createElement('input') as HTMLInputElement;
        // The text will be copied in the format "Group Name <Group Smtp Address>"
        const copyText = `${group.get().basicInformation.DisplayName} <${
            group.get().basicInformation.SmtpAddress
        }>`;
        // Styling the input box so it is not visible in the browser
        copyInput.className = 'screenReaderOnly';
        document.body.appendChild(copyInput);
        try {
            copyInput.value = copyText;
            copyInput.select();
            if (!document.execCommand('copy')) {
                // The command failed. Fallback to the method below.
                throw new Error();
            }
        } catch (err) {
            // The above method didn't work. Fallback to a prompt.
            const promptText = isMac()
                ? loc(CopyToClipboardMacPromptText)
                : loc(CopyToClipboardPromptText);
            window.prompt(promptText, copyText);
        } finally {
            document.body.removeChild(copyInput);
        }
        props.onDismiss();
    };
    const { anchorPoint, onDismiss } = props;
    let items: IContextualMenuItem[] = createMenuItems();
    if (props.commonContextMenuItems) {
        items = items.concat(props.commonContextMenuItems);
    }
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
