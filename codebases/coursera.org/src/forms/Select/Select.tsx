/** @jsx jsx */
import React from 'react';

import { Select as MuiSelect, useMediaQuery } from '@material-ui/core';

import { jsx, ClassNames } from '@emotion/react';

import { useFocusRing } from '@react-aria/focus';
import clsx from 'clsx';

import { useFormControlContext } from '@core/forms/FormControl/FormControlContext';
import { Input, InputProps } from '@core/forms/Input';
import { classes as inputClasses } from '@core/forms/Input/getInputCss';
import ChevronDownIcon from '@core/icons/arrows/ChevronDownIcon';
import ChevronUpIcon from '@core/icons/arrows/ChevronUpIcon';
import { useTheme } from '@core/theme';
import { useControlled } from '@core/utils';

import constants from './constants';
import getSelectCss, { classes, getDropdownCss } from './getSelectCss';
import { MobileMenuList } from './MobileMenuList';
import { MobilePopover } from './MobilePopover';
import { SelectOption, SelectOptionProps } from './SelectOption';

export type Props = {
  /**
   * If `true`, the dropdown trigger element will be focused during the first mount.
   */
  autoFocus?: boolean;

  /**
   * The option elements to populate the select with.
   * Can be some `SelectOption` element.
   *
   * ⚠️The `SelectOption` elements **must** be direct descendants.
   */
  children:
    | React.ReactElement<SelectOptionProps, typeof SelectOption>
    | Array<React.ReactElement<SelectOptionProps, typeof SelectOption>>;

  /**
   * Defines classes that can be passed to the Input component
   */
  classes?: Partial<
    Record<'root' | 'focused' | 'notchedOutline' | 'active', string>
  >;

  className?: string;

  /**
   * The default element value. Use when the component is not controlled.
   */
  defaultValue?: Value;

  /**
   * If `true`, a value is displayed even if no items are selected.
   *
   * In order to display a meaningful value, a function should be passed to the `renderValue` prop which returns the value to be displayed when no items are selected.
   */
  displayEmpty?: boolean;

  /**
   * The `id` of the wrapper element.
   */
  id?: string;

  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
   */
  inputProps?: InputProps['inputProps'];

  /**
   * Defines label that is visible in mobile picker.
   */
  label?: string;

  /**
   * The ID of an element that acts as an additional label. The Select will
   * be labelled by the additional label and the selected value.
   */
  labelId?: string;

  /**
   * Defines whether a field allows to pick multiple options, `value` must be an array and the menu will support multiple selections.
   */
  multiple?: boolean;

  /**
   * Defines input element name.
   */
  name?: string;

  /**
   * Defines callback function fired when a menu item is selected.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (any).
   * @param {object} [child] The react element that was selected.
   */
  onChange?: (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => void;

  /**
   * Defines callback fired when the component requests to be closed.
   * Use in controlled mode (see open).
   *
   * @param {object} event The event source of the callback.
   */
  onClose?: (event: React.ChangeEvent<unknown>) => void;

  /**
   * Defines callback fired when the component requests to be opened.
   * Use in controlled mode (see open).
   *
   * @param {object} event The event source of the callback.
   */
  onOpen?: (event: React.ChangeEvent<unknown>) => void;

  /**
   * Defines callback fired when component is focused
   */
  onFocus?: (event: React.FocusEvent<unknown>) => void;

  /**
   * Defines callback fired when component is blurred
   */
  onBlur?: (event: React.FocusEvent<unknown>) => void;

  /**
   * If`true` the component will render in open state
   * @default undefined
   */
  open?: boolean;

  /**
   * Defines render the selected value.
   *
   * @param {any} value The `value` provided to the component.
   * @returns {ReactNode}
   */
  renderValue?: (value: unknown) => React.ReactNode;

  /**
   * Defines props applied to the clickable div element.
   */
  SelectDisplayProps?: React.HTMLAttributes<HTMLDivElement>;

  /**
   * The input value. Providing an empty string will select no options.
   * Set to an empty string `''` if you don't want any of the available options to be selected.
   * @default undefined
   */
  value?: Value;

  /**
   * Defines a number of visible items in the drop down.
   * Is not applicable for mobile drawer.
   */
  visibleItemCount?: number;
};

type Value = string | number | undefined;

/**
 * Known Issues:
 * https://github.com/mui-org/material-ui/issues/23747
 * https://github.com/mui-org/material-ui/issues/23489
 */
const Select = React.forwardRef(function Select(
  props: Props,
  ref: React.Ref<unknown>
) {
  const {
    name,
    SelectDisplayProps,
    onBlur,
    onFocus,
    className,
    ...muiProps
  } = props;

  const [value, setValue] = useControlled<Value>({
    controlled: props.value,
    default: props.defaultValue,
    name: 'Select',
    state: 'value',
  });

  const [open, setOpen] = useControlled<boolean>({
    controlled: props.open,
    default: false,
    name: 'Select',
    state: 'open',
  });

  const { isFocusVisible, focusProps } = useFocusRing();

  const theme = useTheme();
  const selectCss = getSelectCss(theme);
  const dropdownCss = getDropdownCss(theme, props);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const anchorPoint = theme.direction === 'ltr' ? 'left' : 'right';

  const formControl = useFormControlContext();

  /**
   * Handles focus event
   * @param event
   */
  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    // handle focus ring visibility
    focusProps.onFocus?.(event);
    onFocus?.(event);
  };

  /**
   * Handles blur event
   * @param event
   */
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    // remove focus ring
    focusProps.onBlur?.(event);
    onBlur?.(event);
  };

  /**
   * Handles onOpen event
   * @param event
   */
  const handleOpen = (event: React.ChangeEvent<unknown>) => {
    setOpen(true);
    props.onOpen?.(event);
  };

  /**
   * Handles onClose event
   * @param event
   */
  const handleClose = (event: React.ChangeEvent<unknown>) => {
    setOpen(false);
    props.onClose?.(event);
  };

  /**
   * Handles item selection from the drop down or mobile drawer.
   * @param event
   */
  const handleSelection = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    setValue(event.target.value as Value);
    setOpen(false);
    props.onChange?.(event);
  };

  return (
    <React.Fragment>
      <ClassNames>
        {({ css: getClassNames }) => (
          <MuiSelect
            ref={ref}
            css={selectCss}
            {...muiProps}
            IconComponent={(props) => <IconComponent open={open} {...props} />}
            MenuProps={{
              className: getClassNames(dropdownCss),
              autoFocus: isFocusVisible,
              classes: {
                paper: clsx(classes.paper, {
                  [classes.valid]: formControl.validationStatus === 'success',
                  [classes.invalid]: formControl.validationStatus === 'error',
                }),
                list: classes.list,
              },
              PaperProps: {
                style: {
                  maxWidth: constants.DROPDOWN_MAX_WIDTH,
                },
              },
              MenuListProps: {
                style: {
                  width: 'auto',
                },
              },
              getContentAnchorEl: null,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: anchorPoint,
              },
              elevation: 0,
              transitionDuration: 0,
              transformOrigin: {
                vertical: 'top',
                horizontal: anchorPoint,
              },
            }}
            SelectDisplayProps={{
              'aria-describedby': formControl.ariaDescribedBy,
              onFocus: handleFocus,
              onBlur: handleBlur,
              ...SelectDisplayProps,
            }}
            className={clsx(
              {
                [classes.opened]: open,
                [classes.focusVisible]: isFocusVisible,
                [inputClasses.focused]: isFocusVisible,
              },
              className
            )}
            classes={{
              select: classes.select,
              icon: classes.icon,
            }}
            input={<Input hideOutline={open} inputProps={props.inputProps} />}
            labelId={formControl.labelId ?? muiProps.labelId}
            open={!isSmallScreen ? open : false}
            value={value}
            onChange={handleSelection}
            onClose={handleClose}
            onOpen={handleOpen}
          />
        )}
      </ClassNames>

      <MobilePopover
        anchorEl={null}
        anchorReference="none"
        isVisible={isSmallScreen}
        label={props.label}
        open={open}
        onClose={handleClose}
      >
        <MobileMenuList
          aria-label={props.label}
          value={value}
          onItemSelection={handleSelection}
        >
          {props.children}
        </MobileMenuList>
      </MobilePopover>
    </React.Fragment>
  );
});

Select.defaultProps = {
  defaultValue: '',
};

export const IconComponent = (props: {
  className: string;
  open: boolean;
}): React.ReactElement => {
  return props.open ? (
    <ChevronUpIcon className={props.className} size="medium" />
  ) : (
    <ChevronDownIcon className={props.className} size="medium" />
  );
};

export default Select;
