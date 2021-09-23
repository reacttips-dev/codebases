'use es6';

import { useRef, useEffect, useCallback } from 'react';
/**
 * Starts an interval that evaluates the given `handler` every `duration` milliseconds.
 * Returns `startPolling` and `stopPolling` helpers that can be used to
 * manually control polling behavior.
 *
 * This hook intentionally simulates the behavior of the `pollInterval`
 * option in Apollo Client's `useQuery`.
 *
 * @example
 * // start logging every 1sec
 * const { startPolling, stopPolling } = usePollInterval(
 *   () => console.log('hello'),
 *   1000
 * );
 *
 * stopPolling();     // stop logging
 * startPolling(500); // start logging every 0.5sec; if >= 0.5sec has elapsed since we last logged, log immediately as well
 */

export var usePollInterval = function usePollInterval(_handler, duration) {
  var handler = useRef();
  var interval = useRef();
  var lastTickAt = useRef();
  useEffect(function () {
    handler.current = _handler;
  }, [_handler]);
  var tick = useCallback(function () {
    lastTickAt.current = Date.now();
    handler.current();
  }, []);
  var startPolling = useCallback(function (ms) {
    clearInterval(interval.current);

    if (ms) {
      interval.current = setInterval(tick, ms);

      if (lastTickAt.current && Date.now() - lastTickAt.current >= ms) {
        tick();
      }
    }
  }, [tick]);
  var stopPolling = useCallback(function () {
    clearInterval(interval.current);
  }, []);
  useEffect(function () {
    if (duration) {
      interval.current = setInterval(tick, duration);
      return function () {
        return clearInterval(interval.current);
      };
    }

    return function () {};
  }, [tick, duration]);
  return {
    startPolling: startPolling,
    stopPolling: stopPolling
  };
};