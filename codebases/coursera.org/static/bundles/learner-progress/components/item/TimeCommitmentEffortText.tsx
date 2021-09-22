import React from 'react';
import { humanizeLearningTime } from 'js/utils/DateTimeUtils';
import A11yScreenReaderOnly from 'bundles/a11y/components/A11yScreenReaderOnly';

type Props = {
  className?: string;
  timeCommitment: number;
};

const TimeCommitmentEffortText: React.FC<Props> = ({ className, timeCommitment }) =>
  timeCommitment ? (
    <span className={className}>
      <A11yScreenReaderOnly tagName="span">
        . Duration: {humanizeLearningTime(timeCommitment, true)}
      </A11yScreenReaderOnly>
      <span aria-hidden={true}>{humanizeLearningTime(timeCommitment)}</span>
    </span>
  ) : null;

export default TimeCommitmentEffortText;
