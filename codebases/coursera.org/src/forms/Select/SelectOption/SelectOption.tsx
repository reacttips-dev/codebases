/** @jsx jsx */
import React from 'react';

import { MenuItem as MuiMenuItem } from '@material-ui/core';

import { jsx } from '@emotion/react';

import CheckIcon from '@core/icons/signs/CheckIcon';
import { useTheme } from '@core/theme';
import { ComponentPropsWithRef } from '@core/types';

import getSelectOptionCss, { classes } from './getSelectOptionCss';

export type Props = {
  /**
   * Defines option value.
   */
  value: React.ReactText;

  /**
   * Option content.
   */
  children: React.ReactNode;

  /**
   * Defines if options shouldn't be rendered in the dropdown.
   * Note: this is for internal usage only.
   * @ignore
   */
  hidden?: boolean;

  /**
   * Use to apply selected styling.
   */
  selected?: boolean;

  /**
   * Used to disable pseudo placeholder
   * Note: this is for internal usage only.
   * @ignore
   */
  disabled?: boolean;
} & ComponentPropsWithRef<'li'>;

const SelectOption = (props: Props, ref: React.Ref<HTMLLIElement>) => {
  const theme = useTheme();
  const css = getSelectOptionCss(theme);

  const { selected, children, ...rest } = props;
  const isSelected = selected && !props.disabled;

  return !props.hidden ? (
    <MuiMenuItem
      ref={ref}
      button
      disableRipple
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-expect-error For some reason Material UI type def doesn't allow me to pass this prop
      ListItemClasses={{
        button: classes.button,
      }}
      classes={{
        root: classes.root,
        selected: classes.selected,
      }}
      css={css}
      focusVisibleClassName={classes.focusVisible}
      selected={isSelected}
      {...rest}
    >
      <div className={classes.container}>
        <div>{children}</div>

        {selected && (
          <div className={classes.icon}>
            <CheckIcon size="medium" />
          </div>
        )}
      </div>
    </MuiMenuItem>
  ) : null;
};

export default React.forwardRef(SelectOption);
