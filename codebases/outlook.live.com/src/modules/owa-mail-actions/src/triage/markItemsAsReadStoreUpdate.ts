import { action } from 'satcheljs';

export default action(
    'MARK_ITEMS_AS_READ_STORE_UPDATE',
    (itemIds: string[], isReadValue: boolean, isExplicit: boolean, tableViewId: string) => {
        return {
            itemIds,
            isReadValue,
            isExplicit,
            tableViewId,
        };
    }
);
