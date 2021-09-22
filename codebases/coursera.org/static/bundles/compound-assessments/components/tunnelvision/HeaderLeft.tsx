import React from 'react';

import { Caption, H4 } from '@coursera/coursera-ui';

import { humanizeLearningTime } from 'js/utils/DateTimeUtils';

import initBem from 'js/lib/bem';
import 'css!./__styles__/HeaderLeft';

const bem = initBem('HeaderLeft');

type Props = {
  headerText: string;
  itemTypeText: string;
  timeCommitment?: number;
};

export const HeaderLeft: React.FC<Props> = ({ headerText, itemTypeText, timeCommitment }) => (
  <div className={bem()}>
    <H4 tag="div" rootClassName={bem('header')}>
      {headerText}
    </H4>
    <Caption rootClassName={bem('sub-header')}>
      {itemTypeText}
      {timeCommitment && (
        <span>
          &nbsp;•&nbsp;
          {humanizeLearningTime(timeCommitment)}
        </span>
      )}
    </Caption>
  </div>
);

export default HeaderLeft;
