import { getApiUrl } from '../../../Url';

type FetchAudioProcessingStatusParameters = {
  requestUuid: string;
};

export type Data = {
  audioId: string;
  userId: number;
  type: string;
  origin: string;
  duration: number;
  caption: string;
  derivedFromAudioId: number | null;
  originalAudioId: number;
  originalUserId: number;
  locale: null;
  isDeleted: boolean;
  created: string;
  modified: string;
  createdUnixTimestamp: number;
  audioFileId: number;
  videoUploadId?: number;
  color: string;
  url: string;
};

type ProcessingState = 'processed' | 'uploaded' | 'failed';
type Request = {
  audioId: string | null;
  created: string;
  filename: string;
  modified: string;
  region: string;
  requestUuid: string;
  state: ProcessingState;
  userId: number;
};

export type FetchAudioProcessingStatusResponse = {
  requestUuid: string;
  data: Data | null;
  request: Request;
};

export async function fetchAudioProcessingStatus({
  requestUuid,
}: FetchAudioProcessingStatusParameters): Promise<
  FetchAudioProcessingStatusResponse
> {
  try {
    const response = await fetch(
      getApiUrl({
        path: `upload/${requestUuid}`,
      }),
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Could not fetch audio processing status`);
  } catch (err) {
    throw new Error(err.message);
  }
}
