import React from 'react';

import _ from 'lodash';

import { ValidationStatus } from './types';

type FormControlContextProps = {
  /**
   * Defines main id for (input, select, etc)
   */
  id?: string;

  /**
   * Invert the color scheme. Use when displaying over dark backgrounds
   * @default false
   */
  invert?: boolean;

  /**
   * Defines that is used for the label
   */
  labelId?: string;

  /**
   * Defines validation status
   */
  validationStatus?: ValidationStatus;

  /**
   * Defines id that is used for the validation label
   */
  validationLabelId?: string;

  /**
   * Defines id that is used for support text
   */
  supportTextId?: string;

  /**
   * Defines pre-generated `aria-describedby` label
   */
  ariaDescribedBy?: string;
};

const FormControlContext = React.createContext<FormControlContextProps>({
  invert: false,
});

/**
 * Helper hook to use FormControlContext
 */
const useFormControlContext = (
  componentProps?: FormControlContextProps
): FormControlContextProps => {
  const controlProps = React.useContext(FormControlContext);

  return _.merge(componentProps, controlProps);
};

export { FormControlContext, useFormControlContext, FormControlContextProps };
