import React from 'react';
import PollerDebugger from 'bundles/common/components/PollerDebugger';
import { Poller$Ref } from 'bundles/common/types/Poller';

type Props = {
  // An optional ID used for saving your choices to localStorage.
  uid?: string;

  // An optional name used for rendering a friendly label in the PollerDebugger.
  name?: string;

  // TODO: Change the type here once we migrate to React 16.
  pollerRef?: Poller$Ref;

  // This function is called every `interval` seconds. You can do anything here, such as
  // calling a service for updated information.
  onInterval?: () => Promise<unknown> | unknown;

  // This function is called `timeout` seconds after we start running. It will be called in either stop
  // or the unmount lifecycle method.
  onTimeout?: () => unknown;

  // If true (default), this will begin polling as soon as it is mounted. If false, you'll have to
  // start the polling manually by using the `start` function passed to `onInitialized`.
  autoStart?: boolean;

  // How long to wait between calls to `onInterval`. If `onInterval` returns a promise, this will wait
  // `interval` milliseconds after that promise is resolved.
  interval: number;

  // How long after the poller starts will it time out. Upon time out, it will call the function `onTimeout`.
  timeout?: number;

  // `interval` is multiplied by `backoffMultiplier` to increase the delay between subsequent calls to `onInterval`
  backoffMultiplier?: number;

  // This prop lets you pause polling while other things are in progress.
  isEnabled?: boolean;

  // This renders a debugger that gives you some buttons for controlling this Poller.
  showDebugger?: boolean;
};

type State = {
  isRunning: boolean;
  startTime: number;
  pollCount: number;
};

const NULL_TIMEOUT_ID = 0;

/**
 * This class abstracts away the mechanics of polling a service (or really, just calling a function) on a given
 * interval. This component starts polling on mount (by default), and stops on unmount. You can also control the polling
 * (starting it, stopping it, and forcing a run) by using the functions passed into the optional onInitialized callback.
 */
export class Poller extends React.Component<Props, State> {
  static defaultProps = {
    autoStart: true,
    isEnabled: true,
    showDebugger: false,
  };

  state = {
    isRunning: false,
    startTime: Date.now(),
    pollCount: 0,
  };

  componentDidMount() {
    const { autoStart, pollerRef } = this.props;

    // TODO: I know this is an anti-pattern, but because unmounting can happen while an onInterval handler promise
    // is still in progress, I couldn't figure out a way to decide not to continue polling once it returned.
    // See this component's `run` method.
    this.mounted = true;

    // Always create a ref for use with the debugger.
    this.pollerRef.current = {
      start: this.start,
      stop: this.stop,
      run: this.run,
    };

    if (pollerRef) {
      // This gives callers fine-grained control over the poller, if needed.
      pollerRef.current = this.pollerRef.current;
    }

    if (autoStart) {
      this.start();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { pollerRef, isEnabled } = this.props;
    const { isRunning } = this.state;

    // Update the ref if the prop changes.
    if (pollerRef && pollerRef !== prevProps.pollerRef) {
      pollerRef.current = this.pollerRef.current;
    }

    // Stop or restart polling if the component is disabled/enabled.
    if (prevProps.isEnabled !== isEnabled) {
      if (isEnabled) {
        // This is now re-enabled.
        if (isRunning) {
          this.run();
        }
      } else {
        // This is now disabled.
        this.clearTimeout();
      }
    }
  }

  componentWillUnmount() {
    // See comment in `componentDidMount`.
    this.mounted = false;
    this.stop();
  }

  /**
   * Call the callback once after elapsed time has surpassed or reached `timeout`
   */
  onTimeout = (): Promise<unknown> => {
    const { onTimeout } = this.props;
    return Promise.resolve(onTimeout?.());
  };

  /**
   * Call the callback once and clear any existing timeout.
   */
  onInterval = (): Promise<unknown> => {
    const { onInterval } = this.props;
    return Promise.resolve(onInterval?.());
  };

  /**
   * Call the callback and start polling.
   */
  start = () => {
    this.setState({ isRunning: true, startTime: Date.now() }, this.run);
  };

  /**
   * Stop polling and prevent the callback from firing.
   */
  stop = () => {
    this.clearTimeout();
    this.setState({ isRunning: false });
  };

  /**
   * Call the callback. If we're currently in the running state, schedule another call. This lets you
   * run the poller while it's stopped, without having it start up again.
   */
  run = (force = false) => {
    const { interval, isEnabled, timeout, backoffMultiplier } = this.props;
    const { isRunning, startTime, pollCount } = this.state;
    const shouldRun = force || (isEnabled && isRunning);

    this.clearTimeout();

    if (!shouldRun || !this.mounted) {
      return;
    }

    const runNext = () => {
      if (isEnabled && isRunning && this.mounted) {
        this.clearTimeout();
        let elapsedTime = Date.now() - startTime;

        if (typeof timeout !== 'undefined' && elapsedTime >= timeout) {
          this.onTimeout?.();
          this.stop();
        } else {
          const adjustedInterval = backoffMultiplier ? Math.pow(backoffMultiplier, pollCount) * interval : interval;

          let timeUntilNextRun =
            typeof timeout !== 'undefined' ? Math.min(adjustedInterval, timeout - elapsedTime) : adjustedInterval;
          this.timeoutId = window.setTimeout(this.run, Math.max(0, timeUntilNextRun));

          this.setState({ pollCount: pollCount + 1 });
        }
      }
    };

    // Allow the callback to return a promise, and wait for that promise before scheduling the next run.
    // Also run again even if the API call fails.
    this.onInterval().then(runNext, runNext);
  };

  clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = NULL_TIMEOUT_ID;
    }
  }

  // See comment in `componentDidMount`.
  mounted = false;

  pollerRef: Poller$Ref = {};

  timeoutId: number = NULL_TIMEOUT_ID;

  render() {
    const { uid, name, showDebugger, isEnabled } = this.props;
    const { isRunning } = this.state;

    if (showDebugger) {
      return (
        <PollerDebugger uid={uid} name={name} pollerRef={this.pollerRef} isEnabled={isEnabled} isRunning={isRunning} />
      );
    } else {
      // This is not a visual component. It is a component, however, to take advantage of mounting/dismounting. We
      // only render something if you want to see a debugger, but only superusers can see those.
      return null;
    }
  }
}

export default Poller;
