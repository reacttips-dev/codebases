import type ApplyCategoryOperationResponse from 'owa-service/lib/contract/ApplyCategoryOperationResponse';
import applyCategoryOperationOperation from 'owa-service/lib/operation/applyCategoryOperationOperation';
import applyCategoryOperationRequest from 'owa-service/lib/factory/applyCategoryOperationRequest';
import type ApplyCategoryOperationRequest from 'owa-service/lib/contract/ApplyCategoryOperationRequest';
import type CategoryOperation from 'owa-service/lib/contract/CategoryOperation';
import type CategoryOperationType from 'owa-service/lib/contract/CategoryOperationType';

/**
 * Issues a service call to apply rename/delete operation to all items with the category applied
 * @returns a promise with ApplyCategoryOperationResponse
 */
export default async function applyCategoryOperationService(
    operation: CategoryOperationType,
    deleteName: string,
    newName?: string
): Promise<ApplyCategoryOperationResponse> {
    const requestBody = applyCategoryOperationRequest(<ApplyCategoryOperationRequest>{
        categoryOperation: <CategoryOperation>{
            Action: operation,
            CategoryName: deleteName,
            RenameCategoryName: newName,
        },
    });

    return applyCategoryOperationOperation({ request: requestBody }, { timeoutMS: 120000 });
}
