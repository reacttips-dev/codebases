import * as React from 'react';

import { Box, StyleSheet, css } from '@coursera/coursera-ui';

const styles = StyleSheet.create({
  contentContainer: {
    padding: 24,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  simpleDescription: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  fullDescription: {
    fontSize: 12,
    color: '#666666',
  },
});

export type ProgressTrackerPopoverContentProps = {
  score?: number;
  copy?: {
    simpleDescription: string;
    fullDescription: string;
  };
};

const ProgressTrackerPopoverContent: React.FC<ProgressTrackerPopoverContentProps> = (props) => {
  const { children, score, copy } = props;

  return (
    <Box rootClassName={css(styles.contentContainer).className} flexDirection="column" alignItems="stretch">
      {children || (
        <div>
          {score !== undefined && (
            <div key="score" {...css(styles.score)}>
              {score}
            </div>
          )}
          <div key="simpleDescription" {...css(styles.simpleDescription)}>
            {copy?.simpleDescription}
          </div>
          <div key="fullDescription" {...css(styles.fullDescription)}>
            {copy?.fullDescription}
          </div>
        </div>
      )}
    </Box>
  );
};

export default ProgressTrackerPopoverContent;
