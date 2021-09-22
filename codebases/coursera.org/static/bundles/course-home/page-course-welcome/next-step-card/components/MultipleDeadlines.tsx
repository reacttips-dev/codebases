import React from 'react';
import { MultipleDeadlinesNextStep } from 'bundles/course-home/page-course-welcome/next-step-card/types/NextStep';
import { compose } from 'recompose';

import SessionSwitchButton from 'bundles/course-sessions/components/SessionSwitchButton';

import _t from 'i18n!nls/course-home';
import mapProps from 'js/lib/mapProps';
import withSessionLabel, { SessionLabel } from 'bundles/course-sessions/utils/withSessionLabel';

type InputProps = {
  nextStep: MultipleDeadlinesNextStep;
};

type Props = InputProps & {
  sessionLabel: SessionLabel;
};

const MultipleDeadlines: React.SFC<Props> = (props) => {
  const {
    sessionLabel,
    nextStep: {
      definition: { courseId },
    },
  } = props;

  return (
    <div className="rc-MultipleDeadlines">
      <div className="next-step-content horizontal-box wrap">
        <div className="flex-1 description">
          <div className="body-2-text title">{_t('Need more time?')}</div>

          <div className="body-1-text">
            {sessionLabel === 'session'
              ? _t('Change your due dates and pick up where you left off in a new session.')
              : _t('Change your due dates and pick up where you left off in a new schedule.')}
          </div>
        </div>

        <SessionSwitchButton courseId={courseId} />
      </div>
    </div>
  );
};

export default compose<Props, InputProps>(
  mapProps<InputProps & { courseId: string }, InputProps>(({ nextStep }) => ({
    nextStep,
    courseId: nextStep.definition.courseId,
  })),
  withSessionLabel
)(MultipleDeadlines);
