import { lazyAddCategoriesFromTable, lazyRemoveCategoriesFromTable } from 'owa-mail-triage-action';
import {
    lazyAddMasterCategories,
    lazyRemoveMasterCategories,
    lazyGetMasterCategoriesList,
} from 'owa-categories';
import type CategoryType from 'owa-service/lib/contract/CategoryType';
import { getSelectedTableView } from 'owa-mail-list-store';
import type ItemPartViewState from 'owa-mail-reading-pane-store/lib/store/schema/ItemPartViewState';
import { getStore } from 'owa-mail-store/lib/store/Store';
import type Item from 'owa-service/lib/contract/Item';
import { CategoryColor } from 'owa-addins-apis/lib/apis/categories/CategoryDetails';
import { ApiError, ApiErrorCode } from 'owa-addins-core';
import { getUserEmailAddress } from 'owa-session-store';
import { getUserPermissionForFolderId } from 'owa-mail-store';
import { isSharedItem } from './SharedItemAdapter';

export async function getCategoriesMailbox(): Promise<CategoryType[]> {
    let getMasterCategoriesList = await lazyGetMasterCategoriesList.import();
    var masterCategoryList: CategoryType[] = getMasterCategoriesList();
    return masterCategoryList;
}

export async function addCategoriesMailbox(categoryList: CategoryType[]): Promise<boolean> {
    const addMasterCategories = await lazyAddMasterCategories.import();
    return addMasterCategories(categoryList, 'Addin');
}

export async function removeCategoriesMailbox(categoryList: string[]): Promise<boolean> {
    const removeMasterCategories = await lazyRemoveMasterCategories.import();
    return removeMasterCategories(categoryList, 'Addin');
}

export const getCategoriesItem = (viewState: ItemPartViewState) => (): Promise<CategoryType[]> => {
    return getCategoriesItemUtil(viewState);
};

// Adding of categories on mail items is not supported for the permissions PublishingAuthor, Author, NEA, Reviwer and Contributor.
export const addCategoriesItemRead = (viewState: ItemPartViewState) => (
    categories: string[]
): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        let item: Item = getStore().items.get(viewState.itemId);
        const folderId = item.ParentFolderId.Id;
        const userEmail = getUserEmailAddress();
        var folderPermission = getUserPermissionForFolderId(folderId, userEmail);
        const isShared = isSharedItem(item);
        if (
            isShared &&
            folderPermission &&
            (folderPermission.PermissionLevel === 'PublishingAuthor' ||
                folderPermission.PermissionLevel === 'Author' ||
                folderPermission.PermissionLevel === 'NoneditingAuthor' ||
                folderPermission.PermissionLevel === 'Reviewer' ||
                folderPermission.PermissionLevel === 'Contributor')
        ) {
            reject(new ApiError(ApiErrorCode.OperationNotSupported));
            return;
        }
        const tableView = getSelectedTableView();
        const selectedRowKeys = [...tableView.selectedRowKeys.keys()];
        lazyAddCategoriesFromTable.importAndExecute(
            selectedRowKeys,
            tableView,
            categories,
            'Addin'
        );
        return resolve();
    });
};

// Removing of categories on mail items is not supported for the permissions PublishingAuthor, Author, NEA, Reviwer and Contributor.
export const removeCategoriesItemRead = (viewState: ItemPartViewState) => (
    categories: string[]
): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        let item: Item = getStore().items.get(viewState.itemId);
        const folderId = item.ParentFolderId.Id;
        const userEmail = getUserEmailAddress();
        var folderPermission = getUserPermissionForFolderId(folderId, userEmail);
        const isShared = isSharedItem(item);
        if (
            isShared &&
            folderPermission &&
            (folderPermission.PermissionLevel === 'PublishingAuthor' ||
                folderPermission.PermissionLevel === 'Author' ||
                folderPermission.PermissionLevel === 'NoneditingAuthor' ||
                folderPermission.PermissionLevel === 'Reviewer' ||
                folderPermission.PermissionLevel === 'Contributor')
        ) {
            reject(new ApiError(ApiErrorCode.OperationNotSupported));
            return;
        }
        const tableView = getSelectedTableView();
        const selectedRowKeys = [...tableView.selectedRowKeys.keys()];
        lazyRemoveCategoriesFromTable.importAndExecute(
            selectedRowKeys,
            tableView,
            categories,
            'Addin'
        );
        return resolve();
    });
};

export async function getCategoriesItemUtil(viewState: ItemPartViewState): Promise<CategoryType[]> {
    let item: Item = getStore().items.get(viewState.itemId);
    let categoriesOnItem: string[] = item.Categories;

    let getMasterCategoriesList = await lazyGetMasterCategoriesList.import();
    const masterCategoryList: CategoryType[] = getMasterCategoriesList();

    if (categoriesOnItem == null) {
        return [];
    }
    let categories: CategoryType[] = [];
    for (let category of categoriesOnItem) {
        let matchingCategories = masterCategoryList.filter(
            existingCategory => existingCategory.Name === category
        );
        let categorydetailsobject: CategoryType = {
            Name: category,
            Color: matchingCategories.length > 0 ? matchingCategories[0].Color : CategoryColor.None,
        };
        categories.push(categorydetailsobject);
    }
    return categories;
}
