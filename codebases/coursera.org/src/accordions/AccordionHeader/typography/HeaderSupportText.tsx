/** @jsx jsx */

import React from 'react';

import { jsx } from '@emotion/react';

import clsx from 'clsx';

import type { IconProps } from '@core/SvgIcon';
import Typography from '@core/Typography';

import { classes, getHeaderSupportTextCss } from './getHeaderSupportTextCss';

export type Props = {
  id?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
  icon?: React.ReactElement<IconProps>;
  children: React.ReactText;
};

const HeaderSupportText = (props: Props): JSX.Element | null => {
  const { children, icon, ...rest } = props;

  return (
    <Typography
      color="supportText"
      component="span"
      css={getHeaderSupportTextCss}
      variant="body2"
      {...rest}
    >
      {icon &&
        React.cloneElement(icon, {
          'aria-hidden': true,
          size: 'small',
          className: clsx(icon.props.className, classes.icon),
        })}
      {children}
    </Typography>
  );
};

export default HeaderSupportText;
