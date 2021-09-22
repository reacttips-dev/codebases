import * as React from 'react';
import { Box } from '@coursera/coursera-ui';

import 'css!./__styles__/ProgressTracker';
import 'css!@coursera/coursera-ui/css/coursera-ui.min.css'; // eslint-disable-line no-restricted-syntax,import/extensions
import _t from 'i18n!nls/skills-common';

import ProgressBar, { ProgressBarProps } from './ProgressBar';
import ProgressTrackerHeader from './ProgressTrackerHeader';
import BenchmarkScorePopoverContent from './BenchmarkScorePopoverContent';

type ProgressTrackerProps = ProgressBarProps & {
  skillName?: string;
  headerSize?: 'sm' | 'md';
  hideScore?: boolean;
  personalScoreLabelText?: string;
  benchmarkLabelText?: string;
  personalScorePopoverContent?: JSX.Element;
  benchmarkPopoverContent?: JSX.Element;
};

type PropsForPlaceholder = Pick<ProgressTrackerProps, 'headerSize'>;

const ProgressTracker = (props: ProgressTrackerProps): JSX.Element => {
  const { skillName, headerSize, hideScore = false, benchmarkPopoverContent, ...rest } = props;
  const { target, score } = rest;

  const benchmarkTooltip = benchmarkPopoverContent || <BenchmarkScorePopoverContent score={target} />;

  return (
    <Box
      rootClassName="rc-ProgressTracker"
      display="flex"
      flexDirection="column"
      aria-label={_t('Skill: #{skillName}, my score: #{score}, target score: #{target}', { skillName, score, target })}
    >
      <ProgressTrackerHeader
        skillName={skillName}
        headerSize={headerSize}
        hideScore={hideScore}
        benchmarkPopoverContent={benchmarkPopoverContent}
        {...rest}
      />
      <Box>
        <ProgressBar targetTooltip={benchmarkTooltip} {...rest} />
      </Box>
    </Box>
  );
};

ProgressTracker.Placeholder = ({ headerSize }: PropsForPlaceholder): JSX.Element => (
  <Box rootClassName="rc-ProgressTracker" display="flex" flexDirection="column">
    <ProgressTrackerHeader.Placeholder headerSize={headerSize} />
    <Box>
      <ProgressBar.Placeholder />
    </Box>
  </Box>
);

export default ProgressTracker;
