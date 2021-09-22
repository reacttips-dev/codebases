import store from '../store/store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'deleteBulkActionState',
    function deleteBulkActionState(folderId: string) {
        store.bulkActionInformationMap.delete(folderId);
    }
);
