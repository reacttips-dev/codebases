import React from 'react';

import ProgressCircle from 'bundles/ui/components/ProgressCircle';

import { Box } from '@coursera/coursera-ui';

type Props = {
  percentComplete: number;
};

const GoalSettingProgressWheel = ({ percentComplete }: Props) => {
  if (percentComplete === null || percentComplete === undefined) {
    return null;
  }

  return (
    <ProgressCircle
      percentComplete={percentComplete}
      backgroundColor="#EAEAEA"
      arcColor="#40ADD6"
      arcWidth={10}
      diameter={78}
    >
      <Box alignItems="center" justifyContent="center" style={{ height: '100%', paddingLeft: 5 }}>
        {percentComplete}%
      </Box>
    </ProgressCircle>
  );
};

export default GoalSettingProgressWheel;
