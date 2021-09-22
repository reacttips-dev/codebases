import gql from 'graphql-tag';

import PropTypes from 'prop-types';

import React from 'react';
import _ from 'lodash';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import buildModelsFromGraphQl from 'bundles/graphql/utils/buildModelsFromGraphQl';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import onDemandSessions from 'bundles/naptimejs/resources/onDemandSessions.v1';
import SessionSwitchInfo from 'bundles/course-sessions/components/SessionSwitchInfo';
import SessionSwitchSuccess from 'bundles/course-sessions/components/SessionSwitchSuccess';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { forceEnroll } from 'bundles/course-sessions/utils/onDemandSessionsApi';
import Modal from 'bundles/phoenix/components/Modal';
import mapProps from 'js/lib/mapProps';
import user from 'js/lib/user';
import waitFor from 'js/lib/waitFor';
import waitForGraphQL from 'js/lib/waitForGraphQL';
import _t from 'i18n!nls/course-sessions';
import 'css!bundles/course-sessions/components/__styles__/SessionSwitchModal';
import { QueryResult } from 'react-apollo';
import { ApolloError } from 'apollo-client';

type Props = {
  course: CoursesV1;
  onClose?: (x0?: any) => void;
  courseHomeLink: string;
  upcomingEnrollableSessions: Array<onDemandSessions>;
  trackingName?: string;
  allowClose?: boolean;
};

type State = {
  showSuccess: boolean;
  enrolledSession?: onDemandSessions;
};

class SessionJoinModal extends React.Component<Props, State> {
  static contextTypes = {
    getStore: PropTypes.func.isRequired,
  };

  static defaultProps = {
    trackingName: 'session_switch_modal',
  };

  state = {
    showSuccess: false,
    enrolledSession: undefined,
  };

  handleSessionSwitch = (learnerSession: onDemandSessions) => {
    this.enrollInSession(learnerSession);
  };

  enrollInSession = (learnerSession: onDemandSessions) => {
    forceEnroll(learnerSession.sessionId)
      .then(() => {
        this.setState({
          showSuccess: true,
          enrolledSession: learnerSession,
        });
      })
      .done();
  };

  render() {
    const { courseHomeLink, onClose, upcomingEnrollableSessions, trackingName, course, allowClose } = this.props;

    const { showSuccess, enrolledSession } = this.state;

    const showSessionSwitchInfo = !showSuccess;

    return (
      <div className="rc-SessionSwitchModal">
        <Modal
          allowClose={allowClose}
          handleClose={onClose}
          modalName={_t('Pick a session')}
          trackingName={trackingName}
        >
          {showSessionSwitchInfo && (
            <SessionSwitchInfo
              upcomingEnrollableSessions={upcomingEnrollableSessions}
              handleSessionSwitch={this.handleSessionSwitch}
              isSelfServeSession={true}
              courseId={course.id}
            />
          )}
          {showSuccess && (
            <SessionSwitchSuccess
              courseHomeLink={courseHomeLink}
              courseId={course.id}
              courseName={course.name}
              enrolledSession={enrolledSession}
              isSelfServeSession={true}
            />
          )}
        </Modal>
      </div>
    );
  }
}

type SessionJoinModalQueryType = {
  OnDemandSessionsV1Resource?: {
    nextEnrollableSessionsByUserAndCourse: {
      elements: onDemandSessions[];
    };
  };
  CoursesV1Resource?: {
    get: any;
  };
};

type ExternalProps = {
  courseId: string;
};
type VariablesForGraphQLQuery = {
  courseId: string;
  userId: string;
};
type DataFromGraphQL = {
  error?: ApolloError;
  learnerSessions: onDemandSessions[];
  course: {
    phoenixHomeLink: string;
  };
};

export default _.flowRight(
  waitForGraphQL<ExternalProps, SessionJoinModalQueryType, VariablesForGraphQLQuery, DataFromGraphQL>(
    gql`
      query($courseId: String!, $userId: String!) {
        OnDemandSessionsV1Resource {
          nextEnrollableSessionsByUserAndCourse(courseId: $courseId, userId: $userId, limit: 3) {
            elements {
              id
              startedAt
              endedAt
              enrollmentEndedAt
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
      }
    `,
    {
      options: ({ courseId }) => ({
        variables: {
          courseId,
          userId: user.get().id.toString(),
        },
      }),
      props: ({ data }) => ({
        error: data?.error,
        learnerSessions:
          data?.OnDemandSessionsV1Resource &&
          buildModelsFromGraphQl(
            data.OnDemandSessionsV1Resource.nextEnrollableSessionsByUserAndCourse.elements.map(
              (session: onDemandSessions) => ({
                ...session,
                sessionId: session.id,
              })
            )
          ),
        course: data?.CoursesV1Resource && buildModelsFromGraphQl(data.CoursesV1Resource.get),
      }),
    }
  ),
  waitFor(({ learnerSessions, course, error }: DataFromGraphQL) => !!learnerSessions && !!course && !error),
  mapProps((props: DataFromGraphQL) => {
    return {
      upcomingEnrollableSessions: props.learnerSessions,
      courseHomeLink: props.course.phoenixHomeLink,
    };
  })
)(SessionJoinModal);
