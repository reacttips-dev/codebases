import React from 'react';
import moment from 'moment';
import ToolbarBox from 'bundles/preview/components/ToolbarBox';
import PillPrivate from 'bundles/preview/components/pills/PillPrivate';
import SessionStatusPill from 'bundles/authoring/sessions/components/SessionStatusPill';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import OnDemandSessionsV1 from 'bundles/naptimejs/resources/onDemandSessions.v1';
import OpenCourseMembershipsV1 from 'bundles/naptimejs/resources/openCourseMemberships.v1';

import 'css!bundles/preview/components/__styles__/EnrolledSession';

type Props = {
  session?: OnDemandSessionsV1;
  courseMembership?: OpenCourseMembershipsV1;
};

const Wrapped: React.SFC<{}> = ({ children }) => <ToolbarBox className="rc-EnrolledSession">{children}</ToolbarBox>;

const EnrolledSession = ({ session, courseMembership }: Props) => {
  if (!courseMembership) {
    return <Wrapped>Not enrolled</Wrapped>;
  } else if (!session) {
    return <Wrapped>No session selected</Wrapped>;
  }

  const { startedAt, endedAt, enrollmentEndedAt } = session;

  return (
    <ToolbarBox className="rc-EnrolledSession">
      <span>{session.displayName}</span>
      {session.isPrivate && <PillPrivate />}
      <SessionStatusPill
        startedAt={moment(startedAt)}
        enrollmentEndedAt={moment(enrollmentEndedAt)}
        endedAt={moment(endedAt)}
        noMinWidth={true}
      />
    </ToolbarBox>
  );
};

export default EnrolledSession;
