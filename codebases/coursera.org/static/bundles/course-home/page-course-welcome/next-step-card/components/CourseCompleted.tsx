import React from 'react';

import type { CourseCompletedNextStep } from 'bundles/course-home/page-course-welcome/next-step-card/types/NextStep';

import CourseOptions from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/CourseOptions';
import CompletionMessage from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/CompletionMessage';
import CourseCompletionWithShareModal from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/CourseCompletionWithShareModal';

import SvgCertificateConfetti from 'bundles/coursera-ui/assets/SvgCertificateConfetti';

import _t from 'i18n!nls/course-home';

import 'css!./__styles__/CourseCompleted';

type Props = {
  nextStep: CourseCompletedNextStep;
};

const CourseCompleted: React.SFC<Props> = (props) => {
  const {
    nextStep: {
      definition: { course, s12n, canUnenroll, canSwitchSession, canCompleteVerificationProfile },
    },
  } = props;

  return (
    <div className="rc-CourseCompleted">
      <CourseOptions course={course} canUnenroll={canUnenroll} canSwitchSession={canSwitchSession} />

      <div className="contents vertical-box align-items-absolute-center">
        <SvgCertificateConfetti />

        <h3 className="headline-5-text">{_t('Congratulations!')}</h3>

        <CompletionMessage course={course} s12n={s12n} />

        <CourseCompletionWithShareModal nextStep={props.nextStep} />

        {!!s12n && !canCompleteVerificationProfile && (
          <div>
            <br />
            <span>{_t('Keep going!')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCompleted;
