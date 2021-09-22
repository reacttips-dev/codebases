import crypto from 'crypto';
import { generateUUID } from 'js/lib/util';
import { s3UploadDir } from 'bundles/fileuploader-uppy/constants/FileUploadConfig';
import {
  UppyFile,
  UppyS3UploadParams,
  PreSignedUrlsResponse,
} from 'bundles/fileuploader-uppy/components/UppyFileUploader';

const DEFAULT_CRYPTO_ALGO = 'md5';
const DEFAULT_CRYPTO_ENCODING = 'base64';

export const calcCheckSum = ({ file }: { file: File }): Promise<string> =>
  new Promise((resolve, reject) => {
    const hash = crypto.createHash(DEFAULT_CRYPTO_ALGO);
    const reader = new FileReader();
    const error = new Error('Unable to calculate file checksum');

    reader.onerror = (event) => {
      reject(error);
    };

    reader.onload = (event) => {
      if (reader.result instanceof ArrayBuffer) {
        const buffer = Buffer.from(new Uint8Array(reader.result));
        resolve(hash.update(buffer).digest(DEFAULT_CRYPTO_ENCODING));
      } else {
        reject(error);
      }
    };

    reader.readAsArrayBuffer(file);
  });

export const getS3FileKey = ({ file, uploadDir }: { file: UppyFile; uploadDir?: string }) =>
  [uploadDir || s3UploadDir, Date.now(), generateUUID(), file.name].join('/');

export const buildS3UploadParams = ({ data }: PreSignedUrlsResponse): UppyS3UploadParams => {
  if (
    !(((((data || {}).PreSignedUrlsV1 || {}).action || {}).elements || [])[0] || {}).url ||
    !(((((data || {}).PreSignedUrlsV1 || {}).action || {}).elements || [])[0] || {}).additionalHeaders
  ) {
    throw new Error('Unable to build S3 upload params: Missing pre-signed url data');
  }

  const { url, additionalHeaders } = data.PreSignedUrlsV1.action.elements[0];
  const headers = additionalHeaders.reduce<Record<string, string>>((acc, curr) => {
    acc[curr.name] = curr.value;
    return acc;
  }, {});

  return {
    method: 'PUT',
    url,
    headers,
    fields: {},
  };
};

export default {
  calcCheckSum,
  getS3FileKey,
  buildS3UploadParams,
};
