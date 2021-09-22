import store from '../store/store';
import type { BulkActionInformation } from '../store/schema/BulkActionStateStore';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setBulkActionInformation',
    function setBulkActionInformation(
        folderId: string,
        bulkActionInformation: BulkActionInformation
    ) {
        store.bulkActionInformationMap.set(folderId, bulkActionInformation);
    }
);
