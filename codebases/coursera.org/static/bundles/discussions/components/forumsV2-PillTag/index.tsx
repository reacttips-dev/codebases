/* @jsx jsx */
import { jsx, css } from '@emotion/react';
import React from 'react';
import { Typography, useTheme } from '@coursera/cds-core';

export type PillTagProps = { label?: string };

export default function PillTag({ label }: PillTagProps) {
  const theme = useTheme();
  return (
    <Typography
      css={css`
        padding: ${theme.spacing(4, 8, 4, 8)};
        border-radius: 12px;
        color: ${theme.palette.purple[800]};
        background-color: ${theme.palette.purple[50]};
      `}
      component="span"
      variant="h4bold"
      aria-label={label}
    >
      {label}
    </Typography>
  );
}
