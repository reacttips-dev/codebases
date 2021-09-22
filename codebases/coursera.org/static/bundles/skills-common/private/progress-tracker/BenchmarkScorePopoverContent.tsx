import * as React from 'react';

import { StyleSheet, css } from '@coursera/coursera-ui';

import _t from 'i18n!nls/skills-common';

import ProgressTrackerPopoverContent from './ProgressTrackerPopoverContent';
import { generateBenchmarkCopy } from './messages';

type BenchmarkScorePopoverContentProps = {
  score?: number;
};

const styles = StyleSheet.create({
  noScoreText: {
    fontSize: 12,
    color: '#666666',
  },
});

const BenchmarkScorePopoverContent: React.FC<BenchmarkScorePopoverContentProps> = props => {
  const { score } = props;

  if (score === undefined) {
    return (
      <ProgressTrackerPopoverContent score={score}>
        <div {...css(styles.noScoreText)}>
          {_t('There is no set target for this skill.')}
        </div>
      </ProgressTrackerPopoverContent>
    );
  }

  const benchmarkCopy = generateBenchmarkCopy();

  return <ProgressTrackerPopoverContent copy={benchmarkCopy} score={score} />;
};

export default BenchmarkScorePopoverContent;
