import React from 'react';
import moment from 'moment-timezone';

import { compose } from 'recompose';

import { SessionEndedNextStep } from 'bundles/course-home/page-course-welcome/next-step-card/types/NextStep';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

import SessionSwitchButton from 'bundles/course-sessions/components/SessionSwitchButton';
import withSessionLabel, { SessionLabel } from 'bundles/course-sessions/utils/withSessionLabel';

import _t from 'i18n!nls/course-home';
import mapProps from 'js/lib/mapProps';

type InputProps = {
  nextStep: SessionEndedNextStep;
};

type Props = InputProps & {
  sessionLabel: SessionLabel;
};

const SessionEnded: React.SFC<Props> = (props) => {
  const {
    sessionLabel,
    nextStep: {
      definition: { currentSessionEndedAt, courseId },
    },
  } = props;

  return (
    <div className="rc-SessionEnded">
      <div className="next-step-content horizontal-box wrap">
        <div className="flex-1 description">
          <div className="body-2-text title">
            <FormattedMessage
              message={
                sessionLabel === 'session' ? _t('The session ended on {date}') : _t('The schedule ended on {date}')
              }
              date={moment(currentSessionEndedAt).format('LL')}
            />
          </div>

          <div className="body-1-text">
            {sessionLabel === 'session'
              ? _t(
                  `That's ok! You can enroll in the next session. Your progress will be saved and you
              can pick up right where you left off.`
                )
              : _t(
                  `That's ok! You can enroll in the next schedule. Your progress will be saved and you
              can pick up right where you left off.`
                )}
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
)(SessionEnded);
