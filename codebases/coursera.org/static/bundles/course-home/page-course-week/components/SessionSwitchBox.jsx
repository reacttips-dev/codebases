import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'underscore';
import SessionSwitchModal from 'bundles/ondemand/components/sessions/SessionSwitchModal';
import { updateEnrollableAndFollowingSessions } from 'bundles/course-sessions/actions/SessionActions';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import _t from 'i18n!nls/course-home';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import 'css!./__styles__/SessionSwitchBox';

class SessionSwitchBox extends React.Component {
  static propTypes = {
    hasEnded: PropTypes.bool.isRequired,
    followingSession: PropTypes.object,
    enrollableSession: PropTypes.object,
    sessionId: PropTypes.string,
    courseId: PropTypes.string,
    sessionDates: PropTypes.string,
    isSessionPrivate: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  state = {
    showModal: false,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      showModal: false,
    };
  }

  componentDidMount() {
    if (!this.props.followingSession) {
      this.context.executeAction(updateEnrollableAndFollowingSessions, {
        courseId: this.props.courseId,
        sessionId: this.props.sessionId,
      });
    }
  }

  handleClose = () => {
    this.setState({ showModal: false });
  };

  showModal = () => {
    this.setState({ showModal: true });
  };

  render() {
    const { enrollableSession, followingSession, sessionDates, isSessionPrivate } = this.props;

    if (!enrollableSession) {
      return <div />;
    }

    return (
      <div className="rc-EnrollBox rc-SessionSwitchBox">
        <div className="current-session card-rich-interaction od-container cozy">
          <span className="caption-text color-secondary-text">{_t("You're currently enrolled in this session:")}</span>
          <span className="current-session-dates caption-text color-secondary-text">{sessionDates}</span>
        </div>
        {!isSessionPrivate && (
          <div className="upcoming-session od-container cozy styleguide theme-dark">
            <p className="color-primary-text">{_t('Upcoming session:')}</p>
            <h3 className="headline-2-text upcoming-session-dates color-primary-text">
              <span className="session-date">{enrollableSession.getStartDate()}</span>
              {' - '}
              <span className="session-date">{enrollableSession.getEndDate()}</span>
            </h3>
            <div className="button-container">
              <button className="primary" onClick={this.showModal}>
                {_t('Switch sessions')}
              </button>
            </div>
          </div>
        )}
        {!isSessionPrivate && followingSession && (
          <div className="following-session card-rich-interaction">
            <span className="caption-text color-secondary-text">
              <FormattedMessage
                message={_t('Following session begins {startDate}')}
                startDate={followingSession.getStartDate()}
              />
            </span>
          </div>
        )}
        {this.state.showModal && <SessionSwitchModal onClose={this.handleClose} courseId={this.props.courseId} />}
      </div>
    );
  }
}

export default compose(
  connectToStores(['CourseStore', 'SessionStore'], ({ CourseStore, SessionStore }) => {
    return {
      followingSession: SessionStore.getFollowingSession(),
      enrollableSession: SessionStore.getEnrollableSession(),
      courseId: CourseStore.getCourseId(),
      sessionId: SessionStore.getSessionId(),
      sessionDates: SessionStore.getSessionDates(),
      isSessionPrivate: SessionStore.isSessionPrivate(),
    };
  })
)(SessionSwitchBox);
