/** @jsx jsx */

/**
 * Private module reserved for @coursera/cds-core package.
 */
import React from 'react';

import { Checkbox as MuiCheckbox } from '@material-ui/core';

import { jsx } from '@emotion/react';

import { useFormControlContext } from '@core/forms/FormControl/FormControlContext';
import { useTheme } from '@core/theme';

import CheckboxCheckedIcon from './CheckboxCheckedIcon';
import CheckboxUncheckedIcon from './CheckboxUncheckedIcon';
import getCheckboxInputCss, { classes } from './getCheckboxInputCss';

export type Props = {
  /**
   * State of the component. When used as a controlled component, this prop controls whether the component appears as checked.
   */
  checked?: boolean;
  /**
   * if true, checkbox will be disabled.
   */
  disabled?: boolean;
  /**
   * CSS class applied to the root element
   */
  className?: string;
  /**
   * The id of the `input` element.
   */
  id?: string;
  /**
   * Ref that points to the `input` element node
   */
  inputRef?: React.Ref<HTMLInputElement>;
  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /**
   * Sets the `name` attribute of the `input` element
   */
  name?: string;
  /**
   * Sets the `readonly` attribute on the `input` element
   */
  readOnly?: boolean;
  /**
   * Sets the `required` attribute on the `input` element
   */
  required?: boolean;
  /**
   * Style applied to the root element
   */
  style?: React.CSSProperties;
  /**
   * Sets the `tabIndex` attribute on the `input` element
   */
  tabIndex?: number;
  /**
   * The value of the component. The DOM API casts this to a string.
   */
  value?: React.ReactText;
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
  /**
   * Classname for focus visible state
   */
  focusVisibleClassName?: string;
};

const CheckboxInput = (props: Props): React.ReactElement<Props> => {
  const theme = useTheme();
  const css = getCheckboxInputCss(theme, props.focusVisibleClassName);
  const { id } = useFormControlContext({ id: props.id });

  return (
    <MuiCheckbox
      {...props}
      disableFocusRipple
      disableRipple
      disableTouchRipple
      aria-disabled={props.disabled}
      checkedIcon={<CheckboxCheckedIcon />}
      classes={classes}
      css={css}
      icon={<CheckboxUncheckedIcon />}
      id={id}
      size="medium"
    />
  );
};

export default CheckboxInput;
