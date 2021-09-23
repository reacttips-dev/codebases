import React from 'react';
import { FieldController } from 'shared/FieldController';
import { FieldToggle } from '.';
import { FieldToggleProps, ControlledFieldToggleProps } from './types';

export const ControlledFieldToggle = (props: ControlledFieldToggleProps) => (
  <FieldController<FieldToggleProps, HTMLInputElement>
    as={FieldToggle}
    {...props}
  />
);
