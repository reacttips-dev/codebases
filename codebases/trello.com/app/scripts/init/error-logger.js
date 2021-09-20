// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { ApiError } = require('app/scripts/network/api-error');
const {
  sendCrashEvent,
  sendErrorEvent,
  scrubUrl,
} = require('@trello/error-reporting');
const { errorSignal } = require('app/scripts/lib/error-signal');
const _ = require('underscore');
const f = require('effing');

const isInterestingError = (err) =>
  err instanceof ApiError.Other || !(err instanceof ApiError);

const hasTraceId = (err) => 'traceId' in err;

const pastErrors = [];

errorSignal.subscribe(
  _.debounce(
    function (errorInfo) {
      // We want to avoid a situation where a client gets into an infinite error
      // loop and spams us over and over, and our deduplicator fails to detect that.
      if (pastErrors.length === 10) {
        return false;
      }

      const { error, url, line, col } = errorInfo;

      if (!isInterestingError(error)) {
        if (!hasTraceId(error)) {
          return false;
        }
      }

      // We only care if it's one of our scripts that's having an error.
      // We don't care if it's an extension (or script related to an extension)
      if (
        !new RegExp(
          `https?://(${location.host}|[a-z0-9]+\\.cloudfront\\.net|a(?:-staging)?.trellocdn.com)/`,
        ).test(url)
      ) {
        return false;
      }

      const errorEntry = [error.message, url, line, col];

      if (_.any(pastErrors, f(_.isEqual, errorEntry))) {
        return false;
      }

      const extraData = {
        // If the script URL was not provided, we default to location.href. In
        // that case, scrub board / card titles away
        url: url === document.location.href ? scrubUrl(url) : url,
        line,
        col,
      };

      // Use sendErrorEvent for new traced errors that are now being sent
      if (isInterestingError(error)) {
        sendCrashEvent(error, {
          extraData,
        });
      } else {
        sendErrorEvent(error, {
          tags: { ownershipArea: 'trello-data-eng' },
          extraData,
        });
      }

      pastErrors.push(errorEntry);
      return false;
    },
    1000,
    true,
  ),
);
