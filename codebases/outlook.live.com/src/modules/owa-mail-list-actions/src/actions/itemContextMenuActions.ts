import { getStore } from 'owa-mail-list-store/lib/store/Store';
import type { IPoint } from '@fluentui/react/lib/Utilities';
import { mutatorAction } from 'satcheljs';
import type MailListContextMenuSource from 'owa-mail-list-store/lib/store/schema/MailListContextMenuSource';
import type MailListContextMenuType from 'owa-mail-list-store/lib/store/schema/MailListContextMenuType';
import type MailListItemContextMenuState from 'owa-mail-list-store/lib/store/schema/MailListItemContextMenuState';

/**
 * Show the mail item context menu by initiating the itemContextMenuState
 * @param anchor the anchor where the mouse/keyboard event happens
 * @param the list view store which contains itemContextMenuState
 */
export function showMailItemContextMenu(
    anchor: IPoint,
    menuType: MailListContextMenuType,
    menuSource?: MailListContextMenuSource
): void {
    setItemContextMenuState({
        anchor: anchor,
        menuType: menuType,
        menuSource: menuSource,
    });
}

/**
 * Hide the mail item context menu by clearing the itemContextMenuState
 */
export function hideMailItemContextMenu(): void {
    setItemContextMenuState(null);
}

const setItemContextMenuState = mutatorAction(
    'setItemContextMenuState',
    (state: MailListItemContextMenuState | null) => {
        getStore().itemContextMenuState = state;
    }
);
