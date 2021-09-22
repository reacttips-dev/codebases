/**
 * A library for working with paths.
 */

/**
 * Joins multiple parts of a path into one.
 *
 * Usage:
 *   var assessmentId = 'assess-1';
 *   var sessionId = 'session-2';
 *   var baseApi = path.join('/api', 'assess', 'v1');
 *   var url = path.join(baseApi,
 *     'assessments', assessmentId,
 *     'sessions', sessionId,
 *     'action'
 *   );
 *   url;           // /api/assess/v1/assessments/assess-1/sessions/session-2/action
 */
const join = function (parts: Array<string> | string, ...rest: Array<string>): string {
  const args = parts instanceof Array ? parts : [parts, ...rest];
  return args
    .join('/')
    .replace(/([^:])[/]{2,}|^\/\//g, '$1/')
    .replace(/\/$/, '');
};

export default { join };
