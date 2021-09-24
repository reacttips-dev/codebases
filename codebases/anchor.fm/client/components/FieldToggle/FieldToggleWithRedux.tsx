import React from 'react';
import { FieldToggle } from '.';
import { FieldToggleWithReduxProps } from './types';

export const FieldToggleWithRedux = ({
  input,
  meta,
  ...props
}: FieldToggleWithReduxProps) => <FieldToggle {...input} {...props} />;
