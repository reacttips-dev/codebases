/* @jsx jsx */
import React from 'react';

import { jsx, css } from '@emotion/react';

import { Typography } from '@coursera/cds-core';

type Props = {
  children: string;
};

const GoalSettingDescription: React.FC<Props> = ({ children }) => (
  <Typography
    css={css`
      margin: 0;
      padding: 0.75rem 0;
    `}
    variant="body1"
  >
    {children}
  </Typography>
);

export default GoalSettingDescription;
