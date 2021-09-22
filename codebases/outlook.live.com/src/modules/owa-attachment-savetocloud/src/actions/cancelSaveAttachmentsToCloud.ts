import { action } from 'satcheljs';

const cancelSaveAttachmentsToCloud = action(
    'cancelSaveAttachmentsToCloud',
    (operationId: string) => ({ operationId: operationId })
);

export default cancelSaveAttachmentsToCloud;
