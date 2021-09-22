import * as React from 'react';

import { StyleSheet, css } from '@coursera/coursera-ui';

import _t from 'i18n!nls/skills-common';

import ProgressTrackerPopoverContent from './ProgressTrackerPopoverContent';
import { generatePersonalCopy } from './messages';

type PersonalScorePopoverContentProps = {
  score?: number;
};

const styles = StyleSheet.create({
  noScoreText: {
    fontSize: 12,
    color: '#666666',
  },
});

const PersonalScorePopoverContent: React.FC<PersonalScorePopoverContentProps> = (props) => {
  const { score } = props;

  if (score === undefined) {
    return (
      <ProgressTrackerPopoverContent score={score}>
        <div {...css(styles.noScoreText)}>
          {_t('You are currently not enrolled in any courses tagged to this skill')}
        </div>
      </ProgressTrackerPopoverContent>
    );
  }

  const personalCopy = generatePersonalCopy();

  return <ProgressTrackerPopoverContent copy={personalCopy} score={score} />;
};

export default PersonalScorePopoverContent;
