import CloseIcon from 'client/shared/Icon/components/XIcon';
import { FieldInput } from 'components/FieldInput';
import { css } from 'emotion';
import { PollFormData } from 'modules/AnchorAPI/v3/episodes/fetchInteractivityPoll';
import React from 'react';
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from 'react-hook-form';
import {
  AddOptionButton,
  OptionsContainer,
  OptionsInputsGridContainer,
  PlusIcon,
  RemoveOptionButton,
  StyledFieldLabel,
} from '../InteractivePoll/styles';

export function OptionsFieldArray({
  control,
  register,
  errors,
}: {
  control: Control<PollFormData>;
  register: UseFormRegister<PollFormData>;
  errors?: FieldErrors;
}) {
  const { fields, append, remove } = useFieldArray<PollFormData>({
    name: 'options',
    control,
  });

  return (
    <OptionsContainer>
      <StyledFieldLabel htmlFor="options">Poll choices</StyledFieldLabel>
      <p>
        You{"'"}ll need at least 2 choices and a maximum of 7 to publish a poll.
      </p>
      <OptionsInputsGridContainer>
        <div>
          {fields.map((option, i) => {
            const error = errors?.options && errors.options[i]?.description;
            return (
              <div
                key={`${option.id}`}
                className={css`
                  margin-bottom: 1.6rem;
                  width: 100%;
                `}
              >
                <FieldInput
                  error={error}
                  type="text"
                  placeholder={`option #${i + 1}`}
                  {...register(`options.${i}.description`, {
                    required: 'Required',
                  })}
                />
              </div>
            );
          })}
        </div>
        <div>
          {fields.map((option, index: number) => {
            const error = errors?.options && errors.options[index]?.description;
            return (
              <div
                key={`close-${option.id}`}
                className={
                  error?.message &&
                  css`
                    // aligns the RemoveOptionButton with the FieldInput when an error message appears
                    margin-bottom: 38px;
                  `
                }
              >
                <RemoveOptionButton
                  onClick={() => remove(index)}
                  type="button"
                  ariaLabel={
                    option.description
                      ? `Remove "${option.description}" option`
                      : 'Remove option row'
                  }
                  isDisabled={fields.length <= 2}
                >
                  <CloseIcon
                    fillColor={fields.length > 2 ? '#C9CBCD' : '#F2F2F3'}
                    strokeWidth={1}
                    className={css`
                      width: 12px;
                      margin-left: 6px;
                    `}
                  />
                </RemoveOptionButton>
              </div>
            );
          })}
        </div>
      </OptionsInputsGridContainer>
      {fields.length < 7 && (
        <AddOptionButton
          onClick={() => append({ description: '' })}
          type="button"
        >
          <PlusIcon /> Add option
        </AddOptionButton>
      )}
    </OptionsContainer>
  );
}
