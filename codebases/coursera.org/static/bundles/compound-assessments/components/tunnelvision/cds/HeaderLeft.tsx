import React from 'react';

import { Typography } from '@coursera/cds-core';

import { humanizeLearningTime } from 'js/utils/DateTimeUtils';

type Props = {
  headerText: string;
  itemTypeText: string;
  timeCommitment?: number;
};

export const HeaderLeft: React.FC<Props> = ({ headerText, itemTypeText, timeCommitment }) => (
  <div>
    <Typography variant="h3semibold" component="h1">
      {headerText}
    </Typography>
    <Typography variant="body2" color="supportText">
      {itemTypeText}
      {typeof timeCommitment === 'number' && timeCommitment > 0 && (
        <span>
          &nbsp;•&nbsp;
          {humanizeLearningTime(timeCommitment)}
        </span>
      )}
    </Typography>
  </div>
);

export default HeaderLeft;
