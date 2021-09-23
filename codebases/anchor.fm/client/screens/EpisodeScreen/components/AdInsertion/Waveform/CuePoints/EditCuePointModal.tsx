import React, { useState } from 'react';
import styled from '@emotion/styled';
import { css } from 'emotion';
import { Modal } from '../../../Modal';
import { TimestampInput } from '../../../CuePoints/TimestampInput';
import { SavedCuePoint } from '../../../CuePoints/types';
import { FieldSelect } from '../../../../../../components/Field';
import { PlacementType } from '../../../../../../modules/AnchorAPI/v3/episodes/saveAdCuePoints';
import { convertTimestampToMs } from '../../../CuePoints/utils';
import { STATUS } from '../../../CuePoints/constants';

type EditCuePointModalProps = {
  onClickCancel: () => void;
  onClickSave: (cuePoint: SavedCuePoint) => void;
  cuePoint: SavedCuePoint;
  status: STATUS;
};

export function EditCuePointModal({
  onClickCancel,
  onClickSave,
  cuePoint,
  status,
}: EditCuePointModalProps) {
  const [cuePointEdit, setCuePointEdit] = useState({ ...cuePoint });
  return (
    <Modal
      handleClose={onClickCancel}
      primaryButton={{
        isDisabled: status === STATUS.IS_SAVING,
        copy: status === STATUS.IS_SAVING ? 'Saving...' : 'Save changes',
        onClick: () => {
          onClickSave(cuePointEdit);
        },
      }}
      secondaryButton={{
        copy: 'Cancel',
        onClick: onClickCancel,
      }}
      backdropClassName={css`
        z-index: 1050; // we're stacking modals on top of modals :X
      `}
    >
      <h2
        className={css`
          font-weight: bold;
          margin-bottom: 20px;
          margin-top: 0;
        `}
      >
        Edit ad slot
      </h2>
      <InputContainer>
        <label htmlFor="cue-points-timestamp">Timestamp</label>
        <TimestampInput
          initialValue={cuePointEdit.startTimeString}
          name="cue-points-timestamp"
          ariaDescribedBy="cue-points-timestamp-description"
          onChange={(value: string) => {
            setCuePointEdit({
              ...cuePointEdit,
              startTimeString: value,
              startTime: convertTimestampToMs(value),
            });
          }}
        />
      </InputContainer>
      <InputContainer>
        <label htmlFor="cue-points-count">Count</label>
        <FieldSelect
          id="cue-points-count"
          name="cue-points-count"
          aria-describedby="cue-points-count-description"
          options={[
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
            { label: '5', value: '5' },
          ]}
          value={cuePointEdit.adCount.toString()}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const {
              target: { value },
            } = e;
            setCuePointEdit({
              ...cuePointEdit,
              adCount: parseInt(value, 10),
            });
          }}
        />
      </InputContainer>
      <InputContainer>
        <label htmlFor="cue-points-ad-type">Ad Type</label>
        <FieldSelect
          id="cue-points-ad-type"
          name="cue-points-ad-type"
          aria-describedby="cue-points-ad-type-description"
          value={cuePointEdit.placementType.toString()}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setCuePointEdit({
              ...cuePointEdit,
              placementType: e.target.value as PlacementType,
            });
          }}
          options={[
            { label: 'Pre-Roll', value: 'preRoll' },
            { label: 'Mid-Roll', value: 'midRoll' },
            { label: 'Post-Roll', value: 'postRoll' },
          ]}
        />
      </InputContainer>
    </Modal>
  );
}

const InputContainer = styled.div`
  font-size: 1.4rem;
  margin-bottom: 20px;

  &:last-of-type {
    margin-bottom: 0;
  }

  label {
    font-size: 1.4rem;
    font-weight: normal;
  }
`;
