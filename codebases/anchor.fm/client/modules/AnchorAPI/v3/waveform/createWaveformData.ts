type Parameters = {
  webAudioId: string | number;
  userId: number | null;
};

export async function createWaveformData({
  webAudioId,
  userId,
}: Parameters): Promise<Response> {
  try {
    if (userId) {
      if (typeof webAudioId !== 'number')
        throw new Error('When userId is provided, audio ID must be a number');
    } else if (typeof webAudioId !== 'string')
      throw new Error('Audio ID must be a string');

    const url = userId
      ? `/api/proxy/v3/audios/${webAudioId}/waveform?userId=${userId}`
      : `/api/proxy/v3/audios/webAudioId:${webAudioId}/waveform`;
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });
    if (response.ok) return response;
    throw new Error('Unable to generate waveform data');
  } catch (err) {
    throw new Error(err.message);
  }
}
