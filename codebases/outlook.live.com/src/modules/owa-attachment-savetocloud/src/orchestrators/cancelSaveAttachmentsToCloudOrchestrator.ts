import { cancelSaveToCloudProgressManager } from './saveToCloudProgressManager';
import cancelSaveAttachmentsToCloud from '../actions/cancelSaveAttachmentsToCloud';
import { orchestrator } from 'satcheljs';

export default orchestrator(cancelSaveAttachmentsToCloud, actionMessage => {
    cancelSaveToCloudProgressManager(actionMessage.operationId);
});
