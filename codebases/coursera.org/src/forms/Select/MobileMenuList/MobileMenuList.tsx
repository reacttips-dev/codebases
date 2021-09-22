/** @jsx jsx */
import React from 'react';

import { MenuList, MenuListProps } from '@material-ui/core';

import { jsx } from '@emotion/react';

import {
  SelectOptionProps,
  SelectOption,
} from '@core/forms/Select/SelectOption';
import { useTheme } from '@core/theme';

import getMobileMenuList, { classes } from './getMobileMenuListCss';

export type Props = {
  /**
   * Defines callback function fired when a menu item is selected.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (any).
   * @param {object} [child] The react element that was selected when `native` is `false` (default).
   */
  onItemSelection?: (
    event: React.ChangeEvent<{
      name?: string;
      value: unknown;
    }>,
    child: React.ReactElement<SelectOptionProps, typeof SelectOption>
  ) => void;

  /**
   * Defines selected option
   */
  value?: unknown;

  /**
   * Defines a number of visible items
   */
  visibleItemCount?: number;

  /**
   * Defines possible options
   */
  children:
    | React.ReactElement<SelectOptionProps, typeof SelectOption>
    | Array<React.ReactElement<SelectOptionProps, typeof SelectOption>>;
};

/**
 * Helper function to compare selected value and option value
 * @param {unknown} a
 * @param {unknown} b
 */
export const areEqualValues = (a: unknown, b: unknown): boolean => {
  if (typeof b === 'object' && b !== null) {
    return a === b;
  }

  return String(a) === String(b);
};

const MobileMenuList = (
  props: MenuListProps & Props,
  ref: React.Ref<HTMLUListElement>
): React.ReactElement<MenuListProps> => {
  const { children, onItemSelection, ...menuListProps } = props;
  const theme = useTheme();
  const css = getMobileMenuList(theme);

  const handleItemSelection = (
    child: React.ReactElement<SelectOptionProps, typeof SelectOption>
  ) => (event: unknown): void => {
    Object.defineProperty(event, 'target', {
      writable: true,
      value: { value: child.props.value, name: undefined },
    });

    onItemSelection?.(
      event as React.ChangeEvent<{ value: unknown; name?: string }>,
      child
    );
  };

  const items =
    children &&
    React.Children.map(
      children,
      (
        menuItem: React.ReactElement<SelectOptionProps, typeof SelectOption>
      ) => {
        const selected = areEqualValues(menuItem.props.value, props.value);

        return React.cloneElement(menuItem, {
          'aria-selected': selected ? 'true' : undefined,
          role: 'option',
          onClick: handleItemSelection(menuItem),
          selected: selected,
          value: undefined, // Makes sure value is not visible in DOM.
        });
      }
    );

  return (
    <MenuList
      ref={ref}
      autoFocusItem
      classes={classes}
      css={css}
      {...menuListProps}
    >
      {items}
    </MenuList>
  );
};

/**
 * Styled MenuList component for mobile select
 */
export default React.forwardRef(MobileMenuList);
