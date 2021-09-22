import type { MailboxInfo } from 'owa-client-ids';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import type CategoryType from 'owa-service/lib/contract/CategoryType';
import type UpdateMasterCategoryListResponse from 'owa-service/lib/contract/UpdateMasterCategoryListResponse';
import updateMasterCategoryListRequest from 'owa-service/lib/factory/updateMasterCategoryListRequest';
import updateMasterCategoryListOperation from 'owa-service/lib/operation/updateMasterCategoryListOperation';

/**
 * Issues a service call to update master category list
 * @param categoriesToAdd the categories to add
 * @param categoriesToRemove the categories to remove
 * @param categoriesToChangeColor the categories to change color
 * @param mailboxInfo the mailbox that has the account info
 * @returns a promise with UpdateMasterCategoryListResponse
 */
export default async function updateMasterCategoryListService(
    categoriesToAdd: CategoryType[],
    categoriesToRemove: string[],
    categoriesToChangeColor: CategoryType[],
    categoriesToUpdateLastTimeUsed: string[],
    mailboxInfo: MailboxInfo
): Promise<UpdateMasterCategoryListResponse> {
    let requestBody = updateMasterCategoryListRequest({
        AddCategoryList: categoriesToAdd,
        RemoveCategoryList: categoriesToRemove,
        ChangeCategoryColorList: categoriesToChangeColor,
        UpdateCategoryLastTimeUsedList: categoriesToUpdateLastTimeUsed,
    });

    return updateMasterCategoryListOperation(
        { request: requestBody },
        getMailboxRequestOptions(mailboxInfo)
    );
}
