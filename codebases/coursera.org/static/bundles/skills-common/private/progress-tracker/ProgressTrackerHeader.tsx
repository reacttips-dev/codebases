import * as React from 'react';
import { StyleSheet, css, color, fontFamily, Box, placeholder } from '@coursera/coursera-ui';

import _t from 'i18n!nls/skills-common';

import { ProgressBarProps } from './ProgressBar';

import ProgressTrackerPopover from './ProgressTrackerPopover';
import PersonalScorePopoverContent from './PersonalScorePopoverContent';
import BenchmarkScorePopoverContent from './BenchmarkScorePopoverContent';

const styles = StyleSheet.create({
  root: {
    marginTop: -6,
  },
  heading: {
    fontFamily: 'OpenSans-Semibold, Arial, sans-serif',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    lineHeight: 1.6,
    marginTop: 6,
    marginRight: 6,
    flex: '1 1 100%',
  },
  /**
   * Please be aware that multiple conflicting designs exist and we wish to be
   * consistent. So before you change this or add a new font style, consider if
   * the design you are working against has been updated.
   */
  sm: {
    fontSize: '1rem',
  },
  md: {
    fontSize: '1.25rem',
  },
  scoreContainer: {
    flex: '0 0 auto',
    justifyContent: 'flex-end',
    display: 'flex',
    whiteSpace: 'nowrap',
    cursor: 'default',
    marginTop: 6,
  },
  value: {
    display: 'inline-block',
    width: 30,
  },
  scoreValue: {
    textAlign: 'right',
  },
  targetValue: {
    textAlign: 'left',
  },
  labelText: {
    color: color.secondaryText,
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',

    ':nth-child(n) b': {
      color: color.primaryText,
      fontFamily: fontFamily.bold,
    },
  },
  placeholderHeading: {
    display: 'inline-block',
    width: '100%',
    maxWidth: 250,
  },
  placeholderLabel: {
    display: 'inline-block',
    width: '100%',
    maxWidth: 75,
    marginLeft: 6,
  },
  placeholderScore: {
    flexBasis: '33%',
  },
});

type ProgressTrackerHeaderProps = ProgressBarProps & {
  hideScore: boolean;
  skillName?: string;
  headerSize?: 'sm' | 'md';
  personalScoreLabelText?: string;
  benchmarkLabelText?: string;
  personalScorePopoverContent?: JSX.Element;
  benchmarkPopoverContent?: JSX.Element;
};

type PropsForPlaceholder = Pick<ProgressTrackerHeaderProps, 'headerSize'>;

const stopPropagation = (event: React.MouseEvent) => event.stopPropagation();

const ProgressTrackerHeader = (props: ProgressTrackerHeaderProps): JSX.Element => {
  const {
    hideScore,
    score,
    target,
    skillName,
    headerSize = 'md',
    personalScoreLabelText = _t('My Score'),
    benchmarkLabelText = _t('Target'),
    personalScorePopoverContent,
    benchmarkPopoverContent,
  } = props;

  const personalLabel = !hideScore && (
    <ProgressTrackerPopover
      popoverContent={personalScorePopoverContent || <PersonalScorePopoverContent score={score} />}
    >
      <div {...css(styles.labelText)}>
        <span aria-label={_t('My score: #{score}', { score })} role="text">
          <span aria-hidden>{personalScoreLabelText}</span>
          &nbsp;
          <b {...css(styles.value, styles.scoreValue)} aria-hidden>
            {score || '--'}
          </b>
        </span>
      </div>
    </ProgressTrackerPopover>
  );

  const benchmarkLabel = (
    <ProgressTrackerPopover popoverContent={benchmarkPopoverContent || <BenchmarkScorePopoverContent score={target} />}>
      <div {...css(styles.labelText)}>
        <span aria-label={_t('Target score: #{target}', { target })} role="text">
          <b aria-hidden>{target || '--'}</b>
          &nbsp;
          <span aria-hidden>{benchmarkLabelText}</span>
        </span>
      </div>
    </ProgressTrackerPopover>
  );

  return (
    <Box rootClassName={styles.root} display="flex" justifyContent="between" alignItems="baseline" flexWrap="nowrap">
      {skillName && <div {...css(styles.heading, styles[headerSize])}>{skillName}</div>}

      {/* Needed to stop events other than the tooltip triggers on mobile. This is not a button. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div {...css(styles.scoreContainer)} onClick={stopPropagation}>
        {personalLabel}

        {!hideScore && (
          <div style={{ margin: '0 8px' }}>
            <b> | </b>
          </div>
        )}

        {benchmarkLabel}
      </div>
    </Box>
  );
};

ProgressTrackerHeader.Placeholder = ({ headerSize }: PropsForPlaceholder): JSX.Element => (
  <Box rootClassName={styles.root} display="flex" justifyContent="between" alignItems="baseline">
    <span
      aria-hidden
      className={
        css(placeholder.styles.shimmer, styles.heading, styles[headerSize], styles.placeholderHeading).className
      }
    >
      &nbsp;
    </span>
    <div {...css(styles.scoreContainer, styles.placeholderScore)}>
      <span
        aria-hidden
        className={
          css(placeholder.styles.shimmer, styles.labelText, styles[headerSize], styles.placeholderLabel).className
        }
      >
        &nbsp;
      </span>
    </div>
  </Box>
);

export default ProgressTrackerHeader;
