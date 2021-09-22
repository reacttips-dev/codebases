import React from 'react';
import gql from 'graphql-tag';

import { compose } from 'recompose';

import type CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type OnDemandLearnerSessions from 'bundles/naptimejs/resources/onDemandLearnerSessions.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import buildModelsFromGraphQl from 'bundles/graphql/utils/buildModelsFromGraphQl';
import SessionSwitchBranchChangeInfo from 'bundles/course-sessions/components/SessionSwitchBranchChangeInfo';
import SessionSwitchInfo from 'bundles/course-sessions/components/SessionSwitchInfo';
import SessionSwitchSuccess from 'bundles/course-sessions/components/SessionSwitchSuccess';
import Modal from 'bundles/phoenix/components/Modal';
import CMLUtils from 'bundles/cml/utils/CMLUtils';
import mapProps from 'js/lib/mapProps';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { switchSession, forceEnroll } from 'bundles/course-sessions/utils/onDemandSessionsApi';
import { stringKeyToTuple } from 'js/lib/stringKeyTuple';
import type { OnDemandSessionMembershipsV1Connection } from 'bundles/naptimejs/resources/__generated__/OnDemandSessionMembershipsV1';

import user from 'js/lib/user';
import waitFor from 'js/lib/waitFor';
import waitForGraphQL from 'js/lib/waitForGraphQL';
import _t from 'i18n!nls/course-sessions';
import type { SessionLabel } from '../utils/withSessionLabel';
import withSessionLabel from '../utils/withSessionLabel';

import 'css!bundles/course-sessions/components/__styles__/SessionSwitchModal';

type InputProps = {
  onClose: () => void;
  trackingName?: string;
  courseId: string;
  allowClose?: boolean;
};

type Props = InputProps & {
  courseHomeLink: string;
  refetch: () => void;
  course: CoursesV1;
  upcomingEnrollableSessions: OnDemandLearnerSessions[];
  activeNotEnrollableSession: OnDemandLearnerSessions;
  sessionLabel: SessionLabel;
};

type State = {
  showBranchChangesInfo: boolean;
  showSuccess: boolean;
  sessionToJoin?: OnDemandLearnerSessions;
  enrolledSession?: OnDemandLearnerSessions;
};

class SessionSwitchModal extends React.Component<Props, State> {
  static defaultProps = {
    trackingName: 'session_switch_modal',
  };

  constructor(props: Props, context: any) {
    super(props, context);

    this.state = {
      showBranchChangesInfo: false,
      showSuccess: false,
    };
  }

  handleSessionSwitch = (learnerSession: OnDemandLearnerSessions) => {
    const { activeNotEnrollableSession } = this.props;

    if (activeNotEnrollableSession) {
      switchSession(activeNotEnrollableSession.sessionId, learnerSession.sessionId).then(() => {
        this.setState({
          showBranchChangesInfo: false,
          showSuccess: true,
          enrolledSession: learnerSession,
        });
      });
    } else {
      this.enrollInSession(learnerSession);
    }
  };

  showChangesDescription = (sessionToJoin: OnDemandLearnerSessions) => {
    this.setState({
      showBranchChangesInfo: true,
      showSuccess: false,
      sessionToJoin,
    });
  };

  enrollInSession = (learnerSession: OnDemandLearnerSessions) => {
    const { refetch } = this.props;

    forceEnroll(learnerSession.sessionId)
      .then(() => {
        this.setState({
          showBranchChangesInfo: false,
          showSuccess: true,
          enrolledSession: learnerSession,
        });

        setTimeout(refetch, 0);
      })
      .done();
  };

  render() {
    const {
      sessionLabel,
      courseHomeLink,
      onClose,
      upcomingEnrollableSessions,
      trackingName,
      course,
      allowClose,
    } = this.props;
    const { showBranchChangesInfo, showSuccess, sessionToJoin, enrolledSession } = this.state;

    const showSessionSwitchInfo = !showBranchChangesInfo && !showSuccess;

    return (
      <div className="rc-SessionSwitchModal">
        <Modal
          allowClose={allowClose}
          handleClose={onClose}
          modalName={sessionLabel === 'session' ? _t('Join a new session') : _t('Join a new schedule')}
          trackingName={trackingName}
        >
          {showSessionSwitchInfo && (
            <SessionSwitchInfo
              isSelfServeSession={false}
              courseId={course.id}
              upcomingEnrollableSessions={upcomingEnrollableSessions}
              showChangesDescription={this.showChangesDescription}
              handleSessionSwitch={this.handleSessionSwitch}
            />
          )}

          {showBranchChangesInfo && (
            <SessionSwitchBranchChangeInfo
              sessionToJoin={sessionToJoin}
              handleSessionSwitch={this.handleSessionSwitch}
              changesDescription={CMLUtils.create(
                sessionToJoin.sessionSwitch.changesDescription.cml.value,
                sessionToJoin.sessionSwitch.changesDescription.cml.dtdId
              )}
              courseId={course.id}
            />
          )}

          {showSuccess && (
            <SessionSwitchSuccess
              courseHomeLink={courseHomeLink}
              courseName={course.name}
              courseId={course.id}
              enrolledSession={enrolledSession}
              isSelfServeSession={false}
            />
          )}
        </Modal>
      </div>
    );
  }
}

type GraphQLOutput = {
  OnDemandSessionMembershipsV1Resource: {
    byUserAndCourse: OnDemandSessionMembershipsV1Connection | null;
  };
  CoursesV1Resource: {
    get: CoursesV1;
  };
  OnDemandLearnerSessionsV1Resource: any;
};

type GraphQLInput = {
  courseId: string;
  userId: string;
};

type OutputProps = {
  modalRefetch?: () => void;
  learnerSessions: any[];
  course: CoursesV1;
};

export default compose<Props, InputProps>(
  waitForGraphQL<Props, GraphQLOutput, GraphQLInput, OutputProps>(
    gql`
      query($courseId: String!, $userId: String!) {
        OnDemandLearnerSessionsV1Resource {
          runningAndUpcoming(courseIds: [$courseId], learnerId: $userId, limit: 16) {
            elements {
              id
              startsAt
              endsAt
              enrollmentEndsAt
              enrollmentStartsAt
              isActiveEnrollment
              isEnrollableNow
              sessionSwitch {
                canSwitch
                isRecommendedSwitch
                changesDescription {
                  ... on OnDemandLearnerSessionsV1_cmlMember {
                    cml {
                      dtdId
                      value
                      renderableHtmlWithMetadata {
                        renderableHtml
                      }
                    }
                  }
                }
              }
              isEnrolled
            }
          }
        }
        CoursesV1Resource {
          get(id: $courseId, showHidden: true, includeHiddenS12ns: true, withCorrectBehavior: true) {
            id
            slug
            courseType
            name
          }
        }
        OnDemandSessionMembershipsV1Resource {
          byUserAndCourse(userId: $userId, courseId: $courseId) {
            elements {
              id
              userId
              createdAt
            }
          }
        }
      }
    `,
    {
      options: ({ courseId }) => ({
        variables: {
          courseId,
          userId: user.get().id.toString(),
        },
      }),
      props: ({
        ownProps,
        data: {
          error,
          refetch,
          OnDemandLearnerSessionsV1Resource,
          CoursesV1Resource,
          OnDemandSessionMembershipsV1Resource,
        } = {},
      }) => ({
        ...ownProps,
        error,
        modalRefetch: refetch,
        learnerSessions:
          // TODO (billy) refactor so buildModelsFromGraphQl is not needed
          OnDemandLearnerSessionsV1Resource &&
          buildModelsFromGraphQl(
            OnDemandLearnerSessionsV1Resource.runningAndUpcoming.elements.map((session: any) => ({
              ...session,
              sessionId: stringKeyToTuple(session.id)[1],
            }))
          ),
        course: CoursesV1Resource && buildModelsFromGraphQl(CoursesV1Resource.get),
        sessionMemberships:
          OnDemandSessionMembershipsV1Resource &&
          buildModelsFromGraphQl(
            OnDemandSessionMembershipsV1Resource.byUserAndCourse?.elements?.map((session: any) => ({
              ...session,
              sessionId: stringKeyToTuple(session.id)[1],
            }))
          ),
      }),
    }
  ),
  waitFor(({ learnerSessions, course, error }) => !!learnerSessions && !!course && !error),
  mapProps((props: OutputProps) => {
    const { modalRefetch } = props;
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
      refetch() {
        if (modalRefetch) {
          modalRefetch();
        }
      },
      upcomingEnrollableSessions: sessionsToDisplay,
      // if their active session is still running, we'll need to unenroll them first
      activeNotEnrollableSession: currentSession && currentSession.enrollmentEnded ? currentSession : null,
      courseHomeLink: props.course.phoenixHomeLink,
    };
  }),
  mapProps(({ course: { id: courseId } }: Props) => ({ courseId })),
  withSessionLabel
)(SessionSwitchModal);

export const BaseComp = SessionSwitchModal;
