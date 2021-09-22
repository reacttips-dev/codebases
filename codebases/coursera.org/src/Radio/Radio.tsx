/** @jsx jsx */

import React from 'react';

import { useRadioGroup } from '@material-ui/core/RadioGroup';

import { jsx } from '@emotion/react';

import { FormControl } from '@core/forms';
import { ValidationStatus } from '@core/forms/FormControl';
import getRadioAndCheckboxCss, {
  classes,
} from '@core/forms/getRadioAndCheckboxCss';
import { RadioInput } from '@core/forms/RadioInput';
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
   * CSS classname applied to the root element.
   */
  className?: string;
  /**
   * Label displayed next to the radio
   */
  label: string;
  /**
   * The value of the component.
   */
  value?: string;
  /**
   * Name attribute of the input element.
   */
  name?: string;
  /**
   * Defines support text for the field.
   */
  supportText?: React.ReactNode;
  /**
   * Attributes applied to the input element.
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /**
   * Ref that points to the `input` element node
   */
  ref?: React.Ref<HTMLInputElement>;
  /**
   * Prop that dictates wether the radio appears checked on unchecked.
   */
  checked?: boolean;
  /**
   * Prop that makes the radio disabled when true.
   */
  disabled?: boolean;
  /**
   * Defines field success/error styling.
   */
  validationStatus?: ValidationStatus;
  /**
   * Callback function that executes when the control is clicked.
   * @param {object} event. The even source of the callback.
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Radio allow the user to select one option from a set
 *
 * See [Props](__storybookUrl__/inputs-radio--default#props)
 */
const Radio = (props: Props): React.ReactElement<Props> => {
  const {
    id: idFromProps,
    className,
    label,
    supportText,
    disabled,
    onChange,
    value,
    name,
    ref,
    inputProps,
    validationStatus,
    ...rest
  } = props;

  const theme = useTheme();
  const radioGroup = useRadioGroup();

  let checked = props.checked;

  // Use props if component is not in the RadioGroupContext provided by MUI
  // @link https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/Radio/Radio.js#L75
  if (radioGroup) {
    if (typeof checked === 'undefined') {
      checked = radioGroup.value === props.value;
    }
  }

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
        <RadioInput
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
          value={value}
          onChange={onChange}
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

export default Radio;
