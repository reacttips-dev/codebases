/** @jsx jsx */
import React from 'react';

import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/compound-assessments';
import { css, jsx } from '@emotion/react';
import type { Theme } from '@coursera/cds-core';
import { Typography } from '@coursera/cds-core';

type Props = {
  score?: number;
  maxScore: number;
  isExtraCreditQuestion?: boolean;
};

const styles = {
  root: (theme: Theme) =>
    css({
      backgroundColor: theme.palette.gray[300],
      borderRadius: theme.spacing(4),
      padding: theme.spacing(4),
      height: 'fit-content',
    }),
};

const QuestionPoints = ({ score, maxScore, isExtraCreditQuestion }: Props) => (
  <div css={styles.root}>
    {typeof score !== 'number' ? (
      <Typography variant="h4bold" component="span">
        <FormattedMessage
          message={
            isExtraCreditQuestion
              ? _t('{maxScore} {maxScore, plural, =1 {extra credit point} other {extra credit points}}')
              : _t('{maxScore} {maxScore, plural, =1 {point} other {points}}')
          }
          maxScore={maxScore}
        />
      </Typography>
    ) : (
      <Typography variant="h4bold" component="span">
        <FormattedMessage
          message={
            isExtraCreditQuestion
              ? _t('{fractionalScore} {maxScore, plural, =1 {extra credit point} other {extra credit points}}')
              : _t('{fractionalScore} {maxScore, plural, =1 {point} other {points}}')
          }
          fractionalScore={
            <span dir="ltr">
              {score} / {maxScore}
            </span>
          }
          maxScore={maxScore}
        />
      </Typography>
    )}
  </div>
);

export default QuestionPoints;
