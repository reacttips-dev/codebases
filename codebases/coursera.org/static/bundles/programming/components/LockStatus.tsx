import React from 'react';
import moment from 'moment';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/programming';
import { GradedLockStatusesType, AttributesType } from 'bundles/programming/components/__types__/ProgrammingTypes';
import 'css!bundles/programming/components/__styles__/LockStatus';

type Props = {
  gradedLockStatuses: GradedLockStatusesType;
};

class LockStatus extends React.Component<Props> {
  render() {
    const { gradedLockStatuses } = this.props;
    const {
      allowedSubmissionsInterval,
      allowedSubmissionsPerInterval,
      submissionsAllowedNowCount,
      nextPossibleSubmissionTime,
    } = { ...gradedLockStatuses.attributes } as AttributesType;

    return (
      <div className="rc-LockStatus">
        <div className="horizontal-box">
          <div className="retake">{_t('Retakes')}</div>
          <div className="vertical-box">
            <div className="attempts-define">
              <FormattedMessage
                message={_t(
                  `You can attempt this assignment {allowedN}
                  {allowedN, plural, =1 {time} other {times}} every {duration}.`
                )}
                allowedN={allowedSubmissionsPerInterval}
                duration={moment.duration(allowedSubmissionsInterval).humanize()}
              />
            </div>
            <div className="attempts-left">
              {submissionsAllowedNowCount > 0 ? (
                <FormattedMessage
                  message={_t('You have {count} {count, plural, =1 {attempt} other {attempts}} left.')}
                  count={submissionsAllowedNowCount}
                />
              ) : (
                <FormattedMessage
                  message={_t(
                    `You have used all {count} {count, plural, =1 {attempt} other {attempts}}.
                    You can attempt again {duration}.`
                  )}
                  count={allowedSubmissionsPerInterval}
                  duration={moment(nextPossibleSubmissionTime).fromNow()}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LockStatus;
