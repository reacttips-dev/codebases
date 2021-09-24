import { getApiUrl } from '../../../Url';

type SignedUrlParameters = {
  filename: string;
  fileType: string;
  isMultipartUpload?: boolean;
  numParts?: number;
  uploadType?: string;
};

export type SignedUrlPartsProps = {
  url: string;
  partNumber: number;
};

type SignedUrlBaseResponse = {
  fileKey: string;
  filename: string;
  requestUuid: string;
};

export type SignedUrlMultipartResponse = SignedUrlBaseResponse & {
  signedUrlParts: SignedUrlPartsProps[];
  uploadId: string;
};

export type SignedUrlResponse = SignedUrlBaseResponse & {
  signedUrl: string;
};

export async function fetchSignedUrl({
  filename,
  fileType,
  isMultipartUpload,
  numParts,
  uploadType,
}: SignedUrlParameters): Promise<
  SignedUrlResponse & SignedUrlMultipartResponse
> {
  try {
    const params = { filename, type: fileType };
    const response = await fetch(
      getApiUrl({
        path: `upload/signed_url`,
        queryParameters: isMultipartUpload
          ? { ...params, isMultipartUpload, numParts, uploadType }
          : params,
      }),
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Could not fetch signed url`);
  } catch (err) {
    throw new Error(err.message);
  }
}
