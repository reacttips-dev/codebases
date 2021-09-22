import React from 'react';
import gql from 'graphql-tag';

import { compose } from 'recompose';

import user from 'js/lib/user';
import Naptime from 'bundles/naptimejs';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import SessionsV1 from 'bundles/naptimejs/resources/onDemandSessions.v1';
import waitForGraphQL from 'js/lib/waitForGraphQL';

import {
  OnDemandSessionMembershipsV1,
  OnDemandSessionMembershipsV1ActiveByUserAndCourseQuery,
  OnDemandSessionMembershipsV1ActiveByUserAndCourseQueryVariables,
} from 'bundles/naptimejs/resources/__generated__/OnDemandSessionMembershipsV1';

import { OnDemandSessionsV1 } from 'bundles/naptimejs/resources/__generated__/OnDemandSessionsV1';

const getSessionsMembershipsQuery = gql`
  query GetSessionMemberships($courseId: String!, $userId: String!) {
    OnDemandSessionMembershipsV1 @naptime {
      activeByUserAndCourse(courseId: $courseId, userId: $userId) {
        elements {
          id
          createdAt
          sessionId
          userId
        }
      }
    }
  }
`;

const getSessionQuery = gql`
  query GetSession($id: String!) {
    OnDemandSessionsV1 @naptime {
      get(id: $id) {
        courseId
        id
        branchId
        startedAt
        endedAt
        isPrivate
      }
    }
  }
`;

type InputProps = {
  courseId: string;
};

type Props = InputProps & {
  currentSession: OnDemandSessionsV1 | null;
};

export default <PropsFromCaller extends InputProps>(
  PassedComponent: React.ComponentType<Props & PropsFromCaller>
): React.ComponentType<PropsFromCaller> =>
  compose<Props & PropsFromCaller, PropsFromCaller>(
    waitForGraphQL<
      PropsFromCaller,
      OnDemandSessionMembershipsV1ActiveByUserAndCourseQuery,
      OnDemandSessionMembershipsV1ActiveByUserAndCourseQueryVariables,
      PropsFromCaller & { sessionMembership: OnDemandSessionMembershipsV1 | null }
    >(getSessionsMembershipsQuery, {
      options: ({ courseId }) => ({
        variables: {
          courseId,
          userId: user.get().id.toString(),
        },
      }),
      props: ({ ownProps, data }) => ({
        ...ownProps,
        sessionMembership: data?.OnDemandSessionMembershipsV1?.activeByUserAndCourse?.elements?.[0] ?? null,
      }),
    }),
    Naptime.createContainer(({ sessionMembership }: any) => {
      const sessionId = sessionMembership?.sessionId;
      return {
        currentSession: sessionId
          ? SessionsV1.get(sessionId, {
              fields: ['courseId', 'branchId', 'startedAt', 'endedAt', 'isPrivate'],
            })
          : null,
      };
    })
  )(PassedComponent);
