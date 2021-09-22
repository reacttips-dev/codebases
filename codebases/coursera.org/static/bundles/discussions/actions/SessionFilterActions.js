import Q from 'q';
import URI from 'jsuri';
import sessionsApi from 'bundles/discussions/api/sessions';
import courseBranchApi from 'bundles/discussions/api/courseBranchModerationApi';

export const loadSessionsForCourse = (
  actionContext,
  { courseId, currentSessionId, isPrivateSession = false },
  done
) => {
  const sessionsApiUri = new URI()
    .addQueryParam('q', 'allByCourse')
    .addQueryParam('courseId', courseId)
    .addQueryParam('includeExternallyManaged', false)
    .addQueryParam('fields', 'moduleDeadlines,branchId')
    .toString();

  const courseBranchApiUri = new URI()
    .addQueryParam('q', 'course')
    .addQueryParam('courseId', courseId)
    .addQueryParam('fields', 'authoringName')
    .toString();

  const promise = Q.all([sessionsApi.get(sessionsApiUri), courseBranchApi.get(courseBranchApiUri)]).spread(
    (sessionsResponse, courseBranchResponse) => {
      actionContext.dispatch('LOAD_SESSIONS_DATA', {
        sessions: sessionsResponse.elements,
        courseBranches: courseBranchResponse.elements,
        courseId,
        currentSessionId,
        isPrivateSession,
      });
    }
  );

  promise.done(() => done());
};

// non-priveleged users do not need to load these APIs.
export const loadSessionsForUnprivileged = (
  actionContext,
  { courseId, currentSessionId, isPrivateSession = false }
) => {
  actionContext.dispatch('LOAD_SESSIONS_DATA_UNPRIVILEGED', {
    sessions: [],
    courseBranches: [],
    courseId,
    currentSessionId,
    isPrivateSession,
  });
};

export const selectSession = (actionContext, { sessionId }, done) => {
  actionContext.dispatch('SELECT_SESSION', { sessionId });
};

export const selectOnDemand = (actionContext, { sessionId }, done) => {
  actionContext.dispatch('SELECT_ON_DEMAND', {});
};

export const selectAll = (actionContext, { sessionId, branchId }, done) => {
  actionContext.dispatch('SELECT_SHOW_ALL', { branchId });
};
