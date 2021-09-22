import epicClient from 'bundles/epic/client';
import type { AuthoringCourseContext } from 'bundles/authoring/common/types/authoringCourseContexts';
import { getShouldLoadRaven } from 'js/lib/sentry';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import PrivilegedAuths from 'bundles/naptimejs/resources/privilegedAuths.v1';
import user from 'js/lib/user';
import raven from 'raven-js';

export const isContextBasedVaLEnabled = (): boolean =>
  epicClient.get('Authoring', 'enableContextBasedViewAsLearnerBanner');

/**
 * Per CP-7971, add fallback logic if the context-based VaL cannot be used,
 * determines if the context-based VaL should be used
 * @param {AuthoringCourseContext} matchedContext the matched course context, could be undefined
 * @returns {boolean} only returns true if the enableContextBasedViewAsLearnerBanner is enabled, the user is not an outsourcing agent and the matched context is valid
 */
export const shouldEnableContextBasedVaL = (matchedContext?: AuthoringCourseContext): boolean => {
  if (isContextBasedVaLEnabled()) {
    // use the old VaL for outsourcing agents until CP-7970 is resolved
    if (PrivilegedAuths.getIsOutsourcingAgent(user)) {
      return false;
    } else if (!matchedContext) {
      if (getShouldLoadRaven()) {
        raven.captureException(new Error('VaL fallback is used'), {
          tags: {
            product: 'val-fallback', // use this tag for alert
          },
          extra: {
            message: 'the old VaL UX is used because the matched context is invalid',
          },
        });
      }
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};
