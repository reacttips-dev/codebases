/* eslint-disable no-param-reassign */
import { Promise as BPromise } from 'bluebird';
import { getUnixSaveFilePathName } from '../../../File';
import { fetchSignedUrl, SignedUrlPartsProps } from './fetchSignedUrl';

type Parameters = {
  file: File;
  onProgress: (xhr: XMLHttpRequest, loaded: number, total: number) => void;
  onError: (e: ProgressEvent<EventTarget>) => void;
};

export type Part = { partNumber: number; etag: string };

type UploadFileMultipartResponse = {
  uploadId: string;
  completedParts: Part[];
  requestUuid: string;
};

type Chunk = SignedUrlPartsProps & { id: number; attempts: number };

type Cache = { [chunkId: number]: number };

export async function uploadFileMultipart({
  file,
  onProgress,
  onError,
}: Parameters): Promise<UploadFileMultipartResponse> {
  const chunkSize = 5e7; // 50MB
  // NUMPARTS: This is the _requested_ num parts, but the server may be incapable of this amount,
  // potentially adjusted later based on the response
  const numParts = Math.ceil(file.size / chunkSize);
  const maxThreads = 5;
  const maxAttempts = 3;
  const progressCache: Cache = {};
  let chunksQueue: Chunk[];
  let uploadedSize = 0;
  const activeConnections: { [id: number]: XMLHttpRequest } = {};
  const completedParts: Part[] = [];

  try {
    const filename = getUnixSaveFilePathName(file.name);
    const { signedUrlParts, uploadId, requestUuid } = await fetchSignedUrl({
      filename,
      fileType: file.type,
      isMultipartUpload: true,
      numParts,
      uploadType: file.type.match(/video/i) ? 'video' : 'audio',
    });

    // set up the queue of chunks
    chunksQueue = signedUrlParts
      .map((part, i) => ({ ...part, id: i, attempts: 1 }))
      .reverse();

    // NUMPARTS: adjust down to what we have available from backend
    // use ceil to make sure there is always enough room for the full file
    // among the chunks
    const signedChunkSize = Math.ceil(file.size / signedUrlParts.length);
    return new Promise((resolve, reject) => {
      const sendNext = () => {
        const currentConnections = Object.keys(activeConnections).length;
        if (currentConnections >= maxThreads) {
          return;
        }

        if (!chunksQueue.length) {
          if (!currentConnections) {
            resolve({ completedParts, uploadId, requestUuid });
          }
          return;
        }

        const chunk = chunksQueue.pop()!;
        const begin = chunk.id * signedChunkSize;
        const fileChunk = file.slice(begin, begin + signedChunkSize);
        const onAbortUploadChunk = () => {
          // if we abort one, we abort them all
          Object.keys(activeConnections).forEach(id => {
            activeConnections[parseInt(id, 10)].abort();
          });
        };
        const onProgressUploadChunk = (
          xhr: XMLHttpRequest,
          e: ProgressEvent
        ) => {
          if (
            e.type === 'progress' ||
            e.type === 'error' ||
            e.type === 'abort'
          ) {
            // save the current progress on these events
            progressCache[chunk.id] = e.loaded;
          }

          // once chunk has finished uploading add the cached loaded size to the final loaded size
          if (e.type === 'loadend') {
            uploadedSize = uploadedSize + (progressCache[chunk.id] || 0);
            delete progressCache[chunk.id];
          }

          // grab all the cached loaded values and add them together
          const inProgress = Object.keys(progressCache)
            .map(key => parseInt(key, 10))
            .reduce((memo, id) => memo + progressCache[id], 0);

          // ensure that we don't go over original file size so we don't end up with > 100%
          const sentLength = Math.min(uploadedSize + inProgress, file.size);

          onProgress(xhr, sentLength, file.size);
        };

        // send the chunk
        uploadChunk(
          chunk,
          fileChunk,
          onProgressUploadChunk,
          activeConnections,
          onAbortUploadChunk
        )
          .then(data => {
            completedParts.push(data);
            return sendNext();
          })
          // eslint-disable-next-line consistent-return
          .catch(e => {
            if (chunk.attempts > maxAttempts) {
              if (onError) onError(e);
              reject(e);
              // then abort all the rest
              onAbortUploadChunk();
            } else {
              // with each attempt delay by a factor of ten to account for potential network/connection issues
              return BPromise.delay(10000 * chunk.attempts).then(() => {
                chunk.attempts = chunk.attempts + 1;
                chunksQueue.push(chunk);
                return sendNext();
              });
            }
          });

        sendNext();
      };

      // kick off the upload
      return sendNext();
    });
  } catch (e) {
    throw new Error(e.message);
  }
}

function uploadChunk(
  chunk: Chunk,
  fileChunk: Blob,
  onProgressCallback: (xhr: XMLHttpRequest, e: ProgressEvent) => void,
  activeConnections: { [id: number]: XMLHttpRequest },
  onAbort: () => void
): Promise<Part> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    activeConnections[chunk.id] = xhr;

    xhr.upload.addEventListener(
      'progress',
      e => {
        onProgressCallback(xhr, e);
      },
      false
    );
    xhr.onload = function onXhrLoad() {
      if (xhr.getResponseHeader('ETag')) {
        const etag = JSON.parse(xhr.getResponseHeader('ETag')!);
        resolve({ partNumber: chunk.partNumber, etag });
      } else {
        reject(new Error('Missing etag'));
      }
      delete activeConnections[chunk.id];
    };
    xhr.onerror = function onError(e) {
      reject(e);
      delete activeConnections[chunk.id];
    };

    xhr.onabort = function onAbortCallback() {
      onAbort();
    };

    xhr.open('PUT', chunk.url);
    xhr.send(fileChunk);
  });
}
