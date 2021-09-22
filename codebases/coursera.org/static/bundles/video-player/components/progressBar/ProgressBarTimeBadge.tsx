import React from 'react';
import 'css!./__styles__/ProgressBarTimeBadge';

// NOTE: This should only be added as a child of <ProgressBar>
// There is a separate file mainly for organization purposes -
// separating files helps keep the logic in each more focused.

// TODO: potentially move these functions into a util file
const getFormattedTime = (time: number): string => {
  const padToTwoDigits = (num: $TSFixMe) => num.toString().padStart(2, '0');
  const timeInHours = Math.floor(time / 3600);
  const timeInMinutes = Math.floor((time % 3600) / 60);
  const timeInSeconds = Math.floor(time % 60);

  if (time < 0) {
    return '0:00';
  }

  if (timeInHours > 0) {
    return `${timeInHours}:${padToTwoDigits(timeInMinutes)}:${padToTwoDigits(timeInSeconds)}`;
  }

  return `${timeInMinutes}:${padToTwoDigits(timeInSeconds)}`;
};

type Props = {
  time: number;
  videoDuration: number;
};

const ProgressBarTimeBadge = ({ time, videoDuration }: Props) => {
  const fractionOffsetFromProgressBarStart = time / videoDuration;
  const percentOffsetFromProgressBarStart = `${(100 * fractionOffsetFromProgressBarStart).toFixed(2)}%`;

  return (
    <div className="rc-ProgressBarTimeBadge" style={{ left: percentOffsetFromProgressBarStart }}>
      {getFormattedTime(time)}
    </div>
  );
};

export default ProgressBarTimeBadge;
