/* @jsx jsx */
import React from 'react';

import { CardV2, Box } from '@coursera/coursera-ui';
import { Typography, useTheme } from '@coursera/cds-core';
import { jsx, css } from '@emotion/react';

import 'css!./__styles__/CourseCard';

export const Title: React.FC<{ children: string }> = ({ children }) => (
  <Typography variant="h2semibold">{children}</Typography>
);

export const Message: React.FC<{ children: string }> = ({ children }) => {
  const theme = useTheme();
  return (
    <Typography
      variant="body2"
      css={css`
        margin: ${theme.spacing(0)};
      `}
    >
      {children}
    </Typography>
  );
};

export const Content: React.FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => (
  <div
    css={css`
      max-width: 23rem;
    `}
  >
    {children}
  </div>
);

export const CourseCard: React.FC<{ children?: React.ReactNode | React.ReactNode[] }> = ({ children }) => (
  <CardV2 rootClassName="rc-NextStepCourseCard" showBorder>
    <Box flexWrap="wrap" flexDirection="row" alignItems="end" justifyContent="between">
      {children}
    </Box>
  </CardV2>
);

export default CourseCard;
