import { getApiUrl } from '../../../Url';
import { Part } from './uploadFileMultipart';

type StartMediaProcessingParameters = {
  requestUuid: string;
  uploadType: 'default' | 'video';
  caption: string;
  isExtractedFromVideo?: boolean;
  isMultipartUpload?: boolean;
  origin: string;
  parts?: Part[];
  isSpotifyVideoPodcastEnabled: boolean;
  uploadId: string;
};

type StartMediaProcessingResponse = {
  requestUuid: string;
};

export async function startMediaProcessing({
  requestUuid,
  uploadType,
  caption,
  isExtractedFromVideo,
  isMultipartUpload,
  origin,
  parts,
  isSpotifyVideoPodcastEnabled,
  uploadId,
}: StartMediaProcessingParameters): Promise<StartMediaProcessingResponse> {
  try {
    const resp = await fetch(
      getApiUrl({
        path: `upload/${requestUuid}/process_upload`,
      }),
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          uploadType,
          origin,
          caption,
          isExtractedFromVideo,
          isMultipartUpload,
          parts,
          isSpotifyVideoPodcastEnabled,
          uploadId,
        }),
      }
    );
    if (resp.ok) {
      return resp.json();
    }
    throw new Error(`Could not create process media request`);
  } catch (e) {
    throw new Error(e.message);
  }
}
