/** @jsx jsx */

import React from 'react';

import { FormControl as MuiFormControl } from '@material-ui/core';

import { jsx } from '@emotion/react';

import { useTheme } from '@core/theme';
import { OverrideProps } from '@core/types';
import { useId } from '@core/utils';

import { FormControlContext } from './FormControlContext';
import getFormControlCss, { classes } from './getFormControlCss';
import { ValidationStatus } from './types';

export type BaseFormControlProps = {
  /**
   * Unique `id` attribute for the input element.
   */
  id?: string;

  /**
   * Defines addition classes that will be added to the root element
   */
  className?: string;

  /**
   * Defines if field is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Defines if field should take full width of its container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Defines support text for the field.
   * Field refers to it with `aria-describedby`
   */
  supportText?: React.ReactNode;

  /**
   * Defines field as optional.
   * All fields are mandatory by default
   * @default false
   */
  optional?: boolean;

  /**
   * Defines field success/error styling.
   */
  validationStatus?: ValidationStatus;

  /**
   * Invert the color scheme. Use when displaying over dark backgrounds
   * @default false
   */
  invert?: boolean;
};

export interface FormControlTypeMap<D extends React.ElementType = 'div'> {
  props: BaseFormControlProps;
  defaultComponent: D;
}

export type Props<
  D extends React.ElementType = FormControlTypeMap['defaultComponent']
> = OverrideProps<FormControlTypeMap<D>, D> & { component?: React.ElementType };

export type FormControlProps = {
  children?: React.ReactNode;
} & Props;

const FormControl = (
  props: FormControlProps,
  ref: React.Ref<HTMLDivElement>
): React.ReactElement<FormControlProps> => {
  const {
    id: idFromProps,
    children,
    invert,
    disabled,
    fullWidth,
    optional,
    supportText,
    validationStatus,
    ...rest
  } = props;

  const theme = useTheme();
  const id = useId(idFromProps);
  const css = getFormControlCss(theme);

  const isValidated = validationStatus !== undefined;
  const supportTextId = supportText ? `${id}-support-text` : undefined;
  const inputLabelId = `${id}-label`;
  const validationLabelId = isValidated ? `${id}-validation-label` : undefined;

  const formControlContext = {
    id,
    validationStatus,
    invert,
    labelId: inputLabelId,
    validationLabelId: validationLabelId,
    supportTextId: supportTextId,
    ariaDescribedBy: isValidated
      ? [validationLabelId, supportTextId].filter(Boolean).join(' ')
      : supportTextId,
  };

  return (
    <FormControlContext.Provider value={formControlContext}>
      <MuiFormControl
        ref={ref}
        classes={{ root: classes.root }}
        css={css}
        disabled={disabled}
        error={validationStatus === 'error'}
        fullWidth={fullWidth}
        required={!optional}
        variant="standard"
        {...rest}
      >
        {children}
      </MuiFormControl>
    </FormControlContext.Provider>
  );
};

/**
 * FormControl
 * Wraps input components (Input, Select, etc).
 */
export default React.forwardRef(FormControl);
