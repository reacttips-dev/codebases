import type { ActionContext } from 'js/lib/ActionContext';

import Q from 'q';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import * as onDemandSessionsApi from 'bundles/course-sessions/utils/onDemandSessionsApi';
import SessionStoreClass from 'bundles/course-sessions/stores/SessionStore';

/**
 * @param {Fluxible.ActionContext} actionContext
 * @return {Promise}
 */
export const getCurrentSession = (
  actionContext: ActionContext,
  { courseSlug }: { courseSlug: string }
): Q.Promise<any> => {
  if (actionContext.getStore(SessionStoreClass).hasLoaded()) {
    return Q();
  }

  return onDemandSessionsApi
    .getCurrentSession(courseSlug)
    .then((session: $TSFixMe) => {
      actionContext.dispatch('LOAD_SESSION', session || null);
    })
    .fail((error: $TSFixMe) => {
      throw error;
    });
};

/**
 * @param {Fluxible.ActionContext} actionContext
 * @param {string} currentSessionId
 * @return {Promise}
 */
export const updateEnrollableAndFollowingSessions = (
  actionContext: ActionContext,
  {
    courseId,
    currentSessionId,
  }: {
    courseId: string;
    currentSessionId: string;
  }
): Q.Promise<any> => {
  if (actionContext.getStore(SessionStoreClass).hasLoaded()) {
    return Q();
  }

  return onDemandSessionsApi
    .getFollowingSession(courseId, currentSessionId)
    .then((sessions: $TSFixMe) => {
      if (sessions.getUpcomingSession() || sessions.getFollowingSession()) {
        actionContext.dispatch('LOAD_UPCOMING_AND_FOLLOWING_SESSIONS', {
          upcomingSession: sessions.getUpcomingSession(),
          followingSession: sessions.getFollowingSession(),
        });
      }
    })
    .fail((error: $TSFixMe) => {
      throw error;
    });
};

/* eslint-disable no-console */
/**
 * @param {Fluxible.ActionContext} actionContext
 * @param {string} courseId
 * @return {Promise}
 */
export const getAllSessions = (actionContext: ActionContext, courseId: string): Q.Promise<any> => {
  if (actionContext.getStore(SessionStoreClass).hasLoaded()) {
    return Q();
  }

  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  return onDemandSessionsApi.getAllSessions(courseId).then((elements: $TSFixMe) => {
    actionContext.dispatch('LOAD_ALL_SESSIONS', elements);
  });
};
