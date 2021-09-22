/** @jsx jsx */
import React from 'react';

import { Tabs as MuiTabs } from '@material-ui/core';

import { jsx } from '@emotion/react';

import { useTheme } from '@core/theme';
import { ComponentPropsWithRef } from '@core/types';

import getTabsCss, { classes } from './getTabsCss';
import { Props as TabProps } from './Tab';
import { getTabId, getPanelId, useTabContext } from './TabContext';

export type Props = {
  /**
   * Callback fired when the selected tab changes.
   * @param value Value for the selected tab.
   */
  onChange?: (value: string) => void;
  /**
   * The variants of tabs.
   * @default primary
   */
  variant?: 'primary' | 'section';
  /**
   * Provide a label for the Tabs.
   * Use `aria-labelledby` instead if you have a visible label.
   */
  'aria-label'?: string;
  /**
   * Use when you have a visible label.
   */
  'aria-labelledby'?: string;
  /**
   * Whether tabs are activated manually on focus or automatically.
   * @default manual
   */
  keyboardActivation?: 'manual' | 'automatic';
  /**
   * A list of <Tab /> elements.
   */
  children: React.ReactElement<TabProps>[];
} & Omit<ComponentPropsWithRef<'button'>, 'onChange'>;

/**
 * Tabs is a navigation component that allows users to navigate among a set of relevant content sections.
 *
 * See [Tabs](__storybookUrl__/navigation-tabs--default)
 */
const Tabs = React.forwardRef(function Tabs(
  props: Props,
  ref: React.Ref<HTMLButtonElement>
): React.ReactElement<Props> {
  const context = useTabContext();

  if (!context) {
    throw new TypeError('No TabContext provided');
  }

  const theme = useTheme();
  const css = getTabsCss(theme);

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const {
    children: childrenProp,
    onChange,
    variant,
    keyboardActivation,
    ...rest
  } = props;

  const children = React.Children.map(childrenProp, (child) =>
    React.cloneElement(child, {
      variant,
      id: getTabId(context, child.props.value),
      'aria-controls': getPanelId(context, child.props.value),
    })
  );

  return (
    <MuiTabs
      {...rest}
      ref={ref}
      classes={classes}
      css={css}
      scrollButtons="off"
      selectionFollowsFocus={keyboardActivation !== 'manual'}
      value={context.value}
      variant="scrollable"
      onChange={(_, value) => onChange?.(value)}
    >
      {children}
    </MuiTabs>
  );
});

Tabs.defaultProps = {
  variant: 'primary',
  keyboardActivation: 'manual',
};

export default Tabs;
