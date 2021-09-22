/** @jsx jsx */

import React from 'react';

import { ButtonBase } from '@material-ui/core';

import { jsx } from '@emotion/react';

import clsx from 'clsx';

import { useAccordionContext } from '@core/accordions/context';
import ChevronNextIcon from '@core/icons/arrows/ChevronNextIcon';
import type { BaseComponentProps } from '@core/types';

import {
  useBlurHandler,
  useClickHandler,
  useFocusHandler,
  useKeyDownHandler,
  useMouseEnterHandler,
  useMouseLeaveHandler,
} from './events';
import { classes } from './getAccordionHeaderCss';

export type Props = BaseComponentProps<'button'> & {
  children?: React.ReactNode | React.ReactNode[];
};

const HeaderButton = (props: Props): JSX.Element => {
  const {
    children,
    onClick,
    onFocus,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    onKeyDown,
    ...buttonProps
  } = props;

  const context = useAccordionContext();

  return (
    <ButtonBase
      ref={context?.headerRef}
      disableRipple
      disableTouchRipple
      aria-expanded={context?.expanded || false}
      classes={{ root: classes.button }}
      component="button"
      onBlur={useBlurHandler(onBlur)}
      onClick={useClickHandler(onClick)}
      onFocusVisible={useFocusHandler(onFocus)}
      onKeyDown={useKeyDownHandler(onKeyDown)}
      onMouseEnter={useMouseEnterHandler(onMouseEnter)}
      onMouseLeave={useMouseLeaveHandler(onMouseLeave)}
      {...buttonProps}
    >
      <ChevronNextIcon
        className={clsx(classes.chevron, {
          [classes.expanded]: context?.expanded,
        })}
        size="medium"
      />

      <div className={classes.content}>{children}</div>
    </ButtonBase>
  );
};

export default HeaderButton;
