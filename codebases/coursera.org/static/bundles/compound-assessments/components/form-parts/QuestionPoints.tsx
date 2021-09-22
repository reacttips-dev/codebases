import React from 'react';

import { Pill, color } from '@coursera/coursera-ui';
import initBem from 'js/lib/bem';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/compound-assessments';

import 'css!./__styles__/QuestionPoints';

const bem = initBem('QuestionPoints');

const pillScoreBackgroundColor = color.bgGrayThemeDark;
const pillScoreStyle = {
  color: color.white,
  fontWeight: 'bold',
} as const;

type Props = {
  score?: number;
  maxScore: number;
  isExtraCreditQuestion?: boolean;
};

const QuestionPoints = ({ score, maxScore, isExtraCreditQuestion }: Props) => (
  <div className={bem()}>
    {typeof score !== 'number' ? (
      <Pill type="outline" rootClassName={bem('pill')}>
        <FormattedMessage
          message={
            isExtraCreditQuestion
              ? _t('{maxScore} {maxScore, plural, =1 {extra credit point} other {extra credit points}}')
              : _t('{maxScore} {maxScore, plural, =1 {point} other {points}}')
          }
          maxScore={maxScore}
        />
      </Pill>
    ) : (
      <Pill type="filled" rootClassName={bem('pill')} fillColor={pillScoreBackgroundColor} style={pillScoreStyle}>
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
      </Pill>
    )}
  </div>
);

export default QuestionPoints;
