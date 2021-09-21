import { useCreateQuestion } from 'hooks/useInteractivityQnA';
import React from 'react';
import { css } from 'emotion';
import { useForm } from 'react-hook-form';

import { ControlledFieldInput } from 'components/FieldInput';
import {
  ConfirmationButtons,
  ErrorMessage,
  StyledFieldLabel,
} from '../InteractivePoll/styles';
import { SubmitButton } from './SubmitButton';

type FormData = { text: string };

type Props = {
  episodeId: string;
  onSuccess: () => void;
  defaultValues: FormData;
};

export function InteractiveQuestionForm({
  episodeId,
  onSuccess,
  defaultValues,
}: Props) {
  const { createQuestion } = useCreateQuestion();
  const {
    control,
    formState: {
      isSubmitting,
      isDirty,
      errors: { text: error },
    },
    handleSubmit,
  } = useForm<FormData>({ defaultValues });
  const onSubmit = async (formValues: FormData) => {
    const { text } = formValues;
    try {
      await createQuestion({ episodeId, text }, { onSuccess });
    } catch (e) {
      throw new Error(`Could not create question: ${e}`);
    }
  };
  return (
    <form
      className={css`
        padding-top: 28px;
      `}
      onSubmit={e => {
        e.stopPropagation();
        return handleSubmit(onSubmit)(e);
      }}
    >
      <StyledFieldLabel htmlFor="text">
        Ask your listeners a question or post a statement.
      </StyledFieldLabel>
      <ControlledFieldInput
        name="text"
        type="text"
        // @ts-ignore
        control={control}
        rules={{ required: 'Required', maxLength: 140 }}
        showCharacterCount
      />
      <div
        className={css`
          margin-top: 1rem;
        `}
      >
        <ConfirmationButtons>
          <SubmitButton isSubmitting={isSubmitting} pristine={!isDirty} />
        </ConfirmationButtons>
      </div>
      {error && (
        <ErrorMessage>
          Sorry, looks like something went wrong. Try again?
        </ErrorMessage>
      )}
    </form>
  );
}
