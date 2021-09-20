/* eslint-disable import/no-default-export */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Task = (...args: any[]) => any;

import { TrelloWindow } from '@trello/window-types';
declare const window: TrelloWindow;

export interface TaskQueueItem {
  id: number;
  executeTask: Task;
}

/*
 * Lifted heavily from https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API
 * Intended to be a simple module API for adding non-critical tasks to be run in the background
 * whenever the browser is available to do them. requestIdleCallback() API supported in Chrome
 * and Firefox currently -- which means we have it on desktop. Other browsers will fall back
 * to setTimeout() to at least defer tasks to the next tick on the event loop
 */
let taskQueue: TaskQueueItem[] = [];
let deferredQueue: TaskQueueItem[] = [];
const deferredTimeoutIds = new Map<number, number>();
let scheduleId: null | number = null;
let taskCounter: number = 0;
const maxIdleDelay: number = 2000;

/*
 * Browser shim
 */
if (!window.requestIdleCallback) {
  window.requestIdleCallback = function requestIdleCallbackShim(handler) {
    const startTime = Date.now();

    return window.setTimeout(function () {
      handler({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50.0 - (Date.now() - startTime)),
      });
    });
  };
  window.cancelIdleCallback = function cancelIdleCallbackShim(id) {
    return clearTimeout(id);
  };
}

function _executeTask(task: TaskQueueItem) {
  try {
    task.executeTask();
  } catch (e) {
    console.error(
      `${e.message} while executing taskScheduler task ${
        task.executeTask.name || 'anonymous'
      }`,
    );
  }
}

/*
 * Task runner. Loops through tasks in the queue, and if there's time left, it executes the next one.
 * Once it runs out of time, it calls requestIdleCallback to queue up the next task when the browser
 * is idle again.
 */
export function _runTaskQueue(deadline: IdleDeadline) {
  if (process.env.NODE_ENV === 'development') {
    performance.mark(`iq-${scheduleId}-s`);
  }
  while (
    (deadline.timeRemaining() > 0 || deadline.didTimeout) &&
    taskQueue.length
  ) {
    const task = taskQueue.shift()!;
    _executeTask(task);
  }
  if (process.env.NODE_ENV === 'development') {
    try {
      performance.mark(`iq-${scheduleId}-e`);
      performance.measure(
        `idle-task-queue-${scheduleId}`,
        `iq-${scheduleId}-s`,
        `iq-${scheduleId}-e`,
      );
    } catch (e) {
      console.error(e);
    }
  }
  scheduleId = !taskQueue.length
    ? null
    : window.requestIdleCallback(_runTaskQueue, { timeout: maxIdleDelay });
}

/*
 * Calls requestIdleCallback if there isn't already a reference id for an existing idleCallback
 */
function _enqueueTask(executeTask: Task, taskId = ++taskCounter) {
  taskQueue.push({
    executeTask,
    id: taskId,
  });
  scheduleId =
    scheduleId !== null
      ? scheduleId
      : window.requestIdleCallback(_runTaskQueue, { timeout: maxIdleDelay });

  return taskCounter;
}

/*
 * Add a function to the taskQueue after a given timeout. Returns a taskId number that
 * can be used to remove or flush it from the queue by the caller.
 */
export function addIdleTask(executeTask: Task, deferredTimeout = 0) {
  // If no deferral timeout is provided, enqueue it to the idle callback task queue
  if (!deferredTimeout) {
    return _enqueueTask(executeTask);
  }

  // Otherwise, set a timeout to add it to the idle callback queue
  const taskId = ++taskCounter;
  deferredQueue.push({
    executeTask,
    id: taskId,
  });
  const timeoutId = window.setTimeout(function () {
    const task = deferredQueue.find((item) => item.id === taskId);
    if (task) {
      _enqueueTask(task.executeTask, taskId);
      deferredQueue = deferredQueue.filter((item) => item.id !== taskId);
    }
    deferredTimeoutIds.delete(taskId);
  }, deferredTimeout);
  deferredTimeoutIds.set(taskId, timeoutId);

  return taskId;
}

/*
 * Remove a task from the taskQueue by it's id
 */
export function clearIdleTask(taskId: number) {
  if (!taskId) {
    return;
  }

  // clear task from the task queue
  taskQueue = taskQueue.filter((task) => task.id !== taskId);

  // clear task from the deferred queue
  if (deferredTimeoutIds.has(taskId)) {
    window.clearTimeout(deferredTimeoutIds.get(taskId));
    deferredTimeoutIds.delete(taskId);
    deferredQueue = deferredQueue.filter((task) => task.id !== taskId);
  }
}

/*
 * Execute a task in the queue immediately and remove it from the queues
 */
export function flushIdleTask(taskId: number) {
  if (!taskId) {
    return;
  }

  // Is task in the task queue
  let task = taskQueue.find((item) => item.id === taskId);
  if (task) {
    _executeTask(task);
    taskQueue = taskQueue.filter((item) => item.id !== taskId);

    // Is task in the deferred queue
  } else if (deferredTimeoutIds.has(taskId)) {
    clearTimeout(deferredTimeoutIds.get(taskId));
    deferredTimeoutIds.delete(taskId);
    task = deferredQueue.find((item) => item.id === taskId)!;
    _executeTask(task);
    deferredQueue = deferredQueue.filter((item) => item.id !== taskId);
  }
}

/*
 * Returns the current task queue. Used for testing only
 */
export function _getTaskQueue() {
  return taskQueue;
}

/*
 * Returns the deferred task queue. Used for testing only
 */
export function _getDeferredQueue() {
  return deferredQueue;
}

/*
 * Clear out all pending tasks. Used for testing only
 */
export function _clearTaskQueue() {
  if (scheduleId) {
    window.cancelIdleCallback(scheduleId);
  }
  for (const timeout of deferredTimeoutIds.values()) {
    window.clearTimeout(timeout);
  }
  deferredTimeoutIds.clear();
  deferredQueue = [];
  scheduleId = null;
  taskQueue = [];
}
