import multitracker from 'js/app/multitrackerSingleton';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import injectedCourseId from 'bundles/phoenix/courseId';
import logger from 'js/app/loggerSingleton';

// locationAction is described in https://github.com/ReactJSTraining/history/blob/master/docs/Location.md
// and may be one of PUSH, REPLACE, or POP. It may be ignored if `history` is not available.
// @ts-expect-error ts-migrate(2525) FIXME: Initializer provides no value for this binding ele... Remove this comment to see the full error message
function recordPageView({ locationAction, ...otherData } = {}) {
  // Log the injected course id when available, which is under all /teach and /learn URLs.
  const courseId = injectedCourseId === '{{ ONDEMAND_COURSE_ID_PLACEHOLDER }}' ? undefined : injectedCourseId;
  const event = {
    key: 'pageview',
    value: { courseId, locationAction, ...otherData },
  };
  multitracker.get('400').queue.push(['send', event, null /* callback */, true /* forcePing */]);
  logger.info(event);
}

function recordDeprecatedUsage(metadata: $TSFixMe) {
  multitracker.pushV2(['system.deprecated_usage.emit', metadata]);
}

const exported = {
  recordPageView,
  recordDeprecatedUsage,
};

export default exported;
export { recordPageView, recordDeprecatedUsage };
