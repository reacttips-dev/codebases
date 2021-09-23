import React from 'react';
import { FieldController } from 'client/shared/FieldController';
import { FieldCheckbox } from '.';
import { ControlledFieldCheckboxProps, FieldCheckboxProps } from './types';

export const ControlledFieldCheckbox = (
  props: ControlledFieldCheckboxProps
) => (
  <FieldController<FieldCheckboxProps, HTMLInputElement>
    as={FieldCheckbox}
    {...props}
  />
);
