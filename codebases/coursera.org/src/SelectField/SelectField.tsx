/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import { FormControl, BaseFormControlProps } from '@core/forms/FormControl';
import { FormLabel } from '@core/forms/FormLabel';
import { FormSupportText } from '@core/forms/FormSupportText';
import { FormValidationLabel } from '@core/forms/FormValidationLabel';
import { classes as inputClasses } from '@core/forms/Input/getInputCss';
import { Select, SelectProps, SelectOption } from '@core/forms/Select';
import { useTheme } from '@core/theme';
import { useId } from '@core/utils';

import getSelectFieldCss, { classes } from './getSelectFieldCss';

export type Props = {
  /**
   * Defines label for the field.
   */
  label: string;

  /**
   * Defines placeholder.
   */
  placeholder?: string;

  /**
   * Label to describe validation state of the SelectField.
   */
  validationLabel?: string;
} & Pick<
  SelectProps,
  | 'onChange'
  | 'onClose'
  | 'onOpen'
  | 'inputProps'
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'open'
  | 'children'
  | 'autoFocus'
> &
  BaseFormControlProps;

/**
 * Renders select field with label, support text and validation styles/label
 *
 * See [Props](__storybookUrl__/inputs-selectfield--default#props)
 */
const SelectField = React.forwardRef(function SelectField(
  props: Props,
  ref: React.Ref<HTMLDivElement>
): React.ReactElement<Props> {
  const {
    name,
    label,
    children = [],
    placeholder,
    value,
    onChange,
    onClose,
    onOpen,
    invert,
    className,
    disabled,
    fullWidth,
    optional,
    validationStatus,
    validationLabel,
    supportText,
    defaultValue,
    inputProps,
    ...rest
  } = props;

  const theme = useTheme();
  const css = getSelectFieldCss(theme);
  const id = useId(props.id);
  const valueId = `${id}-value`;
  const labelId = `${id}-label`;

  return (
    <FormControl
      ref={ref}
      className={className}
      css={css}
      disabled={disabled}
      fullWidth={fullWidth}
      id={id}
      invert={invert}
      optional={optional}
      supportText={supportText}
      validationStatus={validationStatus}
    >
      <FormLabel includeRequiredIndicatorWithLabel>{label}</FormLabel>

      {supportText && (
        <FormSupportText className={classes.formSupportText}>
          {supportText}
        </FormSupportText>
      )}

      {validationStatus && validationLabel && (
        <FormValidationLabel
          className={classes.formValidationLabel}
          label={validationLabel}
        />
      )}

      <Select
        displayEmpty
        SelectDisplayProps={{
          id: valueId,
          'aria-labelledby': `${labelId} ${valueId}`,
        }}
        className={classes.root}
        defaultValue={defaultValue}
        inputProps={inputProps}
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        onClose={onClose}
        onOpen={onOpen}
        {...rest}
      >
        {Array.isArray(children)
          ? [
              <SelectOption key="placeholder" disabled hidden value="">
                <span className={inputClasses.placeholder}>{placeholder}</span>
              </SelectOption>,
              ...children,
            ]
          : children}
      </Select>
    </FormControl>
  );
});

export default SelectField;
