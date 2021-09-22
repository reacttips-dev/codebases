/** @jsx jsx */
import React from 'react';
// eslint-disable-next-line
import { css, jsx } from '@emotion/react';
import { Typography, Theme } from '@coursera/cds-core';

import _t from 'i18n!nls/course-home';

import { humanizeLearningTime } from 'js/utils/DateTimeUtils';

type Props = {
  remainingDuration: number;
  theme: Theme;
};

const EstimatedTime = ({ remainingDuration, theme }: Props) => {
  const estimatedTimeWithFullUnits = `${_t('Estimated Time')}: ${humanizeLearningTime(remainingDuration, true)}`;

  return (
    <Typography
      variant="h3semibold"
      css={css`
        margin: ${theme.spacing(0, 0, 0, 16)};
      `}
      aria-label={estimatedTimeWithFullUnits}
    >
      {_t('Estimated Time')}: {humanizeLearningTime(remainingDuration)}
    </Typography>
  );
};

export default EstimatedTime;
