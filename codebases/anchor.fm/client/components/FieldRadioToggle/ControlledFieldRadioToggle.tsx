import React from 'react';
import { FieldController } from 'client/shared/FieldController';
import { FieldRadioToggle } from '.';
import {
  ControlledFieldRadioToggleProps,
  FieldRadioToggleProps,
} from './types';

export const ControlledFieldRadioToggle = (
  props: ControlledFieldRadioToggleProps
) => (
  <FieldController<FieldRadioToggleProps, HTMLInputElement>
    as={FieldRadioToggle}
    {...props}
  />
);
