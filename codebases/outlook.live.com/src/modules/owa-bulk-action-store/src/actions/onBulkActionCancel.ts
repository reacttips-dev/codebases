import BulkActionStateEnum from '../store/schema/BulkActionStateEnum';
import logBulkActionInformation from '../utils/logBulkActionData';
import setBulkActionStateAttribute from '../mutators/setBulkActionStateAttribute';
import setBulkActionStateService from '../services/setBulkActionStateService';
import { default as store } from '../store/store';
import * as trace from 'owa-trace';

/**
 * Configure the empty folder request body
 * @param folderId the folder id
 * @returns a promise indicating that the setBulkActionStateService (cancel) was successful
 */
export default function onBulkActionCancel(folderId: string): Promise<boolean> {
    const bulkActionInformation = store.bulkActionInformationMap.get(folderId);

    setBulkActionStateAttribute(folderId, BulkActionStateEnum.Cancelling);
    return setBulkActionStateService(bulkActionInformation.id, BulkActionStateEnum.Cancelled).then(
        response => {
            if ((response as any).ResponseCode == 'NoError') {
                setBulkActionStateAttribute(folderId, BulkActionStateEnum.Cancelled);
                logBulkActionInformation(
                    'TnS_BulkActionClientCancelDatapoint',
                    bulkActionInformation
                );
                return true;
            }
            // Error
            setBulkActionStateAttribute(folderId, bulkActionInformation.state);
            trace.errorThatWillCauseAlert('Empty folder could not be cancelled.');
            return false;
        }
    );
}
