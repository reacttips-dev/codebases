import { getApiUrl } from '../../../Url';

type Origin = 'podcasts:upload' | 'forweb:podcasthosting';
type StartAudioProcessingParameters = {
  requestUuid: string;
  origin: Origin;
  caption: string;
  isExtractedFromVideo?: boolean;
};

type StartAudioProcessingResponse = {
  requestUuid: string;
};

export async function startAudioProcessing({
  requestUuid,
  origin,
  caption,
  isExtractedFromVideo = false,
}: StartAudioProcessingParameters): Promise<StartAudioProcessingResponse> {
  try {
    const response = await fetch(
      getApiUrl({
        path: `upload/${requestUuid}/process_audio`,
      }),
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          audioType: 'default',
          origin,
          caption,
          isExtractedFromVideo,
        }),
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Could not create process audio request`);
  } catch (err) {
    throw new Error(err.message);
  }
}
