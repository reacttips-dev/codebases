type $Values<O extends object> = O[keyof O];

const UploadStatus = {
  IDLE: 'idle',
  IN_PROGRESS: 'inProgress',
  FAILED: 'failed',
  ASSEMBLIES_COMPLETED: 'assembliesCompleted',
  SUCCESS: 'success',
};

export type UploadStatusType = $Values<typeof UploadStatus>;

export default UploadStatus;

export const { IDLE, IN_PROGRESS, FAILED, ASSEMBLIES_COMPLETED, SUCCESS } = UploadStatus;
