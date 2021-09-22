import store from '../store/store';
import type { BulkActionStateEnum } from '../index';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setBulkActionStateAttribute',
    function setBulkActionStateAttribute(folderId: string, state: BulkActionStateEnum) {
        const bulkActionInfo = store.bulkActionInformationMap.get(folderId);
        if (bulkActionInfo) {
            bulkActionInfo.state = state;
        }
    }
);
