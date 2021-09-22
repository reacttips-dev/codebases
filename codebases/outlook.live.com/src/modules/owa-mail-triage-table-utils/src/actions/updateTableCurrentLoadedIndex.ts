import { action } from 'satcheljs';

export default action(
    'UPDATE_TABLE_CURRENT_LOADED_INDEX',
    (tableViewId: string, currentLoadedIndexToSet: number) => ({
        tableViewId,
        currentLoadedIndexToSet,
    })
);
