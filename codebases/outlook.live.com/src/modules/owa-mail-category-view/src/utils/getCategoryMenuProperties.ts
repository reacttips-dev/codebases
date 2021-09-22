import type { ActionSource } from 'owa-mail-store';
import { CATEGORY_MENU_WIDTH } from './constants';
import { CategoryActionSource, getCategoryMenuProps, getMasterCategoryList } from 'owa-categories';
import {
    getAllCategoriesOnRows,
    getCommonCategoriesOnRows,
} from './getCategoryActionDecisionProperties';
import { lazyMountAndShowFullOptions } from 'owa-options-view';
import { listViewStore, TableView } from 'owa-mail-list-store';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import { IContextualMenuProps, DirectionalHint } from '@fluentui/react/lib/ContextualMenu';
import {
    lazyAddCategoriesFromTable,
    lazyRemoveCategoriesFromTable,
    lazyClearCategoriesFromTable,
} from 'owa-mail-triage-action';
import { lazyAddFavoriteCategory } from 'owa-favorites';

export function getCategoryMenuPropertiesForCommandBar(
    tableView: TableView,
    actionSource: ActionSource,
    directionalHint?: DirectionalHint
): IContextualMenuProps {
    return getCategoriesMenuProperties(
        tableView,
        true /* showSearchBox */,
        true /* showManageCategories */,
        () => lazyResetFocus.importAndExecute(), // always reset focus to dismiss the menu from commanding bar
        actionSource,
        'CommandBar',
        directionalHint
    );
}

/**
 * Gets the category menu items for context menu
 * @param tableViewId the tableView id
 * @param dismissMenu the callback to be called to dismiss of menu
 * @param actionSource the actionSource
 * @return returns the contextual menu items
 */
export function getCategoryMenuPropertiesForContextMenu(
    tableViewId: string,
    dismissMenu: (ev?: any) => void,
    actionSource: ActionSource,
    shouldShowSearch?: boolean
): IContextualMenuProps {
    const tableView = listViewStore.tableViews.get(tableViewId);
    return getCategoriesMenuProperties(
        tableView,
        shouldShowSearch /* showSearchBox */,
        true /* showManageCategories */,
        dismissMenu, // Callback to dismiss the right click context menu
        actionSource,
        'ContextLV',
        DirectionalHint.rightTopEdge
    );
}

/**
 * Gets the category menu items
 * @param tableView the tableView
 * @param showSearchBox flag indicating whether to show search box or not
 * @param showManageCategoriesBox flag indicating whether to the manage categories option or not
 * @param dismissMenu callback to be called to dismiss the category context menu
 * @param actionSource the actionSource
 * @param categoryActionSource the category action source
 * @param directionalHint determines which direction the callout appears, defaults to bottomLeftEdge
 * @return returns the contextual menu items
 */
function getCategoriesMenuProperties(
    tableView: TableView,
    showSearchBox: boolean,
    showManageCategories: boolean,
    dismissMenu: () => void,
    actionSource: ActionSource,
    categoryActionSource: CategoryActionSource,
    directionalHint?: DirectionalHint
): IContextualMenuProps {
    const categoryMenuProps = getCategoryMenuProps({
        actionSource: categoryActionSource,
        categoryList: getMasterCategoryList(),
        getCategoriesToCheck: () =>
            getCommonCategoriesOnRows(tableView, [...tableView.selectedRowKeys.keys()]),
        dismissMenu: dismissMenu,
        shouldShowSearchBox: showSearchBox,
        shouldShowManageCategories: showManageCategories,
        getShouldShowClearCategories: () => {
            return (
                getAllCategoriesOnRows(tableView, [...tableView.selectedRowKeys.keys()]).length > 0
            );
        }, // Show clear categories if any of the selected row has categories
        addFavoriteCategory: addFavoriteCategory,
        onAfterCreateNewCategory: (
            category: string,
            createNewCategoryPromise: Promise<boolean>
        ) => {
            // When a new category is created, we should apply it optimistically to the selected items
            lazyAddCategoriesFromTable.importAndExecute(
                [...tableView.selectedRowKeys.keys()],
                tableView,
                [category],
                actionSource,
                createNewCategoryPromise
            );
        },
        onCheckedCategoryClicked: category => {
            // When a checked category is clicked its a remove action
            lazyRemoveCategoriesFromTable.importAndExecute(
                [...tableView.selectedRowKeys.keys()],
                tableView,
                [category],
                actionSource
            );
        },
        onUncheckedCategoryClicked: category => {
            // When an unchecked category is clicked its an add action
            lazyAddCategoriesFromTable.importAndExecute(
                [...tableView.selectedRowKeys.keys()],
                tableView,
                [category],
                actionSource
            );
        },
        onManageCategoryClicked: onManageCategoryClicked,
        onClearCategoriesClicked: () => {
            lazyClearCategoriesFromTable.importAndExecute(
                [...tableView.selectedRowKeys.keys()],
                tableView,
                actionSource
            );
        },
        directionalHint: directionalHint,
        width: CATEGORY_MENU_WIDTH,
    });

    return categoryMenuProps;
}

/**
 * Custom callback function when manage category is clicked
 */
function onManageCategoryClicked() {
    // Navigate to options/categories
    lazyMountAndShowFullOptions.importAndExecute('general', 'categories');
}

/**
 * Custom callback function when adding a favorite category
 */
function addFavoriteCategory(categoryId: string, actionSource: CategoryActionSource) {
    lazyAddFavoriteCategory
        .import()
        .then(addFavoriteCategory => addFavoriteCategory(categoryId, actionSource));
}
