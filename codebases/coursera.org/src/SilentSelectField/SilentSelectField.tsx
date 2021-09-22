/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import { FormLabel } from '@core/forms/FormLabel';
import {
  Select,
  SelectProps,
  SelectOption,
  SelectOptionProps,
} from '@core/forms/Select';
import { useTheme } from '@core/theme';
import { useId } from '@core/utils';

import getSilentSelectFieldCss, { classes } from './getSilentSelectFieldCss';
import SelectedValue from './SelectedValue';

export type SilentSelectFieldProps = {
  /**
   * Defines label. To hide label, use `labelPlacement`.
   */
  label: string;

  /**
   * Defines label placement. If `none`, label is hidden.
   * @default integrated
   */
  labelPlacement?: 'integrated' | 'stacked' | 'none';

  /**
   * Defines placeholder
   */
  placeholder?: string;
} & Pick<
  SelectProps,
  | 'onChange'
  | 'onClose'
  | 'onOpen'
  | 'className'
  | 'id'
  | 'inputProps'
  | 'name'
  | 'defaultValue'
  | 'value'
  | 'open'
  | 'children'
  | 'autoFocus'
>;

/**
 * Memoize SelectedValue to avoid any additional re-renders
 */
const MemoizedSelectedValue = React.memo(SelectedValue);

/**
 * SilentSelectField takes the place of SelectField when padding or screen real estate is limited.
 * Use primarily for sorting or filtering.
 *
 * See [Props](__storybookUrl__/inputs-silentselectfield--default#props)
 */
const SilentSelectField = React.forwardRef(function SilentSelectField(
  props: SilentSelectFieldProps,
  ref: React.Ref<HTMLButtonElement>
): React.ReactElement {
  const {
    label,
    labelPlacement,
    placeholder,
    children,
    id,
    ...selectProps
  } = props;

  const theme = useTheme();
  const selectCss = getSilentSelectFieldCss(theme);

  const controlId = useId(id);
  const placeholderId = `${controlId}-value`;
  const labelId = `${controlId}-label`;
  const stackedLabelId = `${controlId}-stackedLabel`;

  const hideLabel = labelPlacement === 'none';
  const isStackedLabel = labelPlacement === 'stacked';

  const optionsMap = React.useMemo(() => {
    const childrenArr = React.Children.toArray(children);
    return childrenArr.reduce<Record<React.ReactText, React.ReactNode>>(
      (acc, option) => {
        if (!React.isValidElement(option)) return acc;

        const { value, children }: SelectOptionProps = option.props;

        acc[value] = children;

        return acc;
      },
      {}
    );
  }, [children]);

  const placeholderComponent = (
    <SelectOption key="placeholder" disabled hidden value="">
      <span>{placeholder}</span>
    </SelectOption>
  );

  const renderValue = (value: unknown) => {
    return (
      <MemoizedSelectedValue
        hideLabel={hideLabel || isStackedLabel}
        label={label}
        labelId={labelId}
        placeholder={placeholder}
        placeholderId={placeholderId}
        value={optionsMap[value as string]}
      />
    );
  };

  return (
    <div css={selectCss}>
      {!hideLabel && isStackedLabel && (
        <FormLabel
          className={classes.stackedLabel}
          htmlFor={controlId}
          id={stackedLabelId}
        >
          {label}
        </FormLabel>
      )}

      <Select
        ref={ref}
        displayEmpty
        className={classes.input}
        id={controlId}
        label={label}
        renderValue={renderValue}
        {...selectProps}
        SelectDisplayProps={{
          'aria-labelledby': !hideLabel
            ? `${labelId} ${placeholderId}`
            : undefined,
          'aria-label': hideLabel ? label : undefined,
        }}
      >
        {Array.isArray(children) && placeholder
          ? [placeholderComponent, ...children]
          : children}
      </Select>
    </div>
  );
});

SilentSelectField.defaultProps = {
  labelPlacement: 'integrated',
};

export default SilentSelectField;
