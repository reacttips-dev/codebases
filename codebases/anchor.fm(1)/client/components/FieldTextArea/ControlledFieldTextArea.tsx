import React from 'react';
import { FieldController } from 'client/shared/FieldController';
import { FieldTextArea } from '.';
import { ControlledFieldTextAreaProps, FieldTextAreaProps } from './types';

export const ControlledFieldTextArea = (
  props: ControlledFieldTextAreaProps
) => (
  <FieldController<FieldTextAreaProps, HTMLTextAreaElement>
    {...props}
    as={FieldTextArea}
  />
);
