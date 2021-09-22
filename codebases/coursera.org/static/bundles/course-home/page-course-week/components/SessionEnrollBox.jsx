import PropTypes from 'prop-types';
import React from 'react';
import user from 'js/lib/user';
import classNames from 'classnames';
import EnrollButton from 'bundles/ondemand/components/enrollButton/EnrollButton';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';
import { getPriceForVC } from 'bundles/payments/promises/productPrices';
import { updateEnrollableAndFollowingSessions } from 'bundles/course-sessions/actions/SessionActions';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import _t from 'i18n!nls/course-home';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import 'css!./__styles__/SessionEnrollBox';

class SessionEnrollBox extends React.Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
    hasS12nLoaded: PropTypes.bool.isRequired,
    isCapstone: PropTypes.bool,
    isEligibleForCapstone: PropTypes.bool,
    isTakingS12n: PropTypes.bool,
    ownsS12nCourse: PropTypes.bool,
    sessionId: PropTypes.string,
    courseId: PropTypes.string,
    timeUntilStart: PropTypes.string,
    enrollmentEndDate: PropTypes.object,
    isPreviewMode: PropTypes.bool,
    endDate: PropTypes.object,
    startDate: PropTypes.object,
    isUpcoming: PropTypes.bool,
    isEnrolled: PropTypes.bool,
    followingSession: PropTypes.object,
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  state = {
    price: null,
  };

  componentDidMount() {
    if (!this.props.followingSession) {
      this.context.executeAction(updateEnrollableAndFollowingSessions, {
        courseId: this.props.courseId,
        sessionId: this.props.sessionId,
      });
    }
    if (this.props.isTakingS12n && !this.props.ownsS12nCourse) {
      this.loadPrice();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isTakingS12n && !nextProps.ownsS12nCourse) {
      this.loadPrice();
    }
  }

  loadPrice() {
    const { courseId } = this.props;

    getPriceForVC({ courseId })
      .then((price) => this.setState({ price }))
      .done();
  }

  renderFollowingSession() {
    return (
      <div className="following-session card-no-action primary">
        <p className="color-secondary-text">
          <FormattedMessage
            message={_t('Following session begins {startDate}')}
            startDate={this.props.followingSession.getStartDate()}
          />
        </p>
      </div>
    );
  }

  render() {
    if (!this.props.hasS12nLoaded) {
      return null;
    }

    const { isCapstone, isEligibleForCapstone, ownsS12nCourse, startDate, endDate, timeUntilStart } = this.props;
    const { isPreviewMode, sessionId, enrollmentEndDate, isUpcoming, followingSession } = this.props;
    // For normal courses, display the enroll button if the user is not yet enrolled or is logged out.
    // For capstones, display the enroll button only if they are eligible and not yet enrolled.
    const eligibleForCapstone = isEligibleForCapstone && ownsS12nCourse;
    const canEnroll =
      (!isCapstone && !user.isAuthenticatedUser()) || (!this.state.isEnrolled && (!isCapstone || eligibleForCapstone));

    const boxClassnames = classNames('cozy', 'od-container', 'styleguide', 'primary-enroll-box', {
      'theme-dark': canEnroll,
      'card-rich-interaction': !canEnroll,
    });

    return (
      <div>
        <div className="rc-EnrollBox rc-SessionEnrollBox">
          <div className={boxClassnames}>
            <p className="color-primary-text">{isUpcoming ? _t('Upcoming session:') : _t('Current session:')}</p>
            <h3 className="headline-2-text session-dates color-primary-text">
              <span className="session-date">{startDate}</span>
              {' - '}
              <span className="session-date">{endDate}</span>
            </h3>
            {this.state.price && (
              <h3 className="color-primary-text">
                <ReactPriceDisplay
                  value={this.state.price.getDisplayAmount()}
                  currency={this.state.price.getDisplayCurrencyCode()}
                />
              </h3>
            )}
            {isPreviewMode && !(isCapstone && !isEligibleForCapstone) && (
              <div className="align-right button-container">
                <p className="color-secondary-text">
                  {canEnroll ? (
                    <FormattedMessage
                      message={_t('Enrollment ends {enrollmentEndDate}')}
                      enrollmentEndDate={enrollmentEndDate}
                    />
                  ) : (
                    <FormattedMessage
                      message={_t('{timeUntilStart} until session begins')}
                      timeUntilStart={timeUntilStart}
                    />
                  )}
                </p>

                <EnrollButton ref="enrollButton" sessionId={sessionId} />
              </div>
            )}
          </div>
          {canEnroll && followingSession && this.renderFollowingSession()}
        </div>
      </div>
    );
  }
}

export default connectToStores(
  SessionEnrollBox,
  ['CourseStore', 'S12nStore', 'SessionStore'],
  ({ CourseStore, S12nStore, SessionStore }, props) => {
    const s12n = S12nStore.getS12n();
    const courseId = CourseStore.getCourseId();

    return {
      courseId,
      hasS12nLoaded: S12nStore.hasLoaded(),
      isCapstone: s12n && s12n.isCapstone(courseId),
      isEligibleForCapstone: s12n && s12n.isEligibleForCapstone(),
      isTakingS12n: s12n && s12n.isTakingS12n(),
      ownsS12nCourse: s12n && s12n.ownsCourse(courseId),
      sessionId: SessionStore.getSessionId(),
      courseId: CourseStore.getCourseId(),
      timeUntilStart: SessionStore.getTimeUntilStart(),
      enrollmentEndDate: SessionStore.getEnrollmentEndDate(),
      isPreviewMode: SessionStore.isPreviewMode(),
      endDate: SessionStore.getEndDate(),
      startDate: SessionStore.getStartDate(),
      isUpcoming: SessionStore.isUpcoming(),
      isEnrolled: SessionStore.isEnrolled(),
      followingSession: SessionStore.getFollowingSession(),
    };
  }
);

export const BaseComp = SessionEnrollBox;
