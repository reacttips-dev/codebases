import * as React from 'react';
import {
    IContextualMenuItem,
    DirectionalHint,
    IContextualMenuProps,
} from '@fluentui/react/lib/ContextualMenu';
import { CategoryMenu, lazyOnMenuDismissed } from '../index';
import type CategoryMenuPropertiesType from '../store/schema/CategoryMenuPropertiesType';

import styles from '../components/CategoryMenuHeight.scss';

/**
 * Gets the categoryMenuProps of type IContextualMenuProps that
 * back up the category context menu
 * @param actionSource the actionSource where the menu is going to be hosted
 * @param categoryList the list of category that backup the category menu
 * @param dismissMenu callback to be called to dismiss the menu
 * @param shouldShowSearchBox whether to show the search box at the top
 * @param shouldShowManageCategories whether to show the manage category menu item
 * @param shouldShowClearCategories whether to show the clear category menu item
 * @param onAfterCreateNewCategory callback to be called when a new category has been created from the menu
 * @param onCheckedCategoryClicked callback to be called when a checked category is clicked
 * @param onUncheckedCategoryClicked callback to be called when an unchecked category is clicked
 * @param manageCategoriesDisabled flag indicating whether the manage categories menu item has been disabled or not
 * @param createNewCategoryDisabled flag indicating whether the create new category menu item has been disabled or not
 * @param onManageCategoryClicked callback to be called when manage category menu item is clicked
 * @param onClearCategoriesClicked callback to be called when clear categories menu item is clicked
 * @param directionalHint prop to the context menu that determines the direction of the menu
 * @param useTargetWidth prop to the context menu that determines whether the width of the menu should be same as the target element
 * @param coverTarget prop to the context menu that determines whether the menu should cover the target
 */
export function getCategoryMenuProps(
    categoryMenuProps: CategoryMenuPropertiesType
): IContextualMenuProps {
    let items: IContextualMenuItem[] = [];
    items.push({
        key: 'CategoryMenuItemDiv',
        onRender: () => (
            <CategoryMenu
                mailboxInfo={categoryMenuProps.mailboxInfo}
                onAfterCreateNewCategory={categoryMenuProps.onAfterCreateNewCategory}
                addFavoriteCategory={categoryMenuProps.addFavoriteCategory}
                onCheckedCategoryClicked={categoryMenuProps.onCheckedCategoryClicked}
                onUncheckedCategoryClicked={categoryMenuProps.onUncheckedCategoryClicked}
                actionSource={categoryMenuProps.actionSource}
                categoryList={categoryMenuProps.categoryList}
                categoriesToCheck={categoryMenuProps.getCategoriesToCheck()}
                dismissMenu={categoryMenuProps.dismissMenu}
                shouldShowSearchBox={categoryMenuProps.shouldShowSearchBox}
                shouldShowManageCategories={categoryMenuProps.shouldShowManageCategories}
                shouldShowClearCategories={categoryMenuProps.getShouldShowClearCategories()}
                manageCategoriesDisabled={categoryMenuProps.manageCategoriesDisabled}
                createNewCategoryDisabled={categoryMenuProps.createNewCategoryDisabled}
                onManageCategoryClicked={categoryMenuProps.onManageCategoryClicked}
                onClearCategoriesClicked={categoryMenuProps.onClearCategoriesClicked}
            />
        ),
    });

    const categoryContextMenuProps = {
        className: styles.categoryMenu,
        styles: {
            title: {},
            container: {},
            root: {
                width: categoryMenuProps.width ? categoryMenuProps.width + 'px' : null,
            },
            header: {},
            list: {},
        },
        directionalHintFixed: false, // ensure the position will change sides in an attempt to fit the callout within bounds.
        items: items,
        onMenuDismissed: () => lazyOnMenuDismissed.importAndExecute(),
        shouldFocusOnMount: !categoryMenuProps.shouldShowSearchBox, // If this is true the focus will be grabbed by entire context menu when it open, the focus should stay on search box when menu is opened
        useTargetWidth: categoryMenuProps.useTargetWidth,
        coverTarget: categoryMenuProps.coverTarget,
        directionalHint: categoryMenuProps.directionalHint
            ? categoryMenuProps.directionalHint
            : DirectionalHint.bottomLeftEdge,
        focusZoneProps: {
            // We want the up and down arrow keys on search input element to shift the focus to next and previous element respectively
            // irrespective of the default behavior where FocusZone does not permit it if shifting focus is only doable using Tab keys
            shouldInputLoseFocusOnArrowKey: (inputElement: HTMLInputElement) => true,
        },
        calloutProps: {
            className: 'customScrollBar',
        },
    };

    return categoryContextMenuProps;
}
