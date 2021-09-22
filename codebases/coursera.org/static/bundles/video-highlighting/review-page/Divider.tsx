/* @jsx jsx */
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { useTheme } from '@coursera/cds-core';

const Divider = () => {
  const theme = useTheme();
  return (
    <div
      css={css`
        width: 100%;
        margin: ${theme.spacing(24, 0)};
        border-top: 1px solid ${theme.palette.gray[300]};
      `}
    />
  );
};

export default Divider;
