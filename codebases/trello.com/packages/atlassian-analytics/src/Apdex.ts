import { apdexType } from '@atlassiansox/analytics-web-client';
import { Analytics } from './AnalyticsClient';
import { track } from '@trello/analytics';

interface ApdexEvent {
  task: string;
  taskId?: string;
  startTime: number;
}

interface StartOptions {
  task: string;
  taskId?: string;
}

interface StopOptions {
  task: string;
  taskId?: string;
  type?: 'initialLoad' | 'transition';
}

class ApdexClass {
  events: { [key: string]: ApdexEvent } = {};

  isInitialLoad = true;
  initialVisibilityHidden = document.visibilityState === 'hidden';
  initialUrl = window.location.href;

  _getEventKey(task: string, taskId?: string) {
    return taskId ? `${task}:${taskId}` : task;
  }

  resetInitialState() {
    this.isInitialLoad = true;
    this.initialUrl = window.location.href;
  }

  start(options: StartOptions) {
    const { task, taskId } = options;
    const key = this._getEventKey(task, taskId);

    if (this.events[key]) {
      console.warn(`Apdex event "${key}" has already been started`);

      return;
    }

    this.events[key] = { startTime: Date.now(), ...options };

    try {
      Analytics.startApdexEvent({ task, taskId });
    } catch (e) {
      console.warn(`analytics-web-client could not start Apdex event "${key}"`);
    }
  }

  stop(options: StopOptions) {
    const { task, taskId, type } = options;
    const key = this._getEventKey(task, taskId);
    const event = this.events[key];

    if (!event) {
      console.warn(`Apdex event "${key}" was never started`);

      return;
    }

    const isInitialLoad =
      type === apdexType.INITIAL_LOAD ||
      (this.isInitialLoad && this.initialUrl === window.location.href);
    const label = isInitialLoad ? 'initialLoad' : 'transition';
    const property =
      (isInitialLoad && this.initialVisibilityHidden) ||
      document.visibilityState === 'hidden'
        ? 'hidden'
        : 'visible';

    const now = Date.now();
    const navigationStartDuration =
      now - window.performance.timing.navigationStart;
    const transitionDuration = now - event.startTime;
    const totalDuration = isInitialLoad
      ? navigationStartDuration
      : transitionDuration;

    track('apdex', task, label, property, totalDuration);

    try {
      Analytics.stopApdexEvent({
        task,
        taskId,
        type: label,
      });
    } catch (e) {
      console.warn(`analytics-web-client could not stop Apdex event "${key}"`);
    }

    if (isInitialLoad) {
      track(
        'apdex',
        task,
        'timeSpentBeforeMeasure',
        property,
        navigationStartDuration - transitionDuration,
      );

      this.isInitialLoad = false;
    }

    delete this.events[key];
  }

  cancel(options: StartOptions) {
    const { task, taskId } = options;
    const key = this._getEventKey(task, taskId);

    if (!this.events[key]) {
      console.warn(`Apdex event "${key}" was never started`);

      return;
    }

    delete this.events[key];
  }
}

// eslint-disable-next-line @trello/no-module-logic
export const Apdex = new ApdexClass();
