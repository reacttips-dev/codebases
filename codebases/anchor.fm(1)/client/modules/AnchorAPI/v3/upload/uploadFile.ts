import { getUnixSaveFilePathName } from '../../../File';
import { fetchSignedUrl } from './fetchSignedUrl';

type Parameters = {
  file: File;
  onProgress?: (e: ProgressEvent<EventTarget>, xhr: XMLHttpRequest) => void;
  onError?: (e: ProgressEvent<EventTarget>) => void;
};

type UploadFileResponse = { xhr: XMLHttpRequest; requestUuid: string };

export async function uploadFile({
  file,
  onProgress,
  onError,
}: Parameters): Promise<UploadFileResponse> {
  try {
    const filename = getUnixSaveFilePathName(file.name);
    const { signedUrl, requestUuid } = await fetchSignedUrl({
      filename,
      fileType: file.type,
    });

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      if (onProgress) {
        xhr.upload.addEventListener(
          'progress',
          e => {
            onProgress(e, xhr);
          },
          false
        );
      }
      xhr.onload = function onXhrLoad() {
        resolve({ xhr, requestUuid });
      };
      xhr.onerror = function handleError(e) {
        if (onError) onError(e);
        reject(e);
      };
      xhr.open('PUT', signedUrl);
      xhr.send(file);
    });
  } catch (err) {
    throw new Error(err.message);
  }
}
