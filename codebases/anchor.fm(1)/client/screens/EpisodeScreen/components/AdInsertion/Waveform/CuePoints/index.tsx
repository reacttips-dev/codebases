import React, { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { css } from 'emotion';
import {
  useAdInsertionContext,
  useSAIModalContext,
  useSAIWaveformContext,
} from 'components/AdInsertion/context';
import { FieldSelect } from '../../../../../../components/Field';
import InfoButton from '../../../../../../components/InfoButton';
import { InputContainer } from '../../../CuePoints/styles';
import { SavedCuePoint } from '../../../CuePoints/types';
import { DURATION_ERROR_MESSAGE, STATUS } from '../../../CuePoints/constants';
import { Button } from '../../../../../../shared/Button/NewButton';
import { PlacementType } from '../../../../../../modules/AnchorAPI/v3/episodes/saveAdCuePoints';
import { CuePointsTable } from './CuePointTable';
import {
  convertSecondsToTimestamp,
  convertTimestampToSeconds,
  getIsValidTimestamp,
} from '../../../../../SplitSegmentAudioModalScreen/components/Waveform/helpers';
import { TimestampInput } from '../../../CuePoints/TimestampInput';
import { EditCuePointModal } from './EditCuePointModal';

type CuePointsProps = {
  currentTime: number;
  duration: number;
  waveformIsReady: boolean;
  placeCuePoint: (cuePoint?: SavedCuePoint & { id: string }) => void;
  setSelectedAdType: (placementType: PlacementType | null) => void;
  clearCuePoints: () => void;
};

function SAICuepoints({
  duration,
  placeCuePoint,
  setSelectedAdType,
  currentTime,
  clearCuePoints,
  waveformIsReady,
}: CuePointsProps) {
  const { onTimestampInputChange } = useSAIWaveformContext();
  const { setCuePointErrors } = useSAIModalContext();
  const {
    cuePointsState: { newCuePoint, status, errors, savedCuePoints },
    updateNewCuePoint,
    addCuePoint,
    removeCuePoint,
    editCuePoint,
  } = useAdInsertionContext();

  const [showEditModal, setShowEditModal] = useState(false);
  const [
    selectedCuePoint,
    setSelectedCuePoint,
  ] = useState<SavedCuePoint | null>(null);

  const onClickEditCuePoint = (cuePoint: SavedCuePoint) => {
    setShowEditModal(true);
    setSelectedCuePoint(cuePoint);
  };

  const onClickCancel = () => {
    setShowEditModal(false);
    setSelectedCuePoint(null);
  };

  const onClickSave = useCallback(
    (editedCuePoint: SavedCuePoint) => {
      if (selectedCuePoint) editCuePoint(editedCuePoint, selectedCuePoint);
      onClickCancel();
    },
    [selectedCuePoint, editCuePoint]
  );

  useEffect(() => {
    // update potential new cue point state and timestamp
    // input when waveform cursor position has been updated
    if (
      convertSecondsToTimestamp(currentTime) !== newCuePoint.startTimeString
    ) {
      updateNewCuePoint({
        ...newCuePoint,
        startTimeString: convertSecondsToTimestamp(currentTime),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime]);

  useEffect(() => {
    setCuePointErrors(errors);
  }, [errors, setCuePointErrors]);

  useEffect(() => {
    // for existing episodes that have cue points,
    // add them to the waveform if they fall within the duration
    // of the audio file
    if (savedCuePoints && waveformIsReady && !errors) {
      // first clear cue points and then redraw
      clearCuePoints();
      savedCuePoints
        .map((cp, idx) => ({ ...cp, id: String.fromCharCode(65 + idx) }))
        .forEach(cp => {
          if (cp.startTime < duration) placeCuePoint(cp);
        });
    }
  }, [
    savedCuePoints,
    waveformIsReady,
    errors,
    clearCuePoints,
    placeCuePoint,
    duration,
  ]);

  return (
    <>
      <div
        className={css`
          padding: 0 40px;
        `}
      >
        <FieldsContainer>
          <Inputs>
            <CuePointInputContainer
              className={css`
                max-width: 220px;
              `}
            >
              <label
                className={css`
                  margin-right: 4px;
                `}
                htmlFor="cue-points-timestamp"
              >
                Timestamp
              </label>
              <InfoButton
                direction="top"
                width={260}
                ariaLabel="Show tooltip with more information on the timestamp form input"
              >
                <span>
                  Enter all 9 digits in the following format: 00 (hr) : 00 (min)
                  : 00 (sec) . 000 (msec)
                </span>
              </InfoButton>
              <TimestampInput
                initialValue={newCuePoint.startTimeString}
                error={(() => {
                  const error = errors
                    ? errors.find(
                        err =>
                          err.message !== DURATION_ERROR_MESSAGE &&
                          err.type === 'startTime'
                      )
                    : errors;
                  return error ? !!error.message : error;
                })()}
                name="cue-points-timestamp"
                ariaDescribedBy="cue-points-timestamp-description"
                onChange={(value: string) => {
                  updateNewCuePoint({
                    ...newCuePoint,
                    startTimeString: value,
                  });
                  // if valid timestamp update the cursor on waveform
                  if (getIsValidTimestamp(value)) {
                    onTimestampInputChange(convertTimestampToSeconds(value));
                  }
                }}
              />
            </CuePointInputContainer>
            <CuePointInputContainer
              className={css`
                max-width: 72px;
              `}
            >
              <label
                className={css`
                  margin-right: 4px;
                `}
                htmlFor="cue-points-count"
              >
                Count
              </label>
              <InfoButton
                direction="top"
                width={260}
                ariaLabel="Show tooltip with more information on the count form input"
              >
                <span>
                  Count represents the maximum number of ads that may play
                  sequentially at the corresponding timestamp.
                </span>
              </InfoButton>
              <FieldSelect
                id="cue-points-count"
                name="cue-points-count"
                error={(() => {
                  const error = errors
                    ? errors.find(err => err.type === 'adCount')
                    : errors;
                  return error;
                })()}
                aria-describedby="cue-points-count-description"
                options={[
                  { label: '-', value: '' },
                  { label: '1', value: '1' },
                  { label: '2', value: '2' },
                  { label: '3', value: '3' },
                  { label: '4', value: '4' },
                  { label: '5', value: '5' },
                ]}
                value={
                  newCuePoint.adCount ? newCuePoint.adCount.toString() : ''
                }
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const {
                    target: { value },
                  } = e;
                  updateNewCuePoint({
                    ...newCuePoint,
                    adCount: value === '' ? 0 : parseInt(value, 10),
                  });
                }}
              />
            </CuePointInputContainer>
            <CuePointInputContainer
              className={css`
                max-width: 208px;
                @media (max-width: 600px) {
                  margin: 0 0 24px;
                }
              `}
            >
              <label htmlFor="cue-points-ad-type">Ad type</label>
              <FieldSelect
                id="cue-points-ad-type"
                name="cue-points-ad-type"
                aria-describedby="cue-points-ad-type-description"
                value={
                  newCuePoint.placementType
                    ? newCuePoint.placementType.toString()
                    : ''
                }
                error={(() => {
                  const error = errors
                    ? errors.find(err => err.type === 'placementType')
                    : errors;
                  return error;
                })()}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const {
                    target: { value },
                  } = e;
                  const placementType = [
                    'preRoll',
                    'midRoll',
                    'postRoll',
                  ].includes(value)
                    ? (value as PlacementType)
                    : null;
                  updateNewCuePoint({
                    ...newCuePoint,
                    placementType,
                  });
                  setSelectedAdType(placementType);
                }}
                options={[
                  { label: 'Select ad type', value: '' },
                  { label: 'Pre-Roll', value: 'preRoll' },
                  { label: 'Mid-Roll', value: 'midRoll' },
                  { label: 'Post-Roll', value: 'postRoll' },
                ]}
              />
            </CuePointInputContainer>
            <Button
              isDisabled={status === STATUS.IS_SAVING}
              type="button"
              color="white"
              className={css`
                @media (max-width: 600px) {
                  width: 100%;
                }
              `}
              onClick={addCuePoint}
            >
              {status === STATUS.IS_SAVING ? 'Saving...' : 'Insert ad slot'}
            </Button>
          </Inputs>

          <AdCount>
            <label>Ad slots inserted</label>
            <span>
              {savedCuePoints
                ? savedCuePoints.reduce((acc, cp) => cp.adCount + acc, 0)
                : 0}
            </span>
          </AdCount>
        </FieldsContainer>
      </div>

      <div
        className={css`
          padding: 0 40px;
        `}
      >
        <CuePointsTable
          cuePoints={savedCuePoints}
          removeCuePoint={removeCuePoint}
          onClickEditCuePoint={onClickEditCuePoint}
          duration={duration}
        />
      </div>

      {showEditModal && selectedCuePoint && (
        <EditCuePointModal
          onClickCancel={onClickCancel}
          onClickSave={onClickSave}
          cuePoint={selectedCuePoint}
          status={status}
        />
      )}
    </>
  );
}

export { SAICuepoints };

const FieldsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  align-items: flex-end;
  label {
    font-size: 1.4rem;
  }
`;

const Inputs = styled.div`
  display: flex;
  align-items: flex-end;
`;

const AdCount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  span {
    font-size: 5.6rem;
    margin: -20px -5px;
  }
`;

const CuePointInputContainer = styled(InputContainer)`
  font-size: 1.4rem;
`;
