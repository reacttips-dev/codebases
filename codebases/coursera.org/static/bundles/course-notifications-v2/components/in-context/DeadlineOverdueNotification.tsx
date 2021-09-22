import React from 'react';

import { formatDateTimeDisplay, LONG_DATETIME_NO_YEAR_DISPLAY } from 'js/utils/DateTimeUtils';
import SessionSwitchModal from 'bundles/course-sessions/components/SessionSwitchModal';
import InContextNotification from 'bundles/course-notifications-v2/components/in-context/InContextNotification';

import { DeadlineOverdueNotification as DeadlineOverdueNotificationType } from 'bundles/course-notifications-v2/types/CourseNotification';

import { rtlStyle } from 'js/lib/language';
import _t from 'i18n!nls/course-notifications-v2';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

type Props = {
  notification: DeadlineOverdueNotificationType;
};

type State = {
  showModal: boolean;
};

class DeadlineOverdueNotification extends React.Component<Props, State> {
  state: State = {
    showModal: false,
  };

  render() {
    const { showModal } = this.state;

    const {
      notification: {
        definition: {
          courseId,
          sessionEndDateTime,
          isSessionPrivate,
          isPeerReviewOverdue,
          hasEnrollableSession,
          hasUnsubmittedPeerReviews,
        },
      },
    } = this.props;

    const formattedSessionEndDate = formatDateTimeDisplay(sessionEndDateTime, LONG_DATETIME_NO_YEAR_DISPLAY);

    let message;

    if (hasUnsubmittedPeerReviews) {
      if (isPeerReviewOverdue) {
        if (isSessionPrivate) {
          message = _t(
            `This week has assignments that require peer reviews,
            but the class has continued to later weeks. Since you are in a private session,
            please contact your session instructor or administrator for assistance.`
          );
        } else if (hasEnrollableSession) {
          const action = (
            <button
              type="button"
              className="button-link"
              style={rtlStyle({ paddingLeft: '10px' })}
              onClick={() => this.setState({ showModal: true })}
            >
              {_t('Switch Sessions')}
            </button>
          );

          message = (
            <FormattedMessage
              message={_t(`This week has assignments that require peer reviews,
          but the class has continued to later weeks.
          Switch sessions to submit before the new deadline and receive reviews from classmates.
          Your progress will be saved. {action}`)}
              action={action}
            />
          );
        } else {
          message = _t(
            `This week has assignments that require peer reviews,
            but the class has continued to later weeks.
            Please check back for an upcoming session of the course to continue
            with the assignment and get grades on time.`
          );
        }
      } else {
        message = _t(
          `This week has assignments that must be reviewed by peers.
          Please submit as soon as possible or there may not be classmates who can review your work.`
        );
      }
    } else {
      message = (
        <FormattedMessage
          message={_t(
            `{prefix} You can still pass. You need to pass these assignments
            before the end date on {formattedSessionEndDate}`
          )}
          formattedSessionEndDate={formattedSessionEndDate}
          prefix={<strong>{_t('Assignments Overdue:')}</strong>}
        />
      );
    }

    return (
      <div className="rc-DeadlineOverdueNotification">
        <InContextNotification type="warning" trackingName="deadline_overdue_notification" message={message} />
        {showModal && <SessionSwitchModal onClose={() => this.setState({ showModal: false })} courseId={courseId} />}
      </div>
    );
  }
}

export default DeadlineOverdueNotification;
