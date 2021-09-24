type UploadImageParams = {
  imageBlob: Blob;
};

export type UploadOptions = {
  isEpisode: boolean;
  doOverrideSize: boolean;
};
type UploadOptionsKeys = keyof UploadOptions;

export async function uploadImage(
  { imageBlob }: UploadImageParams,
  options?: UploadOptions
) {
  try {
    const formData = new FormData();
    formData.append('file', imageBlob);
    if (options) {
      (Object.keys(options) as UploadOptionsKeys[]).forEach(key => {
        formData.append(key, `${options[key]}`);
      });
    }
    const response = await fetch(`/api/onboarding/image`, {
      method: 'POST',
      credentials: 'same-origin',
      body: formData,
    });
    let error;
    let json;
    if (response.ok) {
      json = await response.json();
    } else {
      switch (response.status) {
        case 400:
          error = 'Missing image';
          break;
        default:
          error = 'Unexpected error';
          break;
      }
    }
    return { response, json, error };
  } catch (err) {
    throw new Error('Unexpected error');
  }
}
