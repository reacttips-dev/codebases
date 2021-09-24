type CreateVideoPreviewParams = {
  requestUuid: string;
};

export async function createVideoPreview({
  requestUuid,
}: CreateVideoPreviewParams): Promise<any> {
  try {
    const resp = await fetch(`/api/proxy/v3/upload/${requestUuid}/preview`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });

    if (resp.ok) {
      return resp.json();
    }

    throw new Error('Could not create video preview');
  } catch (e) {
    throw new Error(e.message);
  }
}
