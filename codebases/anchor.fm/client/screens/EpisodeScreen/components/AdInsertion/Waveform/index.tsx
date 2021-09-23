import React, { useCallback, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';
import { css } from 'emotion';
import { SAIWaveformContext } from 'components/AdInsertion/context';
import { WaveformAudioInfo } from 'screens/EpisodeScreen/context';
import {
  convertSecondsToTimestamp,
  convertTimestampToSeconds,
} from 'screens/SplitSegmentAudioModalScreen/components/Waveform/helpers';
import { PlacementType } from 'modules/AnchorAPI/v3/episodes/saveAdCuePoints';
import { SavedCuePoint } from 'screens/EpisodeScreen/components/CuePoints/types';
import { SAICuepoints } from './CuePoints';
import { WaveformCuePoint } from './types';
import { Waveform } from './WaveformPicker';

type SAIWaveformProps = {
  duration: number;
  waveformAudioInfo: WaveformAudioInfo;
};

export const adColor = {
  preRoll: '#8940FA',
  midRoll: '#66CCB4',
  postRoll: '#E569FF',
};

export function SAIWaveform({ duration, waveformAudioInfo }: SAIWaveformProps) {
  const wavesurferRef = useRef<WaveSurfer>(null);
  const [selectedAdType, setSelectedAdType] = useState<PlacementType | null>(
    'preRoll'
  );
  const [currentTime, setCurrentTime] = useState(0); // in seconds
  const [waveformIsReady, setWaveformIsReady] = useState(false);

  const onTimestampInputChange = (time: number) => {
    // time is in seconds
    if (wavesurferRef.current) {
      const wavesurferDuration = wavesurferRef.current.getDuration();
      if (time <= wavesurferDuration)
        wavesurferRef.current.seekAndCenter(
          time / wavesurferRef.current.getDuration()
        );
    }
  };

  const findCuePointInWaveform = useCallback(
    (cuePoint: SavedCuePoint) => {
      if (wavesurferRef.current) {
        const cuePointTarget = Object.values(
          (wavesurferRef.current.regions.list as unknown) as {
            [waveformRegionId: string]: WaveformCuePoint;
          }
        ).find(
          (reg: WaveformCuePoint) => reg.type === cuePoint.startTimeString
        );
        return cuePointTarget || null;
      }
      return null;
    },
    [wavesurferRef]
  );

  const placeCuePoint = useCallback(
    (cuePoint?: SavedCuePoint & { id: string }) => {
      if (wavesurferRef.current) {
        // first check if passed in cue point already exists on the waveform
        if (cuePoint) {
          const region = findCuePointInWaveform(cuePoint);
          if (region) return;
        }

        const seconds = cuePoint
          ? convertTimestampToSeconds(cuePoint.startTimeString)
          : currentTime;
        const color = cuePoint
          ? adColor[cuePoint.placementType]
          : adColor[selectedAdType || 'preRoll'];
        const r = wavesurferRef.current.addRegion({
          start: seconds,
          end: seconds + 0.01,
          loop: false,
          color,
          resize: false,
          drag: false,
        });
        r.type = convertSecondsToTimestamp(seconds);

        // adding label to marker
        const regionsCount = Object.values(wavesurferRef.current.regions.list)
          .length;
        const cuePointId = cuePoint
          ? cuePoint.id
          : String.fromCharCode(65 + regionsCount - 1);
        const placementType = cuePoint
          ? cuePoint.placementType
          : selectedAdType || 'preRoll';
        const adMarker = (
          <WaveformAdId
            placementType={placementType}
            aria-label={`Waveform cue point label - ${placementType} ${cuePointId}`}
          >
            {cuePointId}
          </WaveformAdId>
        );
        ReactDOM.render(adMarker, r.element);
      }
    },
    [wavesurferRef, currentTime, selectedAdType, findCuePointInWaveform]
  );

  const clearCuePoints = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.clearRegions();
    }
  };

  const onTableRowClick = (cuePoint: SavedCuePoint) => {
    if (wavesurferRef.current) {
      onTimestampInputChange(
        convertTimestampToSeconds(cuePoint.startTimeString)
      );
    }
  };

  return (
    <SAIWaveformContext.Provider
      value={{ onTimestampInputChange, onTableRowClick }}
    >
      <div>
        {waveformAudioInfo &&
          waveformAudioInfo.audioId &&
          waveformAudioInfo.url && (
            <>
              <div aria-label="waveform selector">
                <Waveform
                  audioId={waveformAudioInfo.audioId}
                  url={waveformAudioInfo.url}
                  duration={duration}
                  wavesurferRef={wavesurferRef}
                  currentTime={currentTime}
                  setCurrentTime={setCurrentTime}
                  setWaveformIsReady={setWaveformIsReady}
                />
              </div>

              <hr
                className={css`
                  margin-bottom: 30px;
                `}
              />
            </>
          )}

        <div
          className={css`
            ${!waveformAudioInfo && 'margin-top: 30px;'}
          `}
        >
          <SAICuepoints
            placeCuePoint={placeCuePoint}
            waveformIsReady={waveformIsReady}
            duration={duration}
            setSelectedAdType={setSelectedAdType}
            currentTime={currentTime}
            clearCuePoints={clearCuePoints}
          />
        </div>
      </div>
    </SAIWaveformContext.Provider>
  );
}

const WaveformAdId = styled.div<{ placementType: PlacementType }>`
  background-color: ${({ placementType }) => adColor[placementType]};
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  border-radius: 5px;
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  position: absolute;
  left: -13px;
`;
