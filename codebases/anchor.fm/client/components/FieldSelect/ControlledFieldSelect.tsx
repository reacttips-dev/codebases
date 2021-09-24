import React from 'react';
import { FieldController } from 'client/shared/FieldController';
import { FieldSelect } from '.';
import { FieldSelectProps, ControlledFieldSelectProps } from './types';

export const ControlledFieldSelect = (props: ControlledFieldSelectProps) => (
  <FieldController<FieldSelectProps, HTMLSelectElement>
    as={FieldSelect}
    {...props}
  />
);
