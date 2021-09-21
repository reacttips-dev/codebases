import { FieldInput } from 'components/FieldInput';

import { ControlledFieldRadioToggle } from 'components/FieldRadioToggle';
import { css } from 'emotion';
import { useCreatePoll, useUpdatePoll } from 'hooks/useInteractivityPolls';
import {
  InteractivityPoll,
  POLL_TYPE,
  PollFormData,
} from 'modules/AnchorAPI/v3/episodes/fetchInteractivityPoll';
import React from 'react';
import { DefaultValues, useForm } from 'react-hook-form';
import {
  ConfirmationButtons,
  DatesContainer,
  ErrorMessage,
  PollTypeStyles,
  StyledDatePicker,
  StyledFieldLabel,
} from '../InteractivePoll/styles';
import { OptionsFieldArray } from './OptionsFieldArray';
import { SubmitDraftButton } from './SubmitDraftButton';
import { SubmitPublishButton } from './SubmitPublishButton';
import { getChangedValues } from './utils';

type Props = {
  poll: InteractivityPoll;
  episodeId: string;
  onSuccess: () => void;
};

export function InteractivePollForm({ poll, episodeId, onSuccess }: Props) {
  const { createPoll, status: createStatus } = useCreatePoll();
  const { updatePoll, status: updateStatus } = useUpdatePoll();
  const defaultValues: DefaultValues<PollFormData> = {
    question: poll.question,
    opening_date: poll.opening_date,
    closing_date: poll.closing_date,
    options: poll.options || [{ description: '' }, { description: '' }],
    type: POLL_TYPE[poll.type] || POLL_TYPE.SINGLE_CHOICE,
    entity_timestamp_ms: poll.entity_timestamp_ms || 0,
    name: episodeId,
    published: true,
  };
  const onSubmit = async (formValues: PollFormData) => {
    const { opening_date: openingDate, closing_date: closingDate } = formValues;
    const payload = {
      ...formValues,
      opening_date: openingDate
        ? new Date(openingDate).getTime()
        : new Date().getTime(),
      closing_date: closingDate
        ? new Date(closingDate).getTime()
        : new Date().getTime(),
    };
    try {
      if (!poll.id) {
        await createPoll({ episodeId, poll: payload }, { onSuccess });
      } else {
        const updates = getChangedValues(poll, payload);
        await updatePoll({ episodeId, poll: updates }, { onSuccess });
      }
    } catch (e) {
      throw new Error(`Something happened : ${e}`);
    }
  };
  const { control, register, handleSubmit, formState } = useForm({
    defaultValues,
  });

  const { isSubmitting, isDirty, errors } = formState;

  return (
    <form
      onSubmit={e => {
        e.stopPropagation();
        return handleSubmit(onSubmit)(e);
      }}
    >
      <StyledFieldLabel htmlFor="question">Ask a question</StyledFieldLabel>
      <FieldInput
        type="text"
        id="question"
        {...register('question', { required: 'Required' })}
      />
      <ControlledFieldRadioToggle
        control={control}
        name="type"
        cssProp={PollTypeStyles}
        label="Poll type"
        id="type"
        options={[
          { label: 'Single Choice', value: POLL_TYPE.SINGLE_CHOICE },
          { label: 'Multiple Choice', value: POLL_TYPE.MULTIPLE_CHOICE },
        ]}
      />
      <div
        className={css`
          margin-top: 1rem;
        `}
      >
        <OptionsFieldArray
          errors={errors}
          // @ts-ignore
          control={control}
          // @ts-ignore
          register={register}
        />
        <DatesContainer>
          <StyledDatePicker
            control={control}
            name="opening_date"
            label="Start"
          />
          <StyledDatePicker control={control} name="closing_date" label="End" />
        </DatesContainer>
        <ConfirmationButtons>
          <SubmitDraftButton
            isPublished={poll.published}
            isSubmitting={
              isSubmitting || [updateStatus, createStatus].includes('loading')
            }
            pristine={!isDirty}
            onClick={handleSubmit(async (formValues: PollFormData) => {
              return onSubmit({
                ...formValues,
                published: false,
              });
            })}
          />
          <SubmitPublishButton
            isPublished={poll.published}
            isSubmitting={
              isSubmitting || [updateStatus, createStatus].includes('loading')
            }
            pristine={!isDirty}
          />
        </ConfirmationButtons>
      </div>
      {Object.keys(errors).length > 0 && (
        <ErrorMessage>
          Sorry, looks like something went wrong. Try again?
        </ErrorMessage>
      )}
    </form>
  );
}
