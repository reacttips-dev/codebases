/** @jsx jsx */

import React from 'react';

import { jsx } from '@emotion/react';

import { useCheckboxGroupContext } from '@core/CheckboxGroup/CheckboxGroupContext';
import { FormControl } from '@core/forms';
import { CheckboxInput } from '@core/forms/CheckboxInput';
import { ValidationStatus } from '@core/forms/FormControl';
import getRadioAndCheckboxCss, {
  classes,
} from '@core/forms/getRadioAndCheckboxCss';
import { useTheme } from '@core/theme';
import Typography from '@core/Typography';
import { useId } from '@core/utils';

export type Props = {
  /**
   * The element's unique identifier.
   * @ignore
   */
  id?: string;
  /**
   * CSS class applied to the root element
   */
  className?: string;
  /**
   * State of the component. When used as a controlled component, this prop controls whether the component appears as checked.
   */
  checked?: boolean;
  /**
   * If true, the checkbox will be disabled.
   */
  disabled?: boolean;
  /**
   * Primary label displayed next to the checkbox
   */
  label: string;
  /**
   * Defines support text for the field.
   */
  supportText?: React.ReactNode;
  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /**
   * Sets the `name` attribute of the `input` element
   */
  name?: string;
  /**
   * Sets the `required` attribute on the `input` element
   * @default false
   */
  required?: boolean;
  /**
   * Sets the `tabIndex` attribute on the `input` element
   */
  tabIndex?: number;
  /**
   * The value of the component. The DOM API casts this to a string.
   */
  value?: React.ReactText;
  /**
   * Ref that points to the `input` element node
   */
  ref?: React.Ref<HTMLInputElement>;
  /**
   * Defines field success/error styling.
   */
  validationStatus?: ValidationStatus;
  /**
   * Design variant. Currently just "standalone."
   * @default standalone
   */
  variant?: 'standalone';
  /**
   * Callback fired when the state is changed.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (string).
   * You can pull out the new checked state by accessing `event.target.checked` (boolean).
   */
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
};

/**
 * Checkboxes allow the user to select one or more items from a set
 *
 * See [Props](__storybookUrl__/inputs-checkbox--default#props)
 */
const Checkbox = (props: Props): React.ReactElement<Props> => {
  const {
    id: idFromProps,
    className,
    supportText,
    inputProps,
    label,
    ref,
    name,
    disabled,
    value,
    onChange,
    required,
    validationStatus,
    ...rest
  } = props;

  const theme = useTheme();
  const context = useCheckboxGroupContext();
  let checked = props.checked;

  if (value && context?.value) {
    checked = context.value.includes(value);
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    context?.onChange?.(event, checked);
    onChange?.(event, checked);
  };

  const css = getRadioAndCheckboxCss(theme, {
    disabled,
    checked,
    validationStatus,
  });

  const id = useId(idFromProps);
  const labelId = `${id}-label`;
  const supportTextId = supportText ? `${id}-support` : undefined;

  return (
    <FormControl className={className} css={css} id={id} {...rest}>
      <label className={classes.label} id={labelId}>
        <CheckboxInput
          checked={checked}
          className={classes.input}
          disabled={disabled}
          focusVisibleClassName={classes.focusVisible}
          inputProps={{
            ...inputProps,
            'aria-labelledby': supportText
              ? `${labelId} ${supportTextId}`
              : labelId,
          }}
          inputRef={ref}
          name={name}
          required={required}
          value={value}
          onChange={handleChange}
        />

        <Typography
          aria-label={supportText ? `${label}:` : label}
          className={classes.labelText}
          color="inherit"
          variant="body1"
        >
          {label}
        </Typography>
      </label>

      {supportText && (
        <Typography
          className={classes.supportText}
          id={supportTextId}
          variant="body2"
        >
          {supportText}
        </Typography>
      )}
    </FormControl>
  );
};

export default Checkbox;
