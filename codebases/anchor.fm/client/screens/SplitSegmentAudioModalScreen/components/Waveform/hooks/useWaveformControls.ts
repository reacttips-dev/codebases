import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useWaveformData } from './useWaveformData';

export const useWaveformControls = (
  audioId: string | number,
  wavesurferRef: MutableRefObject<WaveSurfer | null>
) => {
  const { waveformStatus, pollForWaveformData } = useWaveformData(audioId);

  const waveformRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLMediaElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // load waveform data when BE response returns
  useEffect(() => {
    if (
      wavesurferRef &&
      wavesurferRef.current &&
      waveformStatus &&
      waveformStatus.state === 'processed'
    ) {
      const peaks =
        waveformStatus &&
        waveformStatus.waveform &&
        waveformStatus.waveform.data;
      const audioEl = audioRef.current as HTMLMediaElement;
      wavesurferRef.current.load(audioEl, peaks);
    }
  }, [waveformStatus, wavesurferRef]);

  const zoomIn = useCallback(() => {
    if (wavesurferRef && wavesurferRef.current) {
      const width =
        wavesurferRef.current.drawer.wrapper.scrollWidth *
        wavesurferRef.current.params.pixelRatio;
      const pxPerSecond = width / wavesurferRef.current.getDuration();
      const value = pxPerSecond < 20 ? 5 : 15;
      wavesurferRef.current.zoom(Math.min(350, pxPerSecond + value));
    }
  }, [wavesurferRef]);

  const zoomOut = useCallback(() => {
    if (wavesurferRef && wavesurferRef.current) {
      const newPxPerSec = wavesurferRef.current.params.minPxPerSec - 30;
      // @ts-ignore
      wavesurferRef.current.zoom(newPxPerSec <= 0 ? false : newPxPerSec);
    }
  }, [wavesurferRef]);

  const handleKeyDown = useCallback(
    e => {
      if (e.target.classList.contains('modal') && e.keyCode === 32) {
        if (wavesurferRef && wavesurferRef.current) {
          wavesurferRef.current.playPause();
          setIsPlaying(playing => !playing);
        }
      } else if (
        e.target.nodeName !== 'TEXTAREA' &&
        e.target.nodeName !== 'INPUT'
      ) {
        switch (e.keyCode) {
          case 187:
          case 61:
            zoomIn();
            break;

          case 189:
          case 173:
            zoomOut();
            break;
          default:
        }
      }
    },
    [wavesurferRef, zoomIn, zoomOut]
  );

  // bind keyboard shortcuts
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    zoomIn,
    zoomOut,
    pollForWaveformData,

    // setters
    setError,
    setIsPlaying,
    setIsReady,

    // getters (state)
    waveformState: {
      error,
      isPlaying,
      isReady,
    },
    waveformStatus,

    // refs
    waveformRef,
    timelineRef,
    minimapRef,
    audioRef,
    wavesurferRef,
  };
};
