import React from 'react';
import { FieldInput } from 'components/Field';
import {
  ControlledFieldInputProps,
  FieldInputProps,
} from 'components/FieldInput/types';
import { FieldController } from 'client/shared/FieldController';

export const ControlledFieldInput = (props: ControlledFieldInputProps) => (
  <FieldController<FieldInputProps, HTMLInputElement>
    as={FieldInput}
    {...props}
  />
);
