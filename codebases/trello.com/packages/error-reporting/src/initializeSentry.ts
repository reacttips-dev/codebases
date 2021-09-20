import {
  init,
  setUser,
  setExtras,
  Event as SentryEvent,
  Breadcrumb,
} from '@sentry/browser';
import { memberId } from '@trello/session-cookie';

import {
  clientVersion,
  environment,
  isDevserver,
  sentryDsn,
} from '@trello/config';
import { isBrowserSupported } from '@trello/browser';

import { scrubUrl } from './scrubUrl';
import { scrubMessage } from '@trello/strings';

interface LegacyNavigator extends Navigator {
  browserLanguage: string;
}

// Rewrite the filenames from something like `dist/br/app.js` to `dist/app.js`,
// because if we don't Sentry will fetch the sourcemap for any Brotli-
// compressed source files (which leads to garbled stack traces, as Sentry
// doesn't decompress the Brotli sourcemap properly). If/when we stop Brotli-
// compressing the sourcemaps, it's still valuable to do this manipulation so
// that error grouping works as expected.
//
// See https://github.com/getsentry/sentry-javascript/issues/2065#issuecomment-552309584
export const rewriteBrotliPaths = (event: SentryEvent): SentryEvent => {
  event.exception?.values?.forEach((value) => {
    value.stacktrace?.frames?.forEach((frame) => {
      if (frame.filename) {
        frame.filename = frame.filename.replace('/dist/br/', '/dist/');
      }
    });
  });

  return event;
};

export const removePrivateInformationFromRequestUrl = (
  event: SentryEvent,
): SentryEvent => {
  if (event.request?.url) {
    event.request.url = scrubUrl(event.request.url);
  }

  return event;
};

export const removePrivateInformationFromBreadcrumb = (
  breadcrumb: Breadcrumb,
) => {
  const { category } = breadcrumb;

  // these often can contain api calls that include PII such as org
  // or user name. For now, let's just remove them.
  if (category === 'fetch' || category === 'xhr') {
    return null;
  }

  // Removing console entries because we don't know what kind of information
  // we're leaking and we don't want to allow any accidental future uses of
  // console to create PII concerns
  // See: https://trello.atlassian.net/browse/WTD-49
  if (category === 'console') {
    return null;
  }

  if (category === 'navigation') {
    if (breadcrumb.data) {
      const { to, from } = breadcrumb.data;

      // the Sentry UI doesn't render boolean values, so we're using strings
      breadcrumb.data.pathsAreEqual =
        breadcrumb.data.to === breadcrumb.data.from ? 'true' : 'false';

      if (from) {
        breadcrumb.data.from = scrubUrl(breadcrumb.data.from);
      }
      if (to) {
        breadcrumb.data.to = scrubUrl(breadcrumb.data.to);
      }
    }
  }

  if (category?.startsWith('ui.')) {
    const { message } = breadcrumb;
    const attrSelectorRegex = /(\[.*\])/;

    if (message && attrSelectorRegex.test(message)) {
      breadcrumb.message = message.replace(attrSelectorRegex, '');
    }
  }

  return breadcrumb;
};

/**
 * Scrubs any and all messages for know personal information strings
 * @see https://develop.sentry.dev/sdk/event-payloads/exception
 */
export const removePrivateInformationFromErrorMessages = (
  event: SentryEvent,
): SentryEvent => {
  if (event.exception?.values?.length && event.exception.values.length > 0) {
    const scrubbedExceptions = event.exception.values.map((e) => {
      if (e.value) {
        e.value = scrubMessage(e.value);
      }
      return e;
    });

    event.exception.values = scrubbedExceptions;
  }

  return event;
};

/**
 * Scrubs personal information from the stack trace urls
 * @see https://develop.sentry.dev/sdk/event-payloads/stacktrace/
 */
export const removePrivateInformationFromStacktraces = (
  event: SentryEvent,
): SentryEvent => {
  // if we have exception objects to action on...
  if (event.exception?.values?.length && event.exception.values.length > 0) {
    const scrubbedExceptions = event.exception.values.map((e) => {
      // if there are stacktrace frame objects to action on in this exception...
      if (e.stacktrace?.frames?.length && e.stacktrace?.frames?.length > 0) {
        const scrubbedFrames = e.stacktrace.frames.map((frame) => {
          if (frame.filename) {
            let name = frame.filename;
            // This bit of logic handles the bug in the frames (from Sentry)
            // where the top frame ends with a ")"
            //
            // Example: 'https://a.trellocdn.com/dist/app.697f3421ce98b28743ce.js)'
            //
            // In this case we should test the value without the trailing paren
            if (name.endsWith(')')) {
              name = name.substring(0, name.length - 1);
            }

            const fileExtRegex = /\.[0-9a-z]+$/i;
            const hasFileExtension = fileExtRegex.test(name);
            if (!hasFileExtension) {
              frame.filename = scrubUrl(frame.filename);
            } else {
              frame.filename = name;
            }
          }
          return frame;
        });

        e.stacktrace.frames = scrubbedFrames;
      }

      return e;
    });

    event.exception.values = scrubbedExceptions;
  }

  return event;
};

export function initializeSentry() {
  init({
    dsn: sentryDsn,
    release: clientVersion,
    environment:
      process.env.NODE_ENV === 'development' || isDevserver
        ? 'development'
        : environment,
    beforeSend: (event) => {
      let modifiedEvent = rewriteBrotliPaths(event);
      modifiedEvent = removePrivateInformationFromRequestUrl(modifiedEvent);
      modifiedEvent = removePrivateInformationFromErrorMessages(modifiedEvent);
      modifiedEvent = removePrivateInformationFromStacktraces(modifiedEvent);

      return modifiedEvent;
    },
    beforeBreadcrumb(breadcrumb, hint) {
      return removePrivateInformationFromBreadcrumb(breadcrumb);
    },

    // We want to explicitly avoid installing the 'GlobalHandlers' and 'TryCatch' integrations
    // as we are tapping onerror and unhandled promise rejections ourselves.
    // We will manually send errors to sentry ourselves
    integrations: (integrations) =>
      integrations.filter(
        (integration) =>
          integration.name !== 'GlobalHandlers' &&
          integration.name !== 'TryCatch',
      ),
  });

  // Set the additional properties attached to every error
  setExtras({
    isBrowserSupported: isBrowserSupported(),
    language:
      navigator.language || (navigator as LegacyNavigator).browserLanguage,
  });

  // Set the sentry user if they are logged in
  if (memberId) {
    setUser({ id: memberId });
  }
}
