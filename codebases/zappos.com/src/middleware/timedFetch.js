import 'isomorphic-fetch';
import ExecutionEnvironment from 'exenv';

import { getRequestGuid, logger } from 'helpers/environment/context';
let now;
if (ExecutionEnvironment.canUseDOM) {
  now = () => window.performance && window.performance.now && window.performance.now() || new Date().getTime();
} else {
  const { performance } = require('perf_hooks');
  ({ now } = performance);
}

function extractGuidFromFetchArgs(args) {
  return args.length === 2 &&
    typeof args[1] === 'object' &&
    args[1].headers &&
    'X-UUID' in args[1].headers &&
    args[1].headers['X-UUID'];
}

function logApiCall(fetchArgs, context, response, beginTime, log) {
  const guid = extractGuidFromFetchArgs(fetchArgs);
  // if the fetch request contains a uuid, let's log it when we log the timing.
  const guidLogFragment = guid ? ` api_guid=${guid}` : '';
  const end = now();
  log(`API Call Completed context=${context} time=${(end - beginTime).toFixed(0)} ms statusCode=${response.status} url="${fetchArgs[0]}"${guidLogFragment}`);
}

/**
 * Fetch factory which constructs a fetch implementation which logs the execution time of the fetch call.
 * @param  {String} [context='']    A string to include in the log message to more easily group logging statements with the call type
 * @param  {function} [fetcher=fetch] the fetch function to delegate to
 * @param  {function} [log=logDebug]  function to log to
 * @return {function}                 a fetch function that can be used over and over again that will fetch using the specified delegate and log with the given context and logger.
 */
export function timedFetchWithLogContext(context = '', fetcher = fetch, log = logger.debug) {
  return function() {
    const begin = now(), fetchArgs = arguments;
    const retVal = fetcher.apply(this, arguments);

    retVal.then(resp => {
      logApiCall(fetchArgs, context, resp, begin, log);
    }).catch(e => {
      // don't have a true status code since the underlying http call actually failed, so use the error message, but allow splunk aggregation at the status level easily
      const status = `NETWORK_ERROR ${e.type}_${e.code}_${e.errno}`;
      logApiCall(fetchArgs, context, { status }, begin, log);
      // Don't return anything here, since the actual promise returned to the caller is the original fetch promise.
      // If we reject or throw here, it'll cause an unhandledRejection error since this is technically a different handler than the one the handlers use.
    });
    return retVal;
  };
}

function modifyFetchArgsWithGuid(args) {
  const uuid = getRequestGuid();
  if (args.length === 2) {
    const [url, originalOptions] = args;
    if (originalOptions.headers && originalOptions.headers['X-UUID']) {
      return args;
    } else {
      return [url, { ...originalOptions, headers: { ...originalOptions.headers, 'X-UUID': uuid } }];
    }
  } else if (args.length === 1 && typeof args[0] === 'string') {
    return [args[0], { headers: { 'X-UUID': uuid } }];

  } else if (args.length === 1 && typeof args[0] === 'object') {
    const [req] = args;
    if (!req.headers.has('X-UUID')) {
      req.headers.append('X-UUID', uuid);
    }
    return [req];

  } else {
    logger.error('Unsupported arguments to fetch.');
    return args;
  }
}

// We cant inject uuid client side because none of the webservices have CORS setup to allow it.
export default ExecutionEnvironment.canUseDOM ? timedFetchWithLogContext : timedFetchWithUUId;

export function timedFetchWithUUId(context = '', timedFetcherFactory = timedFetchWithLogContext) {
  return function() {
    const newArgs = modifyFetchArgsWithGuid(arguments);
    return timedFetcherFactory(context).apply(this, newArgs);
  };
}
