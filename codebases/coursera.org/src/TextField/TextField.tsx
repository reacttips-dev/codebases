/** @jsx jsx */
/** @jsxFrag React.Fragment */
import React from 'react';

import { jsx } from '@emotion/react';

import clsx from 'clsx';

import { FormControl, BaseFormControlProps } from '@core/forms/FormControl';
import { FormLabel } from '@core/forms/FormLabel';
import { FormSupportText } from '@core/forms/FormSupportText';
import { FormValidationLabel } from '@core/forms/FormValidationLabel';
import { Input, InputProps } from '@core/forms/Input';
import { InputAdornment } from '@core/forms/InputAdornment';
import ErrorIcon from '@core/icons/signs/ErrorIcon';
import SuccessOutlineIcon from '@core/icons/signs/SuccessOutlineIcon';
import { useTheme } from '@core/theme';

import getTextFieldCss, { classes } from './getTextFieldCss';

export type TextFieldProps = {
  /**
   * The label content.
   */
  label: string;

  /**
   * Defines default value for the field. Use when the component is not controlled.
   */
  defaultValue?: string;

  /**
   * Defines value of the field. Required for a controlled component.
   */
  value?: string;

  /**
   * Defines addition classes that will be adde to the root element.
   */
  className?: string;

  /**
   * Defines max characters and appropriately adjusts the width of the input.
   *
   * **Note:**
   *
   * - It does not adjust the width of the input when `fullWidth` is set.
   * - It will never set the input width greater than its parent element.
   */
  maxLength?: number;

  /**
   * Defines HTML5 input attribute.
   * @default text
   */
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url';

  /**
   * Defines ref passed to the `input` element.
   */
  inputRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement | null>;
  /**
   * Label to describe validation state of the TextField.
   */
  validationLabel?: string;
} & BaseFormControlProps &
  Pick<
    InputProps,
    | 'onBlur'
    | 'onFocus'
    | 'onChange'
    | 'rows'
    | 'rowsMax'
    | 'maxRows'
    | 'prefix'
    | 'suffix'
    | 'inputProps'
    | 'placeholder'
    | 'value'
    | 'name'
    | 'placeholder'
    | 'autoFocus'
    | 'autoComplete'
    | 'multiline'
    | 'className'
  >;

/**
 * TextField allows users to input data
 *
 * See [Props](__storybookUrl__/inputs-textfield--props)
 */
const TextField = React.forwardRef(function TextField(
  props: TextFieldProps,
  ref: React.Ref<HTMLDivElement>
): React.ReactElement<TextFieldProps> {
  const {
    id,
    supportText,
    label,
    suffix,
    prefix,
    className,
    disabled,
    fullWidth,
    optional,
    validationStatus,
    multiline,
    validationLabel,
    inputProps,
    maxLength,
    invert,
    ...inputComponentProps
  } = props;

  const theme = useTheme();

  const css = getTextFieldCss(theme);
  const isValid = validationStatus === 'success';
  const isInvalid = validationStatus === 'error';

  // Determines Adornment alignment based on multiline prop
  const endAdornmentAlignment = multiline ? 'top' : undefined;

  let endAdornmentElement = suffix && (
    <InputAdornment position="end" variant="filled">
      {suffix}
    </InputAdornment>
  );

  const startAdornmentElement = prefix && (
    <InputAdornment position="start" variant="filled">
      {prefix}
    </InputAdornment>
  );

  if (isInvalid) {
    // Compose suffix with validation icon
    endAdornmentElement = (
      <>
        <InputAdornment
          aria-hidden
          className={classes.validationIcon}
          data-testid="error-suffix"
          position="end"
          validationStatus="error"
          verticallyAligned={endAdornmentAlignment}
        >
          <ErrorIcon size="medium" />
        </InputAdornment>

        {endAdornmentElement}
      </>
    );
  }

  if (isValid) {
    endAdornmentElement = (
      <InputAdornment
        aria-hidden
        className={classes.validationIcon}
        data-testid="success-suffix"
        position="end"
        validationStatus="success"
        verticallyAligned={endAdornmentAlignment}
      >
        <SuccessOutlineIcon size="medium" />
      </InputAdornment>
    );
  }

  return (
    <FormControl
      ref={ref}
      className={clsx(
        {
          [classes.valid]: validationStatus === 'success',
          [classes.invalid]: validationStatus === 'error',
        },
        className
      )}
      css={css}
      disabled={disabled}
      fullWidth={fullWidth}
      id={id}
      invert={invert}
      optional={optional}
      supportText={supportText}
      validationStatus={validationStatus}
    >
      <FormLabel>{label}</FormLabel>

      {supportText && (
        <FormSupportText className={classes.formSupportText}>
          {supportText}
        </FormSupportText>
      )}

      {validationStatus && validationLabel && (
        <FormValidationLabel
          hideIcon
          className={classes.formValidationLabel}
          label={validationLabel}
        />
      )}

      <Input
        {...inputComponentProps}
        classes={{
          root: classes.root,
          focused: classes.focused,
        }}
        fullWidth={fullWidth}
        inputProps={{
          'aria-label': label,
          maxLength,
          ...inputProps,
        }}
        multiline={multiline}
        prefix={startAdornmentElement}
        suffix={endAdornmentElement}
      />
    </FormControl>
  );
});

TextField.defaultProps = {
  multiline: false,
  type: 'text',
};

export default TextField;
