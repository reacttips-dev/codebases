/** @jsx jsx */

import React from 'react';

import { Radio as MuiRadio } from '@material-ui/core';

import { jsx } from '@emotion/react';

import { useFormControlContext } from '@core/forms/FormControl/FormControlContext';
import { useTheme } from '@core/theme';

import getRadioInputCss, { classes } from './getRadioInputCss';
import { default as RadioCheckedIcon } from './RadioCheckedIcon';
import { default as RadioUncheckedIcon } from './RadioUncheckedIcon';

export type Props = {
  /**
   * This prop controls if the radio appears checked or not.
   */
  checked?: boolean;
  /**
   * CSS class applied to the root element
   */
  className?: string;
  /**
   * The id of the `input` element.
   */
  id?: string;
  /**
   * If true, radio will be disabled.
   */
  disabled?: boolean;
  /**
   * Attributes applied to the input element.
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /**
   * Ref that points to the `input` element node
   */
  inputRef?: React.Ref<HTMLInputElement>;
  /**
   * Name attribute of the input element
   */
  name?: string;
  /**
   * Callback function when the state changes
   * @param {object} event - The react event object
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * If true, input element will be required
   */
  required?: boolean;
  /**
   * Value of the component
   */
  value?: string;
  /**
   * Classname for focus visible state
   */
  focusVisibleClassName?: string;
};

const RadioInput = (props: Props): React.ReactElement<Props> => {
  const theme = useTheme();
  const css = getRadioInputCss(theme, props.focusVisibleClassName);
  const { id } = useFormControlContext({ id: props.id });

  return (
    <MuiRadio
      {...props}
      disableRipple
      aria-disabled={undefined} // Need to override this property otherwise VO appends "one more item" to the label. This issue exists in pure MUI radio as well.
      checkedIcon={<RadioCheckedIcon />}
      classes={classes}
      css={css}
      icon={<RadioUncheckedIcon />}
      id={id}
    />
  );
};

export default RadioInput;
