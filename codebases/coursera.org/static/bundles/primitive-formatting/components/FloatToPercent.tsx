import React from 'react';
import { truncToPlace } from 'bundles/primitive-formatting';
import { FormattedNumber } from 'js/lib/coursera.react-intl';

type Props = {
  value?: number;
  maxFractionDigits?: number;
};

// note: This component truncates the float value, because most Coursera values related to floats
// (eg. grades, grading weights, late penalties) should be floored instead of rounded.
const FloatToPercent: React.FC<Props> = ({ value, maxFractionDigits = 2 }) => {
  if (value != null && Number.isFinite(value)) {
    const truncatedValue = truncToPlace(value, 2 + maxFractionDigits);
    const minDigits = truncToPlace(truncatedValue * 100, 2) % 1 === 0 ? 0 : 2;
    return <FormattedNumber {...{ value: truncatedValue, style: 'percent', minimumFractionDigits: minDigits }} />;
  }
  return null;
};

export default FloatToPercent;
