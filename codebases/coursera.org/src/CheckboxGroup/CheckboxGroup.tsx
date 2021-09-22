/** @jsx jsx */

import React from 'react';

import { FormGroup as MuiFormGroup } from '@material-ui/core';

import { jsx } from '@emotion/react';

import { default as Checkbox, CheckboxProps } from '@core/Checkbox';
import {
  FormControl,
  BaseFormControlProps,
  formControlClasses,
} from '@core/forms/FormControl';
import { FormLabel } from '@core/forms/FormLabel';
import { FormStatusText } from '@core/forms/FormStatusText';
import { FormSupportText } from '@core/forms/FormSupportText';
import { FormValidationLabel } from '@core/forms/FormValidationLabel';
import { useControlled, useValidationAriaLabel } from '@core/utils';
import VisuallyHidden from '@core/VisuallyHidden';

import type { CheckboxGroupValue } from './CheckboxGroupContext';
import { CheckboxGroupProvider } from './CheckboxGroupContext';

export type Props = {
  /**
   * Label for the checkbox group.
   */
  label: string;
  /**
   * List of checkbox components for the checkbox group.
   */
  children: Array<React.ReactElement<CheckboxProps, typeof Checkbox>>;
  /**
   * Status description for the checkbox group.
   */
  statusText?: string;
  /**
   * Selected checkbox values. Use when the component is controlled.
   */
  value?: CheckboxGroupValue;
  /**
   * Validation label for the checkbox group.
   */
  validationLabel?: string;
  /**
   * The default input element values. Use when the component is not controlled.
   */
  defaultValue?: CheckboxGroupValue;
  /**
   * Callback fired when a checkbox selection is changed.
   */
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
} & Omit<BaseFormControlProps, 'disabled' | 'fullWidth'>;

/**
 * CheckboxGroup is a wrapper component used to group Checkbox components
 * that provides an easier API, and proper keyboard accessibility to the group
 *
 * See [Props](__storybookUrl__/inputs-checkbox--default#props)
 */
const CheckboxGroup = (props: Props, ref: React.Ref<HTMLDivElement>) => {
  const {
    id,
    className,
    label,
    children,
    defaultValue,
    supportText,
    statusText,
    validationStatus,
    validationLabel,
    onChange,
    optional,
    ...rest
  } = props;

  const [value, setValue] = useControlled<CheckboxGroupValue>({
    default: defaultValue || [],
    controlled: props.value,
    name: 'CheckboxGroup',
    state: 'value',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    const isChecked = event.target.checked;

    let nextValue;

    if (isChecked) {
      nextValue = [...value, selectedValue];
    } else {
      nextValue = value.filter((item) => item !== selectedValue);
    }

    setValue(nextValue);
    onChange?.(event, isChecked);
  };

  const ariaValidationLabel = useValidationAriaLabel(
    validationLabel,
    validationStatus
  );

  return (
    <FormControl
      ref={ref}
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

      {statusText && (
        <FormStatusText
          className={formControlClasses.formStatusText}
          role="status"
        >
          {statusText}
        </FormStatusText>
      )}

      {validationStatus && validationLabel && (
        <FormValidationLabel
          aria-hidden
          className={formControlClasses.formValidationLabel}
          label={validationLabel}
        />
      )}

      <MuiFormGroup>
        <CheckboxGroupProvider
          value={{
            value,
            onChange: handleChange,
          }}
        >
          {children}
        </CheckboxGroupProvider>
      </MuiFormGroup>
    </FormControl>
  );
};

export default React.forwardRef(CheckboxGroup);
