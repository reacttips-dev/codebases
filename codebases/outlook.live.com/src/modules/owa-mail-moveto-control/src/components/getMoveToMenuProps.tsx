import { resetMovetoStore } from '../actions/resetMoveToStore';
import type { IContextualMenuItem } from '@fluentui/react/lib';
import { DirectionalHint } from '@fluentui/react/lib/Callout';
import { MoveToFolder } from '../index';
import * as React from 'react';
import type MoveToFolderPropertiesType from '../store/schema/MoveToFolderPropertiesType';

import styles from './MoveToMenuHeight.scss';

export function getMoveToMenuProps(moveToProperties: MoveToFolderPropertiesType) {
    let items: IContextualMenuItem[] = [];
    items.push({
        key: 'MoveToMenuItemDiv',
        onRender: () => (
            <MoveToFolder
                actionSource={moveToProperties.actionSource}
                createNewFolder={moveToProperties.createNewFolder}
                dismissMenu={moveToProperties.dismissMenu}
                shouldShowSearchBox={moveToProperties.shouldShowSearchBox}
                supportedMailboxTypes={moveToProperties.supportedMailboxTypes}
                onFolderClick={moveToProperties.onFolderClick}
                getMenuItemsToPrepend={moveToProperties.getMenuItemsToPrepend}
                getCustomIcon={moveToProperties.getCustomIcon}
                getCustomMenuItemsToAppend={moveToProperties.getCustomMenuItemsToAppend}
                disableSelectedFolder={moveToProperties.disableSelectedFolder}
                selectedFolderId={moveToProperties.selectedFolderId}
                viewAllFoldersDisplayText={moveToProperties.viewAllFoldersDisplayText}
            />
        ),
    });

    const moveToFolderContextMenuProps = {
        className: styles.moveToMenu,
        styles: {
            title: {},
            container: {},
            root: {
                width: moveToProperties.width ? moveToProperties.width + 'px' : null,
            },
            header: {},
            list: {},
        },
        coverTarget: moveToProperties.coverTarget,
        directionalHint: moveToProperties.directionalHint
            ? moveToProperties.directionalHint
            : DirectionalHint.bottomLeftEdge,
        directionalHintFixed: moveToProperties.directionalHintFixed, // if true ensures the position will not change sides in an attempt to fit the callout within bounds.
        items: items,
        onMenuDismissed: onMenuDismissed,
        shouldFocusOnMount: !moveToProperties.shouldShowSearchBox, // If this is true the focus will be grabbed by entire context menu when it open, the focus should stay on search box when menu is opened
        useTargetWidth: moveToProperties.useTargetWidth,
        focusZoneProps: {
            // We want the up and down arrow keys on search input element to shift the focus to next and previous element respectively
            // irrespective of the default behavior where FocusZone does not permit it if shifting focus is only doable using Tab keys
            shouldInputLoseFocusOnArrowKey: (inputElement: HTMLInputElement) => true,
        },
        calloutProps: {
            className: 'customScrollBar',
        },
    };

    return moveToFolderContextMenuProps;
}

/**
 * Called when the move to menu is actually dismissed
 * We clean up the move to store when menu dismisses
 */
function onMenuDismissed() {
    resetMovetoStore();
}
