/** @jsx jsx */
import React from 'react';

import { RadioGroup as MuiRadioGroup } from '@material-ui/core';

import { jsx } from '@emotion/react';

import {
  FormControl,
  formControlClasses,
  BaseFormControlProps,
} from '@core/forms/FormControl';
import { FormLabel } from '@core/forms/FormLabel';
import { FormSupportText } from '@core/forms/FormSupportText';
import { FormValidationLabel } from '@core/forms/FormValidationLabel';
import { default as Radio, RadioProps } from '@core/Radio';
import { useValidationAriaLabel } from '@core/utils';
import VisuallyHidden from '@core/VisuallyHidden';

export type Props = {
  /**
   * Label for the radio group.
   */
  label: string;
  /**
   * The content of the component.
   */
  children: Array<React.ReactElement<RadioProps, typeof Radio>>;
  /**
   * The name used to reference the value of the control.
   */
  name?: string;
  /**
   * Value of the selected radio. Use when the component is controlled.
   */
  value?: string;
  /**
   * Validation label for the radio group.
   */
  validationLabel?: string;
  /**
   * The default input element value. Use when the component is not controlled.
   */
  defaultValue?: string;
  /**
   * Callback fired when a radio is selected.
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
} & Omit<BaseFormControlProps, 'disabled' | 'fullWidth'>;

/**
 * RadioGroup is a wrapper component used to group Radio components
 * that provides an easier API, and proper keyboard accessibility to the group
 *
 * See [Props](__storybookUrl__/inputs-radio--default#props)
 */
const RadioGroup = (props: Props, ref: React.Ref<HTMLDivElement>) => {
  const {
    id,
    className,
    label,
    children,
    name,
    value,
    defaultValue,
    supportText,
    validationStatus,
    validationLabel,
    onChange,
    optional,
    ...rest
  } = props;

  const ariaValidationLabel = useValidationAriaLabel(
    validationLabel,
    validationStatus
  );

  return (
    <FormControl
      className={className}
      component="fieldset"
      id={id}
      optional={optional}
      supportText={supportText}
      validationStatus={validationStatus}
      {...rest}
    >
      <FormLabel
        includeRequiredIndicatorWithLabel
        className={formControlClasses.formLabel}
        component="legend"
      >
        {label}

        {supportText && (
          <VisuallyHidden data-testid="vh-supportText">
            {supportText}
          </VisuallyHidden>
        )}

        {validationStatus && validationLabel && (
          <VisuallyHidden data-testid="vh-validationLabel">
            {ariaValidationLabel}
          </VisuallyHidden>
        )}
      </FormLabel>

      {supportText && (
        <FormSupportText
          aria-hidden
          className={formControlClasses.formSupportText}
        >
          {supportText}
        </FormSupportText>
      )}

      {validationStatus && validationLabel && (
        <FormValidationLabel
          aria-hidden
          className={formControlClasses.formValidationLabel}
          label={validationLabel}
        />
      )}

      <MuiRadioGroup
        ref={ref}
        defaultValue={defaultValue}
        name={name}
        value={value}
        onChange={onChange}
      >
        {children}
      </MuiRadioGroup>
    </FormControl>
  );
};

export default React.forwardRef(RadioGroup);
