/** @jsx jsx */
import React, { SyntheticEvent } from 'react';

import { Tab as MuiTab } from '@material-ui/core';

import { jsx } from '@emotion/react';

import { useTheme } from '@core/theme';

import getTabCss, { classes as tabClasses } from './getTabCss';

export type Props = {
  /**
   * The label displayed for the tab
   */
  label: string;
  /**
   * The value for the tab
   */
  value: string;
  /**
   * Icon for the tab
   */
  icon?: React.ReactElement;
  /**
   * Handle click on tab
   */
  onClick?: React.EventHandler<SyntheticEvent>;
  /**
   * Handle change in tab selection
   */
  onChange?: (
    event: React.ChangeEvent<{ checked: boolean }>,
    value: string
  ) => void;
  /**
   * The variants of tab.
   * Forwarded automatically by parent <Tabs />, do not set directly.
   */
  variant?: 'primary' | 'section';
} & React.ComponentPropsWithRef<'div'>;

/**
 * See [Tabs](__storybookUrl__/navigation-tabs--default)
 */
const Tab: React.FC<Props> = (props: Props) => {
  const theme = useTheme();
  const css = getTabCss(theme, props);
  const { focusVisible, ...classes } = tabClasses;

  return (
    <MuiTab
      disableRipple
      classes={classes}
      css={css}
      focusVisibleClassName={focusVisible}
      {...props}
    />
  );
};

export default Tab;
