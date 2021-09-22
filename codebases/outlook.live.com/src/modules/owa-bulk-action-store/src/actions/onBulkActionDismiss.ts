import bulkActionStore from '../store/store';
import deleteBulkActionState from '../mutators/deleteBulkActionState';
import logBulkActionInformation from '../utils/logBulkActionData';

export default function onBulkActionDismiss(folderId: string) {
    const bulkActionInformation = bulkActionStore.bulkActionInformationMap.get(folderId);
    logBulkActionInformation('TnS_BulkActionDismissDatapoint', bulkActionInformation);
    deleteBulkActionState(folderId);
}
