import { TextInput } from '@coursera/coursera-ui';
import type { TextInputProps } from '@coursera/coursera-ui';
import type { FieldRenderProps } from 'react-final-form';
import React from 'react';

import 'css!./__styles__/fields';

export type Props = FieldRenderProps<string | number | null | undefined> & Partial<TextInputProps>;

export const TextInputAdapter = (props: Props) => {
  const {
    input,
    meta: { error, submitting, touched },
    disabled = false,
    ...passThroughProps
  } = props as Props;

  return (
    <TextInput
      {...passThroughProps}
      {...input}
      componentId={passThroughProps.componentId || input.name}
      disabled={disabled || submitting}
      error={touched && error}
      // TextInput wants only strings.
      value={input.value ? input.value + '' : ''}
    />
  );
};

export default TextInputAdapter;
