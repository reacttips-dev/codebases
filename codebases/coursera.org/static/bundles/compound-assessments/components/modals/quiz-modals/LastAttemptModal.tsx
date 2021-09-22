import React from 'react';

import { FormattedMessage } from 'js/lib/coursera.react-intl';
import TimeDuration from 'bundles/phoenix/components/TimeDuration';
import _t from 'i18n!nls/compound-assessments';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import Time from 'bundles/phoenix/components/Time';

import AssessmentModalLayout from '../AssessmentModalLayout';

type Props = {
  timeLimit?: number;
  lockedTimeLeft?: number;
  onCancelButtonClick: () => void;
  onPrimaryButtonClick: () => void;
};

const LastAttemptModal = ({ timeLimit, lockedTimeLeft, onCancelButtonClick, onPrimaryButtonClick }: Props) => {
  let title: React.ReactNode = _t('Last Attempt');
  const isLockedTimeLeftValid = typeof lockedTimeLeft === 'number' && lockedTimeLeft > 0;
  if (isLockedTimeLeftValid) {
    // @ts-expect-error TSMIGRATION
    const timeNode = <Time time={Date.now() + lockedTimeLeft} format={`MMMM D [${_t('at')}] h:mm A`} />;

    title = <FormattedMessage message={_t('{titleText} until {time}')} titleText={title} time={timeNode} />;
  }
  return (
    <AssessmentModalLayout
      title={title}
      content={
        <div>
          {isLockedTimeLeftValid ? (
            <FormattedMessage
              message={_t('This is your last attempt for the next {lockDuration}.')}
              lockDuration={<TimeDuration duration={lockedTimeLeft} showPrecise={true} />}
            />
          ) : (
            <span>{_t('This is your last attempt.')}</span>
          )}

          {typeof timeLimit === 'number' && timeLimit > 0 && (
            <FormattedMessage
              message={_t(' You will have {limitDuration} to complete it.')}
              limitDuration={<TimeDuration duration={timeLimit} showPrecise={true} />}
            />
          )}

          <span>{_t(" Make sure you've studied the material before you start.")}</span>
        </div>
      }
      primaryButtonContents={_t('Start')}
      onPrimaryButtonClick={onPrimaryButtonClick}
      onCancelButtonClick={onCancelButtonClick}
    />
  );
};

export default LastAttemptModal;
