import React from 'react';
import _ from 'underscore';

import 'css!./__styles__/ProgressBarMarker';

// NOTE: This should only be added as a child of <VideoProgressBar>
// There is a separate file mainly for organization purposes -
// separating files helps keep the logic in each more focused.

type Props = {
  offsetFraction: number;
  color?: string;
};

const ProgressBarMarker = ({ offsetFraction, color }: Props) => {
  const formattedOffset = `${(Math.floor(offsetFraction * 10000) / 100).toFixed(2)}%`;
  const optionalStyles = _.pick({ color }, Boolean); // this removes all keys with falsey values
  return (
    <div
      className="rc-ProgressBarMarker"
      style={{
        ...optionalStyles,
        left: formattedOffset,
      }}
    />
  );
};

export default ProgressBarMarker;
