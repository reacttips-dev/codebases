import { AnchorAPI } from '../AnchorAPI';
import { FetchAudioProcessingStatusResponse } from '../AnchorAPI/v3/upload/fetchAudioProcessingStatus';

type UploadFileParameters = {
  file: File;
  fileCaption: string;
  origin: 'podcasts:upload' | 'forweb:podcasthosting';
  isExtractedFromVideo?: boolean;
  onProgress?: (e: ProgressEvent<EventTarget>) => void;
  onSuccess?: () => void;
  onError?: (e: ProgressEvent<EventTarget>) => void;
};

export async function uploadAudioFile({
  file,
  fileCaption,
  origin,
  isExtractedFromVideo = false,
  onProgress,
  onSuccess,
  onError,
}: UploadFileParameters): Promise<{ requestUuid: string }> {
  try {
    // actually upload file to s3
    const { requestUuid } = await AnchorAPI.uploadFile({
      file,
      onProgress,
      onError,
    });
    if (onSuccess) onSuccess();

    // start processing audio
    return AnchorAPI.startAudioProcessing({
      requestUuid,
      origin,
      caption: fileCaption,
      isExtractedFromVideo,
    });
  } catch (err) {
    throw new Error(err.message);
  }
}

type PollParameters = {
  onSuccess?: (res: FetchAudioProcessingStatusResponse) => void;
  onError: () => void;
  requestUuid: string;
};

export function pollAudioProcessingStatus({
  onSuccess,
  onError,
  requestUuid,
}: PollParameters) {
  let attempts = 0;
  let isFetching = false;
  pollFunction();

  function pollFunction() {
    setTimeout(
      () => {
        if (!isFetching) {
          isFetching = true;
          attempts = attempts + 1;
          AnchorAPI.fetchAudioProcessingStatus({ requestUuid })
            .then(res => {
              const {
                request: { state },
              } = res;
              switch (state) {
                case 'processed':
                  if (onSuccess) onSuccess(res);
                  break;
                case 'failed':
                  onError();
                  break;
                default:
                  pollFunction();
                  break;
              }
            })
            .catch(() => onError())
            .finally(() => {
              isFetching = false;
            });
        }
      },
      attempts === 0 ? 0 : getTimeoutDuration(attempts)
    );
  }
}

export function getTimeoutDuration(attempts: number) {
  if (attempts < 10) return 1000;
  if (attempts < 30) return 3000;
  if (attempts < 60) return 5000;
  return 10000;
}
