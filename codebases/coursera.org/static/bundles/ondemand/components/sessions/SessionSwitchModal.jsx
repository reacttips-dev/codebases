import Naptime from 'bundles/naptimejs';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import onDemandLearnerSessions from 'bundles/naptimejs/resources/onDemandLearnerSessions.v1';
import NaptimeStore from 'bundles/naptimejs/stores/NaptimeStore';
import SessionSwitchBranchChangeInfo from 'bundles/course-sessions/components/SessionSwitchBranchChangeInfo';
import SessionSwitchInfo from 'bundles/course-sessions/components/SessionSwitchInfo';
import SessionSwitchSuccess from 'bundles/course-sessions/components/SessionSwitchSuccess';
import { forceEnroll, switchSession } from 'bundles/course-sessions/utils/onDemandSessionsApi';
import Modal from 'bundles/phoenix/components/Modal';
import user from 'js/lib/user';
import ApplicationStore from 'bundles/ssr/stores/ApplicationStore';
import OnDemandSessionMembershipsV1 from 'bundles/naptimejs/resources/onDemandSessionMemberships.v1';
import mapProps from 'js/lib/mapProps';
import setupFluxibleApp from 'js/lib/setupFluxibleApp';
import waitFor from 'js/lib/waitFor';
import _t from 'i18n!nls/ondemand';
import FluxibleComponent from 'vendor/cnpm/fluxible.v0-4/addons/FluxibleComponent';
import 'css!./__styles__/SessionSwitchModal';

class SessionSwitchModal extends React.Component {
  static propTypes = {
    course: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    courseHomeLink: PropTypes.string.isRequired,
    upcomingEnrollableSessions: PropTypes.arrayOf(PropTypes.instanceOf(onDemandLearnerSessions)).isRequired,
    naptime: PropTypes.instanceOf(Naptime.NaptimeProp).isRequired,
    activeNotEnrollableSession: PropTypes.instanceOf(onDemandLearnerSessions),
    trackingName: PropTypes.string,
  };

  static contextTypes = {
    getStore: PropTypes.func.isRequired,
  };

  static defaultProps = {
    trackingName: 'session_switch_modal',
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      showBranchChangesInfo: false,
      showSuccess: false,
    };
  }

  handleSessionSwitch = (learnerSession) => {
    const { activeNotEnrollableSession, naptime } = this.props;

    if (activeNotEnrollableSession) {
      switchSession(activeNotEnrollableSession.sessionId, learnerSession.sessionId).then(() => {
        this.setState({
          showBranchChangesInfo: false,
          showSuccess: true,
          enrolledSession: learnerSession,
        });

        naptime.refreshData({
          resources: [
            'onDemandLearnerSessions.v1',
            'onDemandSessions.v1',

            // Memberships
            'onDemandSessionMemberships.v1',
            'memberships.v1',

            // GLE resources.
            'onDemandGuidedNextSteps.v1',

            'onDemandLearnerMaterials.v1',
            'onDemandLearnerMaterialWeeks.v1',
          ],
        });
      });
    } else {
      this.enrollInSession(learnerSession);
    }
  };

  showChangesDescription = (sessionToJoin) => {
    this.setState({
      showBranchChangesInfo: true,
      showSuccess: false,
      sessionToJoin,
    });
  };

  enrollInSession = (learnerSession) => {
    const { naptime } = this.props;

    forceEnroll(learnerSession.sessionId)
      .then(() => {
        this.setState({
          showBranchChangesInfo: false,
          showSuccess: true,
          enrolledSession: learnerSession,
        });

        naptime.refreshData({
          resources: [
            'onDemandLearnerSessions.v1',
            'onDemandSessions.v1',

            // Memberships
            'onDemandSessionMemberships.v1',
            'memberships.v1',

            // GLE resources.
            'onDemandGuidedNextSteps.v1',

            'onDemandLearnerMaterials.v1',
            'onDemandLearnerMaterialWeeks.v1',
          ],
        });
      })
      .done();
  };

  render() {
    const { courseHomeLink, onClose, upcomingEnrollableSessions, trackingName, course } = this.props;
    const { showBranchChangesInfo, showSuccess, sessionToJoin, enrolledSession } = this.state;
    const showSessionSwitchInfo = !showBranchChangesInfo && !showSuccess;

    return (
      <div className="rc-SessionSwitchModal">
        <Modal handleClose={onClose} modalName={_t('Join a new session')} trackingName={trackingName}>
          {showSessionSwitchInfo && (
            <SessionSwitchInfo
              upcomingEnrollableSessions={upcomingEnrollableSessions}
              showChangesDescription={this.showChangesDescription}
              handleSessionSwitch={this.handleSessionSwitch}
            />
          )}

          {showBranchChangesInfo && (
            <SessionSwitchBranchChangeInfo
              sessionToJoin={sessionToJoin}
              handleSessionSwitch={this.handleSessionSwitch}
              changesDescription={sessionToJoin.sessionSwitch.changesDescription}
              courseId={course.id}
            />
          )}

          {showSuccess && (
            <SessionSwitchSuccess
              courseHomeLink={courseHomeLink}
              courseName={course.name}
              enrolledSession={enrolledSession}
            />
          )}
        </Modal>
      </div>
    );
  }
}

const SessionSwitchModalWithData = _.flowRight(
  Naptime.createContainer((props) => {
    return {
      learnerSessions: onDemandLearnerSessions.finder('runningAndUpcoming', {
        params: {
          courseIds: props.courseId,
          learnerId: user.get().id,
          // Requesting 16 sessions as that should be enough to populate the list with at least 4 joinable sessions
          // TODO(Jason): talking with jeff to see if theres a better solution on backend to send back the 4 we need
          limit: 16,
        },
        fields: [
          'startsAt',
          'endsAt',
          'enrollmentEndsAt',
          'enrollmentStartsAt',
          'isActiveEnrollment',
          'isEnrollableNow',
          'sessionSwitch',
          'isEnrolled',
        ],
      }),
      course: CoursesV1.get(props.courseId, {
        params: {
          showHidden: true,
        },
      }),
      sessionMemberships: OnDemandSessionMembershipsV1.finder('byUserAndCourse', {
        params: {
          userId: user.get().id,
          courseId: props.courseId,
        },
      }),
    };
  }),
  waitFor((props, context) => !!props.learnerSessions && !!props.course),
  mapProps((props) => {
    const currentSession = props.learnerSessions.find((session) => session.isActiveEnrollment);

    let sessionsToDisplay;
    const recommendedIndex = props.learnerSessions.findIndex((session) => session.sessionSwitch.isRecommendedSwitch);
    if (recommendedIndex === -1) {
      // take recommended, plus 3 whose enrollment is not yet open
      sessionsToDisplay = props.learnerSessions
        .filter((session) => session.sessionSwitch.isRecommendedSwitch || !session.enrollmentStarted)
        .slice(0, 3);
    } else {
      // take recommended plus next 4
      sessionsToDisplay = props.learnerSessions.slice(recommendedIndex, recommendedIndex + 4);
    }

    return {
      upcomingEnrollableSessions: sessionsToDisplay,
      // if their active session is still running, we'll need to unenroll them first
      activeNotEnrollableSession: currentSession && currentSession.enrollmentEnded ? currentSession : null,
      courseHomeLink: props.course.phoenixHomeLink,
    };
  })
)(SessionSwitchModal);

const setupApp = (fluxibleContext) =>
  setupFluxibleApp(fluxibleContext, (app) => {
    app.registerStore(NaptimeStore);
    app.registerStore(ApplicationStore);

    return fluxibleContext;
  });

export default class FluxifiedSessionSwitchModal extends React.Component {
  static contextTypes = {
    fluxibleContext: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.fluxibleContext = setupApp(context.fluxibleContext);
  }

  render() {
    return (
      <FluxibleComponent context={this.fluxibleContext.getComponentContext()}>
        <SessionSwitchModalWithData {...this.props} />
      </FluxibleComponent>
    );
  }
}
