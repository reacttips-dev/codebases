import { Task } from '@trello/atlassian-analytics/src/constants/ActionSubjectId';
import { SourceType } from '@trello/atlassian-analytics/src/constants/Source';
import { Analytics } from '../AnalyticsClient';

/**
 * Returns a callback that automatically intercepts success/failure callbacks
 * and finishes tracing a given task.
 *
 * @param {Task} taskName (required)
 * @param {string} traceId (required) Trace id, returned by Analytics.startTask
 * @param {SourceType} source (required) Screen that task occurred
 * @param {Function} [next] (optional) If defined will invoke another (err, result: T) callback,
 * usually used for additional tracking, before task is marked as successful or before error is thrown
 * @example
 * // Typically used when interacting with Backbone models
 * this.model.close(traceId, withTracing({ traceId, task: 'edit-card/closed'))
 */
export function tracingCallback<T>(
  {
    taskName,
    traceId,
    source,
    attributes,
  }: {
    taskName: Task;
    traceId: string;
    source: SourceType;
    attributes?: Record<string, string>;
  },
  next?: (err: Error | null, result: T) => void,
) {
  return (err: Error | null, result: T) => {
    // traceId is required as an argument, but it could be an empty string so we still need to check
    if (err && traceId) {
      if (next) {
        next(err, result);
      }
      throw Analytics.taskFailed({
        taskName,
        traceId,
        source,
        attributes,
        error: err,
      });
    } else {
      if (next) {
        next(err, result);
      }
      if (traceId) {
        Analytics.taskSucceeded({
          taskName,
          traceId,
          source,
          attributes,
        });
      }
    }
  };
}
