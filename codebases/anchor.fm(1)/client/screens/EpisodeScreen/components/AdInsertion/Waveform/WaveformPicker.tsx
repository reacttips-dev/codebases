import { Global } from '@emotion/core';
import styled from '@emotion/styled';
import React, { MutableRefObject, useEffect } from 'react';
import { css } from 'emotion';
import serverRenderingUtils from 'helpers/serverRenderingUtils';
import { LoadingBar } from 'screens/SplitSegmentAudioModalScreen/components/LoadingBar';
import {
  convertSecondsToTimestamp,
  formatTimeCallback,
  primaryLabelInterval,
  timeInterval,
} from 'screens/SplitSegmentAudioModalScreen/components/Waveform/helpers';
import { useWaveformControls } from 'screens/SplitSegmentAudioModalScreen/components/Waveform/hooks/useWaveformControls';
import {
  GlobalWaveformStyles,
  WaveformControlsContainer,
} from 'screens/SplitSegmentAudioModalScreen/components/Waveform/styles';
import { ZoomButtons } from 'screens/SplitSegmentAudioModalScreen/components/ZoomButtons';
import {
  CursorPlugin,
  MinimapPlugin,
} from 'screens/SplitSegmentAudioModalScreen/components/Waveform/plugins';
import {
  PlayButton,
  PauseButton,
} from 'screens/SplitSegmentAudioModalScreen/components/PlaybackButtons';

const WaveSurfer: WaveSurfer = !serverRenderingUtils.windowUndefined()
  ? require('wavesurfer.js')
  : null;

const TimelinePlugin: typeof WaveSurfer.WaveSurferPlugin = !serverRenderingUtils.windowUndefined()
  ? require('wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js')
  : null;

const RegionsPlugin: typeof WaveSurfer.WaveSurferPlugin = !serverRenderingUtils.windowUndefined()
  ? require('wavesurfer.js/dist/plugin/wavesurfer.regions.min.js')
  : null;

type WaveformProps = {
  audioId: string | number;
  url: string;
  duration: number;
  setCurrentTime: (time: number) => void;
  currentTime: number;
  wavesurferRef: MutableRefObject<WaveSurfer | null>;
  setWaveformIsReady: (isReady: boolean) => void;
};

export const Waveform = ({
  audioId,
  url,
  duration,
  wavesurferRef,
  setCurrentTime,
  currentTime,
  setWaveformIsReady,
}: WaveformProps) => {
  const {
    zoomIn,
    zoomOut,
    pollForWaveformData,

    // setters
    setIsPlaying,
    setIsReady,

    // getters (state)
    waveformState: { isPlaying, isReady },
    waveformStatus,

    // refs
    waveformRef,
    timelineRef,
    minimapRef,
    audioRef,
  } = useWaveformControls(audioId, wavesurferRef);

  useEffect(() => {
    setWaveformIsReady(isReady);
  }, [setWaveformIsReady, isReady]);

  useEffect(() => {
    const longAudioFile = duration / 1000 > 3600;
    const pixelRatio =
      (!serverRenderingUtils.windowUndefined() && window.devicePixelRatio) || 1;

    const wavesurfer: WaveSurfer = WaveSurfer.create({
      container: waveformRef.current,
      backend: 'MediaElement',
      partialRender: true,
      forceDecode: !longAudioFile, // force waveform to decode on zoom
      height: 250,
      backgroundColor: '#509BF5',
      progressColor: '#fff',
      waveColor: '#fff',
      cursorColor: '#000',
      cursorWidth: 2,
      responsive: true,
      fillParent: true, // force audio to stretch to fill on load
      pixelRatio: longAudioFile ? 1 : pixelRatio,
      normalize: true,
      closeAudioContext: true,
      plugins: [
        // @ts-ignore
        CursorPlugin.create({
          deferInit: true,
          formatTimeCallback: convertSecondsToTimestamp,
          customStyle: {
            height: '275px',
          },
          customShowTimeStyle: {
            background: '#292F36',
            color: '#fff',
            fontSize: '1.4rem',
            fontFamily: 'monospace',
            boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            marginLeft: '-50%',
            fontWeight: 'bold',
            padding: '4px',
            opacity: '0.9',
            marginTop: '85px',
          },
        }),
        // @ts-ignore
        TimelinePlugin.create({
          container: timelineRef.current,
          fontFamily: 'monospace',
          primaryColor: '#bbbcbf',
          secondaryColor: '#fff',
          primaryFontColor: '#7F8287',
          secondaryFontColor: '#7F8287',
          fontSize: 14,
          notchPercentHeight: '30',
          formatTimeCallback,
          timeInterval,
          primaryLabelInterval,
        }),
        // @ts-ignore
        RegionsPlugin.create({
          deferInit: true,
          regionsMinLength: 0.01,
          dragSelection: false,
        }),
        // @ts-ignore
        MinimapPlugin.create({
          deferInit: true,
          container: minimapRef.current,
          showRegions: true,
          isSAI: true,
          overviewBorderRadius: '4px',
        }),
      ],
    });

    // eslint-disable-next-line no-param-reassign
    wavesurferRef.current = wavesurfer;

    wavesurfer.on('ready', () => {
      // init plugins after waveform is generated
      wavesurfer.initPlugin('cursor');
      wavesurfer.initPlugin('minimap');
      wavesurfer.fireEvent('waveform-ready');
      setIsReady(true);

      // set extra css classess for styling
      wavesurfer.drawer.wrapper.className = 'wave-wrapper';
      wavesurfer.drawer.progressWave.className = 'wave-progress';

      // have 1hr+ audio not stretch to fill, set to generated waveform's minPxPerSecond
      if (longAudioFile) wavesurfer.zoom(20);
    });

    wavesurfer.drawer.on('click', (e: MouseEvent, progress: number) => {
      const time = (progress * duration) / 1000;
      setCurrentTime(time);
    });

    wavesurfer.on('audioprocess', time => {
      setCurrentTime(time);
    });

    wavesurfer.on('seek', () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    });

    wavesurfer.on('finish', () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, [
    duration,
    waveformRef,
    timelineRef,
    minimapRef,
    wavesurferRef,
    setIsReady,
    setCurrentTime,
    setIsPlaying,
  ]);

  return (
    <>
      <Global styles={GlobalWaveformStyles} />
      <div
        className={css`
          position: relative;
          background: #f7f7f7;
          padding: 0 40px;
        `}
      >
        <div
          ref={minimapRef}
          className={css`
            padding: 22px 0;
          `}
        />
        <div
          className={css`
            position: relative;
            background: #f7f7f7;
          `}
        >
          <div>
            {!isReady && (
              <LoadingBar
                state={waveformStatus && waveformStatus.state}
                onRetry={pollForWaveformData}
                hideCopy
              />
            )}

            <div
              id="wavesurfer"
              ref={waveformRef}
              className={css`
                background: #f7f7f7;
              `}
            />
          </div>
          <audio ref={audioRef} src={url} />
        </div>
        <div
          ref={timelineRef}
          className={css`
            height: 66px;
            background: #f7f7f7;
          `}
        />
      </div>

      <StyledWaveformControlsContainer>
        <div>
          {isPlaying ? (
            <PauseButton
              onClick={() => {
                if (isReady && wavesurferRef.current) {
                  wavesurferRef.current.pause();
                  setIsPlaying(false);
                }
              }}
            />
          ) : (
            <PlayButton
              onClick={() => {
                if (isReady && wavesurferRef.current) {
                  wavesurferRef.current.play();
                  setIsPlaying(true);
                }
              }}
            />
          )}
          <div
            className={css`
              display: flex;
              flex-direction: column;
              justify-content: center;
              position: relative;
              height: 100%;
            `}
          >
            <Timestamp>{convertSecondsToTimestamp(currentTime)}</Timestamp>
          </div>
        </div>

        <div>
          <ZoomButtons onZoomOut={zoomOut} onZoomIn={zoomIn} />
        </div>
      </StyledWaveformControlsContainer>
    </>
  );
};

const StyledWaveformControlsContainer = styled(WaveformControlsContainer)`
  margin-bottom: 20px;
`;

const Timestamp = styled.div`
  font-family: monospace;
  font-weight: bold;
  font-size: 2.8rem;
  color: #292f36;
  margin: 0 26px;
  width: 220px;
  padding: 0 6px;
`;
