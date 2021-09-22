import React from 'react';
import { NotEnoughPeerReviewsNextStep } from 'bundles/course-home/page-course-welcome/next-step-card/types/NextStep';
import { compose } from 'recompose';

import SessionSwitchButton from 'bundles/course-sessions/components/SessionSwitchButton';

import _t from 'i18n!nls/course-home';
import withSessionLabel, { SessionLabel } from 'bundles/course-sessions/utils/withSessionLabel';
import mapProps from 'js/lib/mapProps';

type InputProps = {
  nextStep: NotEnoughPeerReviewsNextStep;
};

type Props = InputProps & {
  sessionLabel: SessionLabel;
};

const NotEnoughPeerReviews: React.SFC<Props> = (props) => {
  const {
    sessionLabel,
    nextStep: {
      definition: { courseId },
    },
  } = props;

  return (
    <div className="rc-NotEnoughPeerReviews">
      <div className="next-step-content horizontal-box wrap">
        <div className="flex-1 description">
          <div className="body-2-text title">{_t('Need more reviews on your peer assignment?')}</div>

          <div className="body-1-text">
            {sessionLabel === 'session'
              ? _t(
                  `You can enroll in the next session. Your progress will be saved and you can
              pick up right where you left off.`
                )
              : _t(
                  `You can enroll in the next schedule. Your progress will be saved and you can
              pick up right where you left off.`
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
)(NotEnoughPeerReviews);
