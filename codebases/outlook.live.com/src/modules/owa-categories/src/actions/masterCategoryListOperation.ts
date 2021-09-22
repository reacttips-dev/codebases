import datapoints from '../datapoints';
import type { MailboxInfo } from 'owa-client-ids';
import updateMasterCategoryListService from '../services/updateMasterCategoryListService';
import { getPendingCategoryNamesMapKey } from '../utils/getPendingCategoryNamesMapKey';
import { getStore } from '../store/store';
import type CategoryActionSource from '../utils/CategoryActionSource';
import getMasterCategoryList from '../utils/getMasterCategoryList';
import { logUsage, wrapFunctionForDatapoint } from 'owa-analytics';
import type CategoryType from 'owa-service/lib/contract/CategoryType';
import * as trace from 'owa-trace';
import { action, mutatorAction } from 'satcheljs';

export declare type UpdateMasterCategoryListOperationType =
    | 'add'
    | 'remove'
    | 'change'
    | 'updateLastTimeUsed'
    | 'addAndRemove';

/**
 * Add master categories to master category list
 * @param categoriesToAdd the categories to be added to master list
 * @param actionSource where the add action is triggered from
 * @param mailboxInfo The mailbox this action is being performed against
 * @returns a Promise which contains a boolean indicates whether the category is successfully added on the server or not
 */
export let addMasterCategories = wrapFunctionForDatapoint(
    datapoints.addMasterCategories,
    function addMasterCategories(
        categoriesToAdd: CategoryType[],
        actionSource: CategoryActionSource,
        mailboxInfo?: MailboxInfo
    ): Promise<boolean> {
        if (!categoriesToAdd || categoriesToAdd.length === 0) {
            trace.errorThatWillCauseAlert('No categories to add');
            return Promise.resolve(false);
        }

        // Update local store
        addMasterCategoriesInternal(categoriesToAdd, mailboxInfo);

        // Issue service request
        return updateMasterCategoryListService(
            categoriesToAdd,
            undefined /* categoriesToRemove */,
            undefined /* categoriesToChange */,
            undefined /* categoriesToUpdateLastTimeUsed */,
            mailboxInfo
        )
            .then(response => {
                if (response.WasSuccessful) {
                    onAddMasterCategoriesSucceeded(
                        categoriesToAdd,
                        response.MasterList,
                        mailboxInfo
                    );
                    return true;
                } else {
                    onAddCategoriesFailed(
                        categoriesToAdd,
                        response.ErrorCode.toString(),
                        mailboxInfo
                    );
                    return false;
                }
            })
            .catch(() => {
                onAddCategoriesFailed(categoriesToAdd, null, mailboxInfo);
                return false;
            });
    }
);

const addMasterCategoriesInternal = mutatorAction(
    'addMasterCategoriesInternal',
    (categoriesToAdd: CategoryType[], mailboxInfo?: MailboxInfo) => {
        let masterList = getMasterCategoryList(mailboxInfo);
        categoriesToAdd.forEach(category => {
            // Add category to master category list in session store
            category.Name = category.Name.trim();
            masterList.push(category);

            // Add the category name to pending map
            const namesMapKey = getPendingCategoryNamesMapKey(mailboxInfo, category.Name);
            getStore().pendingCategoryNamesMap[namesMapKey] = category;
        });
    }
);

/**
 * Remove master categories from master category list
 * @param categoriesToRemove the categories to be removed from master list
 * @param actionSource where the remove action is triggered from
 * @param mailboxInfo The mailbox this action is being performed against
 * @returns a Promise which contains a boolean indicates whether the category is successfully removed from the server or not
 */
export let removeMasterCategories = wrapFunctionForDatapoint(
    datapoints.removeMasterCategories,
    function removeMasterCategories(
        categoriesToRemove: string[],
        actionSource: CategoryActionSource,
        mailboxInfo?: MailboxInfo
    ): Promise<boolean> {
        if (!categoriesToRemove || categoriesToRemove.length === 0) {
            trace.errorThatWillCauseAlert('No categories to remove');
            return Promise.resolve(false);
        }

        // Update local store
        removeMasterCategoriesInternal(categoriesToRemove, mailboxInfo);

        // Issue service request
        return updateMasterCategoryListService(
            undefined /* categoriesToAdd */,
            categoriesToRemove,
            undefined /* categoriesToChange */,
            undefined /* categoriesToUpdateLastTimeUsed */,
            mailboxInfo
        )
            .then(response => {
                if (!response.WasSuccessful) {
                    logErrorOnUpdateMasterListFailed('remove', response.ErrorCode.toString());
                    return false;
                }
                return true;
            })
            .catch(() => {
                logErrorOnUpdateMasterListFailed('remove');
                return false;
            });
    }
);

const removeMasterCategoriesInternal = mutatorAction(
    'removeMasterCategoriesInternal',
    (categoriesToRemove: string[], mailboxInfo?: MailboxInfo) => {
        let masterList = getMasterCategoryList(mailboxInfo);
        let foundMatch = false;
        categoriesToRemove.forEach(category => {
            for (let i = 0; i < masterList.length; i++) {
                if (category === masterList[i].Name) {
                    masterList.splice(i, 1);
                    foundMatch = true;
                    break;
                }
            }
        });
        // Log the error if not finding the category to remove, and this will end the action execution
        logErrorIfNotFoundMatch(foundMatch, 'remove');
    }
);

/**
 * Add and remove master categories from master category list
 * @param categoriesToAdd the categories to be added to master list
 * @param categoriesToRemove the categories to be removed from master list
 * @param actionSource where the action is triggered from
 * @param mailboxInfo The mailbox this action is being performed against
 * @returns a Promise which contains a boolean indicates whether the category is successfully removed from the server or not
 */
export const renameMasterCategories = wrapFunctionForDatapoint(
    datapoints.renameMasterCategories,
    function renameMasterCategories(
        categoriesToAdd: CategoryType[],
        categoriesToRemove: string[],
        actionSource: CategoryActionSource,
        mailboxInfo?: MailboxInfo
    ): Promise<boolean> {
        if (
            !categoriesToRemove ||
            categoriesToRemove.length === 0 ||
            !categoriesToAdd ||
            categoriesToAdd.length === 0
        ) {
            trace.errorThatWillCauseAlert('No categories to act on');
            return Promise.resolve(false);
        }

        // Update local store
        renameMasterCategoriesInternal(categoriesToRemove, categoriesToAdd, mailboxInfo);

        // Issue service request
        return updateMasterCategoryListService(
            categoriesToAdd,
            categoriesToRemove,
            undefined /* categoriesToChange */,
            undefined /* categoriesToUpdateLastTimeUsed */,
            mailboxInfo
        )
            .then(response => {
                if (!response.WasSuccessful) {
                    logErrorOnUpdateMasterListFailed('addAndRemove', response.ErrorCode.toString());
                    onAddCategoriesFailed(
                        categoriesToAdd,
                        response.ErrorCode.toString(),
                        mailboxInfo
                    );
                    return false;
                }
                onAddMasterCategoriesSucceeded(categoriesToAdd, response.MasterList, mailboxInfo);
                return true;
            })
            .catch(() => {
                logErrorOnUpdateMasterListFailed('addAndRemove');
                onAddCategoriesFailed(categoriesToAdd, null, mailboxInfo);
                return false;
            });
    }
);

const renameMasterCategoriesInternal = mutatorAction(
    'renameMasterCategoriesInternal',
    (categoriesToRemove: string[], categoriesToAdd: CategoryType[], mailboxInfo?: MailboxInfo) => {
        const masterList = getMasterCategoryList(mailboxInfo);
        let indexOfCategory = -1;
        categoriesToRemove.forEach(category => {
            for (let i = 0; i < masterList.length; i++) {
                if (category === masterList[i].Name) {
                    masterList.splice(i, 1);
                    indexOfCategory = i;
                    break;
                }
            }
        });
        // Log the error if not finding the category to remove, and this will end the action execution
        logErrorIfNotFoundMatch(indexOfCategory !== -1 /* foundMatch */, 'addAndRemove');
        categoriesToAdd.forEach(category => {
            // Add category to master category list in session store
            category.Name = category.Name.trim();
            masterList.splice(indexOfCategory, 0, category);

            // Add the category name to pending map
            const namesMapKey = getPendingCategoryNamesMapKey(mailboxInfo, category.Name);
            getStore().pendingCategoryNamesMap[namesMapKey] = category;
        });
    }
);

/**
 * Change existing master categories in master category list
 * @param categoriesToChange the categories to be updated from master list
 * @param actionSource where the change action is triggered from
 * @param mailboxInfo The mailbox this action is being performed against
 */
export let changeMasterCategories = wrapFunctionForDatapoint(
    datapoints.changeMasterCategories,
    function changeMasterCategories(
        categoriesToChange: CategoryType[],
        actionSource: CategoryActionSource,
        mailboxInfo?: MailboxInfo
    ) {
        if (!categoriesToChange || categoriesToChange.length === 0) {
            trace.errorThatWillCauseAlert('No categories to change');
            return;
        }

        changeMasterCategoriesInternal(categoriesToChange, mailboxInfo);

        // Issue service request
        updateMasterCategoryListService(
            undefined /* categoriesToAdd */,
            undefined /* categoriesToRemove */,
            categoriesToChange,
            undefined /* categoriesToUpdateLastTimeUsed */,
            mailboxInfo
        )
            .then(response => {
                if (!response.WasSuccessful) {
                    logErrorOnUpdateMasterListFailed('change', response.ErrorCode.toString());
                }
            })
            .catch(() => {
                logErrorOnUpdateMasterListFailed('change');
            });
    }
);

const changeMasterCategoriesInternal = mutatorAction(
    'changeMasterCategoriesInternal',
    (categoriesToChange: CategoryType[], mailboxInfo?: MailboxInfo) => {
        let masterList = getMasterCategoryList(mailboxInfo);
        let foundMatch = false;

        // Update local store
        categoriesToChange.forEach(category => {
            for (let i = 0; i < masterList.length; i++) {
                if (masterList[i].Id === category.Id) {
                    masterList[i] = category;
                    foundMatch = true;
                    break;
                }
            }
        });

        // Log the error if not finding the category to change, and this will end the action execution
        logErrorIfNotFoundMatch(foundMatch, 'change');
    }
);

/**
 * Update timestamp of categories in master category list
 * @param categoriesToUpdateLastTimeUsed the categories to be updated from master list
 * @param mailboxInfo The mailbox this action is being performed against
 */
export const updateLastTimeUsedMasterCategories = action(
    'updateLastTimeUsedMasterCategories',
    (categoriesToUpdateLastTimeUsed: string[], mailboxInfo?: MailboxInfo) => ({
        categoriesToUpdateLastTimeUsed,
        mailboxInfo,
    })
);

/**
 * Callback on add master categories succeeded
 * @param categoriesToAdd the local categories added
 * @param newMasterCategoriesList the new master categoryList
 * @param mailboxInfo The mailbox this action is being performed against
 */
const onAddMasterCategoriesSucceeded = mutatorAction(
    'onAddMasterCategoriesSucceeded',
    (
        categoriesToUpdate: CategoryType[],
        newMasterCategoriesList: CategoryType[],
        mailboxInfo?: MailboxInfo
    ) => {
        // Update the category ids with the service ids
        categoriesToUpdate.forEach(category => {
            const serviceCategory = newMasterCategoriesList.filter(
                serviceCategory => serviceCategory.Name === category.Name
            )[0];
            category.Id = serviceCategory.Id;

            // Clear the pending new categories name map if we know the category is successfully added on the server
            const namesMapKey = getPendingCategoryNamesMapKey(mailboxInfo, category.Name);
            delete getStore().pendingCategoryNamesMap[namesMapKey];
        });
    }
);

/**
 * Callback on add master categories failed
 * @param categoriesToAdd the local categories failed to add
 * @param errorCodeString the error code string if there is any
 * @param mailboxInfo The mailbox this action is being performed against
 */
const onAddCategoriesFailed = mutatorAction(
    'onAddCategoriesFailed',
    (categoriesToAdd: CategoryType[], errorCodeString?: string, mailboxInfo?: MailboxInfo) => {
        categoriesToAdd.forEach(category => {
            // Remove the categories from the session store
            const indexToRemove = getMasterCategoryList(mailboxInfo).indexOf(category);
            getMasterCategoryList(mailboxInfo).splice(indexToRemove, 1);

            // Remove categories from the pending map
            const namesMapKey = getPendingCategoryNamesMapKey(mailboxInfo, category.Name);
            delete getStore().pendingCategoryNamesMap[namesMapKey];
        });

        logErrorOnUpdateMasterListFailed('add', errorCodeString);
    }
);

/**
 * Error handler of updateMasterCategoryListService
 * @param operationType operation type of update master category list
 * @param errorCode of updateMasterCategoryListService
 */
export function logErrorOnUpdateMasterListFailed(
    operationType: UpdateMasterCategoryListOperationType,
    errorCode?: string
) {
    logUsage('Category_ErrorUpdatingMasterCategories', [operationType, errorCode]);
}

/**
 * Throw an error if there is no matching category found in the master categories list
 * @param foundMatch indicates whether there is a matching category found in the master categories list
 * @param operationType operation type of update master category list
 */
export function logErrorIfNotFoundMatch(
    foundMatch: boolean,
    operationType: UpdateMasterCategoryListOperationType
) {
    if (!foundMatch) {
        trace.errorThatWillCauseAlert('No matching category found. operation: ' + operationType);
        return;
    }
}
