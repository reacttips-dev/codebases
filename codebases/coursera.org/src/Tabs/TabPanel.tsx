/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import { useTheme } from '@core/theme';
import { ComponentPropsWithRef } from '@core/types';

import getTabPanelCss from './getTabPanelCss';
import { getTabId, getPanelId, useTabContext } from './TabContext';

export type Props = {
  /**
   * The `value` of the corresponding `Tab`.
   */
  value: string;
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
} & ComponentPropsWithRef<'div'>;

/**
 * See [Tabs](__storybookUrl__/navigation-tabs--default)
 */
const TabPanel = (props: Props, ref: React.Ref<HTMLDivElement>) => {
  const theme = useTheme();
  const css = getTabPanelCss(theme);

  const { value, children, ...rest } = props;
  const context = useTabContext();

  if (context === null) {
    throw new TypeError('No TabContext provided');
  }

  const id = getPanelId(context, value);
  const tabId = getTabId(context, value);

  return (
    <div
      ref={ref}
      aria-labelledby={tabId}
      css={css}
      hidden={value !== context.value}
      id={id}
      role="tabpanel"
      {...rest}
    >
      {value === context.value && children}
    </div>
  );
};

export default React.forwardRef(TabPanel);
