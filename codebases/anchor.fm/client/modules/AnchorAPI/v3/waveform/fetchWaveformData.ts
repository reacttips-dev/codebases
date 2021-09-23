import { createWaveformData } from './createWaveformData';

export type FetchWaveformDataResponse = {
  audioId: number;
  state: string;
  waveform: WaveformData;
};

type WaveformData = {
  version: number;
  channels: number;
  sampleRate: number;
  samplesPerPixel: number;
  bits: number;
  length: number;
  data: number[];
};

type Parameters = {
  webAudioId: string | number;
  userId: number | null;
};

export async function fetchWaveformData({
  webAudioId,
  userId,
}: Parameters): Promise<FetchWaveformDataResponse> {
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
      method: 'GET',
      credentials: 'same-origin',
    });
    if (response.ok) {
      const result = await response.json();
      if (result.state === 'not_processed') {
        // no waveform data, make post request to generate
        createWaveformData({ webAudioId, userId });
      }
      return result;
    }
    throw new Error('No waveform data');
  } catch (err) {
    throw new Error(err.message);
  }
}
