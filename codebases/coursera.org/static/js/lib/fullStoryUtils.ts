import Q from 'q';
import user from 'js/lib/user';
import * as FullStory from '@fullstory/browser';

const fsNamespace = 'FS';

let deferred: Q.Deferred<void> | undefined;

const init = ({ orgCode = 'ARGC0', disableForCourserians = true } = {}) => {
  // Don't init if not on client,
  // is superuser, or is a Coursera employee
  if (
    typeof window === 'undefined' ||
    (disableForCourserians &&
      user.isAuthenticatedUser() &&
      // eslint-disable-next-line no-restricted-syntax
      (user.get().is_superuser || user.get().email_address.includes('@coursera.org')))
  ) {
    return;
  }

  // User name is not known unless we defer to another tick.
  deferred = Q.defer();
  deferred.promise.then(() => {
    FullStory.identify(String(user.get().id), {
      displayName: String(user.get().id),
    });
  });

  FullStory.init({
    debug: false,
    orgId: orgCode,
    namespace: fsNamespace,
  });
};

type UserVariables = {
  [key: string]:
    | string
    | boolean
    | number
    | Date
    | Array<number>
    | Array<string>
    | Array<boolean>
    | Array<Date>
    | undefined;
};

/**
 * Set custom user variables for the FullStory user. See documentation for more information.
 *
 * https://help.fullstory.com/hc/en-us/articles/360020623294
 * @param userVariables
 */
const set = (userVariables: UserVariables) => {
  if (typeof window === 'undefined' || !deferred) {
    return;
  }

  // Deferring this event prevents it from being sent to FS after pageload
  FullStory.setUserVars(userVariables);
};

const endSession = () => {
  if (typeof window === 'undefined' || !deferred) {
    return;
  }

  deferred.promise.then(() => {
    FullStory.shutdown();
  });
};

type EventProperties = {
  [key: string]: string | boolean | number | Date | Array<number> | Array<string> | Array<boolean> | Array<Date>;
};

/**
 * Send a custom event to FullStory. See documentation for naming, structure and data requirements.
 * window.FS.event() can be useful for debugging.
 *
 * Although the type allows number, FullStory requires ints or reals specifically.
 *
 * https://help.fullstory.com/hc/en-us/articles/360020623234#General%20Payload%20Requirements
 *
 * @param eventName name of event
 * @param eventProperties see the documentation link above for required structure
 */
const event = (eventName: string, eventProperties: EventProperties) => {
  if (typeof window === 'undefined' || !deferred) {
    return;
  }

  // Deferring this event prevents it from being sent to FS after pageload
  FullStory.event(eventName, eventProperties);
};

const exported = {
  init,
  set,
  endSession,
  event,
};

export default exported;
export { init, set, endSession, event };
