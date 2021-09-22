import { stringKeyToTuple } from 'js/lib/stringKeyTuple';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import OnDemandSessionsV1 from 'bundles/naptimejs/resources/onDemandSessions.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import Groups from 'bundles/naptimejs/resources/groups.v1';

export const getSessionScopedGroups = (session: OnDemandSessionsV1 | null, groups: Array<Groups>): Array<Groups> => {
  if (!session) {
    return groups;
  }

  const sessionId = session.id;

  return groups.filter((group) => {
    const { name, id } = group.definition.scopeId;
    const groupSessionId = stringKeyToTuple(id)[1];
    return name === 'session' && groupSessionId === sessionId;
  });
};
