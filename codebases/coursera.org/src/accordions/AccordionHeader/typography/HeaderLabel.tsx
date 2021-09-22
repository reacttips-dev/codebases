/** @jsx jsx */

import React from 'react';

import { jsx } from '@emotion/react';

import Typography from '@core/Typography';

export type Props = {
  id?: string;
  'aria-label'?: string;
  children: React.ReactText;
};

const HeaderLabel = (props: Props): JSX.Element => {
  const { children, ...rest } = props;

  return (
    <Typography component="span" variant="h3bold" {...rest}>
      {children}
    </Typography>
  );
};

export default HeaderLabel;
