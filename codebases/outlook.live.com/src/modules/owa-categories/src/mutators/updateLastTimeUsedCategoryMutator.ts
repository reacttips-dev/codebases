import { mutatorAction } from 'satcheljs';
import type CategoryType from 'owa-service/lib/contract/CategoryType';

export default mutatorAction(
    'updateLastTimeUsedCategory',
    function updateLastTimeUsedCategory(category: CategoryType, time: string) {
        category.LastTimeUsed = time;
    }
);
