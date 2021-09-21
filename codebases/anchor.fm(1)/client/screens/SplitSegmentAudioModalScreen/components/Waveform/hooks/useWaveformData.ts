import { useEffect, useState, useCallback } from 'react';
import { useCurrentUserCtx } from '../../../../../contexts/CurrentUser';
import AnchorAPI from '../../../../../modules/AnchorAPI';
import { WaveformProcessingStatus } from '../types';

type WaveformData = {
  version: number;
  channels: number;
  sampleRate: number;
  samplesPerPixel: number;
  bits: number;
  length: number;
  data: number[];
};

type WaveformStatus = {
  state?: WaveformProcessingStatus;
  audioId?: number;
  waveform?: WaveformData;
};

export const useWaveformData = (webAudioId: string | number) => {
  const [waveformStatus, setWaveformStatus] = useState<WaveformStatus>();
  const {
    state: { userId },
  } = useCurrentUserCtx();

  // for sai waveform, fetching saved audio files returns the raw audio id which is a number
  const isAudio = typeof webAudioId === 'number';

  const pollForWaveformData = useCallback(() => {
    let isFetching = false;
    const intervalId = setInterval(async () => {
      if (!isFetching) {
        isFetching = true;
        try {
          const {
            audioId,
            state = '',
            waveform,
          } = await AnchorAPI.fetchWaveformData({
            webAudioId,
            userId: isAudio ? userId : null,
          });

          setWaveformStatus({
            state: state as WaveformProcessingStatus,
            audioId,
            waveform,
          });

          switch (state) {
            case WaveformProcessingStatus.FAILED:
            case WaveformProcessingStatus.PROCESSED:
              clearInterval(intervalId);
              break;
            case WaveformProcessingStatus.WAITING:
            default:
              isFetching = false;
              break;
          }
        } catch (err) {
          setWaveformStatus({
            state: WaveformProcessingStatus.FAILED,
          });
          clearInterval(intervalId);
        }
      }
    }, 1500);

    return () => clearInterval(intervalId);
  }, [webAudioId, userId, isAudio]);

  useEffect(() => pollForWaveformData(), [pollForWaveformData]);

  return { waveformStatus, pollForWaveformData };
};
