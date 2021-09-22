import type {
  AuthoringCourseContext,
  ContextMap,
  ContextWithCreationContextMap,
  SessionGroupContext,
} from 'bundles/authoring/common/types/authoringCourseContexts';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type OnDemandSessionsV1 from 'bundles/naptimejs/resources/onDemandSessions.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type AuthoringBranchProperties from 'bundles/naptimejs/resources/authoringBranchProperties.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type Groups from 'bundles/naptimejs/resources/groups.v1';
import { authoringCourseContextTypes } from 'bundles/authoring/common/constants/authoringCourseContexts';
import { stringKeyToTuple } from 'js/lib/stringKeyTuple';
import { getContextByEscapedContextId, isPrivateContext } from 'bundles/authoring/course-level/utils/contextUtils';
import { isContextBasedVaLEnabled } from 'bundles/preview/utils/epicCheck';
import { getShouldLoadRaven } from 'js/lib/sentry';
import raven from 'raven-js';

/**
 * given the raw context map and an array of context ids fetched from the BE, return the course contexts that
 * are matched with the context ids and the context map with keys without typeNames
 * @param {ContextWithCreationContextMap} rawContextMap the context map fetched from BE (using authoringCourseContexts.v1), with typeNames in the keys (e.g. "publicBranchContext~authoringBranch!~6gKQGiRnEeuxmQ78CaFjhQ")
 * @param {Array<string>} contextIds an array of context ids (also with typeNames in the prefix)
 * @returns {object} an object that includes the processed contexts and context map
 */
export const getContextsAndContextMapByEscapedContextId = (
  rawContextMap: ContextWithCreationContextMap,
  contextIds: Array<string>
): {
  courseContexts: Array<AuthoringCourseContext>;
  contextMapWithEscapedContextId: ContextMap;
} => {
  // return empty array and object if the outside the EPIC or input is empty
  if (!isContextBasedVaLEnabled() || contextIds.length === 0 || Object.keys(rawContextMap).length === 0) {
    return { courseContexts: [], contextMapWithEscapedContextId: {} };
  }
  const contextValues = Object.values(rawContextMap).filter((context) => context?.typeName);
  const contextMapWithEscapedContextId = contextIds.reduce((mapObject, currContextId) => {
    // get the escaped context id (i.e. the context id we actually use for a course context in the context-level pages in /teach )
    const escapedContextId = stringKeyToTuple(currContextId)[1];
    const matchedContext = getContextByEscapedContextId(escapedContextId, contextValues);
    // skip if the matchedContext is not found or it is a session creation job context
    return !!matchedContext && matchedContext.typeName !== authoringCourseContextTypes.SESSION_GROUP_CREATION_JOB
      ? {
          ...mapObject,
          [escapedContextId]: matchedContext,
        }
      : mapObject;
  }, {});
  return { courseContexts: Object.values(contextMapWithEscapedContextId), contextMapWithEscapedContextId };
};

/**
 * for the view as learner feature, given the enrolled session, group(s), and branch, find the corresponding course context
 * @param {ContextMap} contextMap a context map with keys also processed (without typeName in the prefix)
 * @param {Array<AuthoringCourseContext>} contexts an array of contexts
 * @param {AuthoringBranchProperties} branch the branch associated with the enrolled session (fetched based on the view as learner endpoint)
 * @param {Array<Groups>} enrolledGroups an array of enrolled groups (fetched based on the view as learner endpoint)
 * @param {OnDemandSessionsV1 | undefined} enrolledSession the enrolled session for the current user (fetched based on the view as learner endpoint)
 * @returns {AuthoringCourseContext} the corresponding course context
 */
export const getMatchedContextFromEnrolledGroupOrSession = (
  contextMap: ContextMap,
  contexts: Array<AuthoringCourseContext>,
  branch: AuthoringBranchProperties,
  enrolledGroups: Array<Groups>,
  enrolledSession?: OnDemandSessionsV1
): AuthoringCourseContext => {
  let potentialContextId = '';
  let foundActualContextId = false;
  let matchedContext;
  const sessionId = enrolledSession?.id;

  // if there are enrolledGroups returned from BE
  if (enrolledGroups.length > 0) {
    if (enrolledGroups.length === 1) {
      // if just one group, there its group id will be the context id
      // otherwise, we need to find the context using the enrolled session
      potentialContextId = enrolledGroups[0].id;
      foundActualContextId = true;
    }
  } else {
    // if there are no enrolled groups returned from BE, then the context could be a sessionGroupContext, a publicBranchContext, or a privateBranchContext
    // so we need to try both
    // 1. searching for the context using the session id
    // AND
    // 2. finding the context using the branch id as the context id
    potentialContextId = branch.id;
  }

  // find all the session group contexts
  const sessionGroupContexts = contexts.filter(
    (context) => context.typeName === authoringCourseContextTypes.SESSION_GROUP
  );

  // find the course context associated with the session id of the enrolled session
  // there should be at most one course context associated with each session
  const contextMappedFromSessionId = sessionGroupContexts.find(
    (context) => (context as SessionGroupContext).definition.sessionId === sessionId
  );

  const contextFoundFromPotentialContextId = contextMap[potentialContextId] as AuthoringCourseContext | undefined;

  if (foundActualContextId) {
    // if the actual context id is found (the case of only one enrolled group present)
    // return the context associated with that context id, if it can be found in the context map
    // otherwise, return the context mapped using the session id
    matchedContext = contextFoundFromPotentialContextId ?? contextMappedFromSessionId;
  } else {
    // if the actual id is not found, then the corresponding context could be a branch context or a session group context
    // we should try returning the context mapped from the session id if possible,
    // because the branch context with the branch id as the context id could also be present
    // in the context map (but the session group context could be attached to the branch)
    // if there is no context associated with the session id, then we return the context found with the branch id
    // the context could possibly be found from the context map by using the branch id as the context id
    // or checking the authoring branch id of each course context (should only be used for the corner case when no enrolled session or group available)
    matchedContext = contextMappedFromSessionId ?? contextFoundFromPotentialContextId;

    if (!matchedContext) {
      // if the context cannot be found using session id or context map
      // then try finding the contexts that have the same branch id and pick the most "recent" one
      // this may happen if the user do a course-level "View as learner" on a newly created course before doing any context-level "View as learner"
      const publicContextsWithSameBranchId = contexts.filter(
        (context) =>
          context.typeName === authoringCourseContextTypes.PUBLIC_BRANCH &&
          context.definition.authoringCourseBranchId === branch.id
      );
      const privateContextsWithSameBranchId = contexts.filter(
        (context) => isPrivateContext(context.typeName) && context.definition.authoringCourseBranchId === branch.id
      );

      let contextMappedFromBranchId;
      if (privateContextsWithSameBranchId.length > 0) {
        // if there are private contexts with the same branch id found,
        // we don't need to check for public contexts with the same branch id
        // because if there is one, it must be created before the private ones
        // so that the private ones can be created by attaching to it
        // use the first private context returned, because it is usually the most recent one
        contextMappedFromBranchId = privateContextsWithSameBranchId[0];
      } else if (publicContextsWithSameBranchId.length > 0) {
        // if there are no private contexts found, use the public one if it is found
        contextMappedFromBranchId = publicContextsWithSameBranchId[0];
      }

      matchedContext = contextMappedFromBranchId;
    }
  }

  if (!matchedContext) {
    // throw a sentry error if if no matched context is found (should be rare case)
    if (getShouldLoadRaven()) {
      raven.captureException(new Error('Context-based VaL cannot find the corresponding course context'), {
        tags: {
          product: 'context-based-val', // use this tag for alert
        },
        extra: {
          message: 'the corresponding course context cannot be found based on the enrolled version, session, or group',
        },
      });
    }
    // use the first context in the array as the fallback
    return contexts[0];
  } else {
    return matchedContext;
  }
};

/**
 * determines whether to show enrolled group information for a course context
 * only parse the input branchesSessionsGroups if the course context is a session group context
 * the logic of parsing branchesSessionsGroups is essentially the same as the combined logic of RECEIVE_BRANCH_SELECTION and RECEIVE_SESSION_SELECTION in ChangeViewSettingsModalStore
 * @param {AuthoringCourseContext} context a course context
 * @param branchesSessionsGroups an array of branches, each branch contains an array of associated sessions, and each session contains an array of groups, fetched from initializeCourseApp and feed into ChangeViewSettingsModalStore
 * @returns {boolean} whether to show the enrolled group information for the context, only true if the context is a sessiong group context and there are more than one attached unarchived groups
 */
export const showGroupInformationForEnrolledContext = (
  context: AuthoringCourseContext,
  branchesSessionsGroups: Array<$TSFixMe>
): boolean => {
  let showGroupInformation;
  if (context.typeName === authoringCourseContextTypes.SESSION_GROUP) {
    // find the branch that using the branch id of the context
    // essentially the same logic as RECEIVE_BRANCH_SELECTION in ChangeViewSettingsModalStore
    const matchedBranch = branchesSessionsGroups.find(
      (branch) => branch.id === context.definition.authoringCourseBranchId
    );

    // if the matched branch is not found, return false before move forward with sessions
    if (!matchedBranch) {
      return false;
    }

    // find the session using the session id of the context
    // essentially the same logic of calling RECEIVE_SESSION_SELECTION with a session id in ChangeViewSettingsModalStore
    const matchedSession = (matchedBranch.associatedSessionsList as Array<$TSFixMe>).find(
      (session) => session.id === context.definition.sessionId
    );

    // if the matched session is not found, return false before move forward with groups
    if (!matchedSession) {
      return false;
    }

    // find the attached unarchived groups
    // essentially the same logic as refreshGroups in ChangeViewSettingsModalStore
    const attachedUnarchivedGroups = (matchedSession.groups as Array<$TSFixMe>).filter(
      (group) => group.isArchived === false
    );

    // show group information if there are more than one attached unarchived groups
    showGroupInformation = attachedUnarchivedGroups.length > 1;
  } else {
    // false for the context is not a session group context
    showGroupInformation = false;
  }
  return showGroupInformation;
};
