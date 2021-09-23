import { FieldInput } from 'components/Field';
import { FieldInputWithReduxProps } from 'components/FieldInput/types';
import React from 'react';

export const FieldInputWithRedux = ({
  meta: { error, valid, submitFailed },
  input,
  isDisabled,
  ...props
}: FieldInputWithReduxProps) => (
  <FieldInput
    {...props}
    {...input}
    isShowingError={submitFailed && !valid}
    error={error ? { message: error } : undefined}
    disabled={isDisabled}
  />
);
