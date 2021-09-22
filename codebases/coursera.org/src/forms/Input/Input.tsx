/** @jsx jsx */
import React from 'react';

import {
  InputBaseComponentProps,
  OutlinedInput as MuiInput,
} from '@material-ui/core';

import { jsx } from '@emotion/react';

import clsx from 'clsx';

import { useFormControlContext } from '@core/forms/FormControl/FormControlContext';
import { useTheme } from '@core/theme';
import { useDeprecatedProp } from '@core/utils';

import getInputCss, { classes as inputClasses } from './getInputCss';

export type InputProps = {
  /**
   * This prop helps users to fill forms faster, especially on mobile devices.
   * Learn more by reading the [spec](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill).
   * @default off
   */
  autoComplete?: string;

  /**
   * Defines if field should be focused during first mount.
   * @default false
   */
  autoFocus?: boolean;
  /**
   * Defines default value for the field. Use when the component is not controlled.
   */
  defaultValue?: unknown;
  /**
   * Defines if field is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Defines suffix for the field. Can be icon, text etc.
   */
  suffix?: React.ReactNode;

  /**
   * Defines if field should indicate an error state.
   */
  error?: boolean;

  /**
   * Defines if field should take full width of its container.
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Defines unique `id` attribute of the input element. User to generate some `aria` attributes.
   */
  id?: string;

  /**
   * The component used for the `input` element.
   * Either a string to use a HTML element or a component.
   */
  inputComponent?: React.ElementType<InputBaseComponentProps>;

  /**
   * Defines additional input element props
   * Use it to set `step` for number input type
   */
  inputProps?: InputBaseComponentProps;

  /**
   * Defines ref passed to the `input` element.
   */
  inputRef?: React.Ref<unknown>;

  /**
   * Defines whether field should be multiline field. Will be rendered as `textarea` element
   * @default false
   */
  multiline?: boolean;
  /**
   * Defines name attribute of the input element.
   */
  name?: string;
  /**
   * Callback fired when the input is blurred.
   *
   * Notice that the first argument (event) might be undefined.
   */
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  /**
   * Callback fired when the value is changed.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (string).
   */
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
  onKeyUp?: React.KeyboardEventHandler<HTMLTextAreaElement | HTMLInputElement>;

  /**
   * Defines placeholder text for the input element.
   */
  placeholder?: string;

  /**
   * Defines whether a user can change field value
   * input element can be still focussed and value can be copied
   */
  readOnly?: boolean;

  /**
   * Defines field as required.
   * All fields are mandatory by default
   * @default false
   */
  required?: boolean;

  /**
   * Defines a number of rows. Works only when `multiline` is set to `true`
   */
  rows?: string | number;

  /**
   * @deprecated Use maxRows instead, the prop was renamed.
   */
  rowsMax?: string | number;

  /**
   * @deprecated Use minRows instead, the prop was renamed.
   */
  rowsMin?: string | number;

  /**
   * Defines maximum number of rows to display when multiline option is set to true
   */
  maxRows?: string | number;

  /**
   * Defines minimum number of rows to display when multiline option is set to true.
   */
  minRows?: string | number;

  /**
   * Defines prefix for the field. Can be icon, text etc.
   */
  prefix?: React.ReactNode;

  /**
   * Defines HTML5 input attribute
   * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types
   * @default `text`
   */
  type?: string;

  /**
   * Defines value of the field. Required for a controlled component
   */
  value?: unknown;

  /**
   * Defines  additional classes for root element
   */
  className?: string;

  /**
   * Defines classes object to allow add classes for elements/states (`root`, `focused`, `notchedOutline`) inside component
   */
  classes?: Partial<Record<'root' | 'focused' | 'notchedOutline', string>>;

  /**
   * Defines whether to hide outline
   * @default false
   */
  hideOutline?: boolean;
};

/**
 * Main styled Input component, can be reused for Select component
 * @param {InputProps} props
 * @ignore Private Component
 */
const Input = (props: InputProps, ref: React.Ref<HTMLInputElement>) => {
  const { root, notchedOutline, focused, ...restClasses } = inputClasses;

  const theme = useTheme();
  const css = getInputCss(theme, props);

  const {
    classes,
    prefix,
    suffix,
    // Used for computing css
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hideOutline,
    className,
    maxRows,
    minRows,
    rowsMax,
    rowsMin,
    ...restProps
  } = props;

  const {
    id,
    validationStatus,
    invert,
    ariaDescribedBy,
  } = useFormControlContext();

  const computedMaxRows = useDeprecatedProp<typeof maxRows>(
    maxRows,
    rowsMax,
    'rowsMax is deprecated. Use maxRows instead, the prop was renamed.'
  );

  const computedMinRows = useDeprecatedProp<typeof minRows>(
    minRows,
    rowsMin,
    'rowsMin is deprecated. Use minRows instead, the prop was renamed.'
  );

  return (
    <MuiInput
      ref={ref}
      aria-describedby={ariaDescribedBy}
      className={clsx(
        {
          [restClasses.valid]: validationStatus === 'success',
          [restClasses.invalid]: validationStatus === 'error',
          [restClasses.onDark]: invert,
          [restClasses.onLight]: !invert,
        },
        className
      )}
      classes={{
        root: clsx(root, classes?.root),
        notchedOutline: clsx(notchedOutline, classes?.notchedOutline),
        focused: clsx(focused, classes?.focused),
        error: restClasses.error,
        input: restClasses.input,
        multiline: restClasses.multiline,
        adornedStart: restClasses.adornedStart,
        adornedEnd: restClasses.adornedEnd,
      }}
      css={css}
      endAdornment={suffix}
      id={id}
      maxRows={computedMaxRows}
      minRows={computedMinRows}
      startAdornment={prefix}
      {...restProps}
      notched={false}
    />
  );
};

export default React.forwardRef(Input);
