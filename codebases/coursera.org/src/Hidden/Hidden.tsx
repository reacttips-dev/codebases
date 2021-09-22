import React from 'react';

import {
  Hidden as MuiHidden,
  HiddenProps as MuiHiddenProps,
} from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

export type Props = {
  /**
   * You can use this prop when choosing the js implementation with server-side rendering.
   * As window.innerWidth is unavailable on the server, we default to rendering an empty component during the first mount.
   * You might want to use a heuristic to approximate the screen width of the client browser screen width.
   * @default xs
   */
  initialWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * If `true`, screens this size and down will be hidden.
   */
  lgDown?: boolean;
  /**
   * If `true`, screens this size and up will be hidden.
   */
  lgUp?: boolean;
  /**
   * If `true`, screens this size and down will be hidden.
   */
  mdDown?: boolean;
  /**
   * If `true`, screens this size and up will be hidden.
   */
  mdUp?: boolean;
  /**
   * Hide the given breakpoint(s).
   */
  only?: Breakpoint | Breakpoint[];
  /**
   * If `true`, screens this size and down will be hidden.
   */
  smDown?: boolean;
  /**
   * If `true`, screens this size and up will be hidden.
   */
  smUp?: boolean;
  /**
   * If `true`, screens this size and down will be hidden.
   */
  xlDown?: boolean;
  /**
   * If `true`, screens this size and up will be hidden.
   */
  xlUp?: boolean;
  /**
   * If `true`, screens this size and down will be hidden.
   */
  xsDown?: boolean;
  /**
   * If `true`, screens this size and up will be hidden.
   */
  xsUp?: boolean;
};

/**
 * Toggle the visibility of components based on responsive breakpoints in Coursera Design System.
 *
 * See [Props](__storybookUrl__/layout-hidden--default#props)
 */
const Hidden: React.FC<Props> = (props: Props) => {
  /** In order to work on IE 11, `implementation` prop needs to be set to css. */
  const muiHiddenProps: MuiHiddenProps = {
    ...props,
    implementation: 'css',
  };
  return <MuiHidden {...muiHiddenProps} />;
};

export default Hidden;
