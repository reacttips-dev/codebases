import applyCategoryOperationService from '../services/applyCategoryOperationService';
import setBlockedCategoryNames from '../mutators/setBlockedCategoryNames';
import type CategoryOperationType from 'owa-service/lib/contract/CategoryOperationType';
import type { PerformanceDatapoint } from 'owa-analytics';

// Delete/rename and then re-enable functionality once the service command is complete
export default async function applyCategoryOperationHelper(
    operation: CategoryOperationType,
    dp: PerformanceDatapoint,
    oldCategoryName: string,
    newCategoryName?: string
) {
    await applyCategoryOperationService(operation, oldCategoryName, newCategoryName);
    if (dp) {
        dp.end();
    }
    setBlockedCategoryNames([oldCategoryName, newCategoryName], false /* shouldBlockNames */);
}
