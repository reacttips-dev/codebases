export async function unMarkAudioAsExternalAd({
  audioId,
}: {
  audioId: string;
}): Promise<Response> {
  try {
    return fetch(
      `/api/proxy/v3/audios/webAudioId:${audioId}/unMarkAudioAsExternalAd`,
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }
    );
  } catch (err) {
    throw new Error(err.message);
  }
}
