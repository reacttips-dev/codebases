/**
 * Multitracker implements a push model for frontend event tracking. Registering trackers requires:
 *   name
 *   queue - (optional - default: []) An object that handles events pushed in via queue.push(event)
 *   type - (optional - default: 'key-value') One of 'google', 'key-value', or 'custom'
 *   parser (optional) - A function to parse multitracker.push args into events for custom trackers
 *
 *   tracker.register('google-analytics', [], 'google');
 *   tracker.register('204', [], 'key-value');
 *   tracker.register('myTracker', [], 'custom', myParser);
 *
 * Pushes consist of a key and one or more values. Values are stringified befored being pushed.
 *
 *   tracker.push(key);
 *   tracker.push([key, value]);
 *   tracker.push([key, value1, value2]);         (will concatenate as '$value1.$value2')
 *   tracker.push([key1, value1], [key2, value2]);
 *
 * In preperation for eventingV2, `pushV2` will not push to '204', while `push` will not push to '400'.
 * This is so that pushes to either one will continue to push to google analytics, and so that we
 * don't send duplicate events to both the v1 and v2 endpoints.
 *
 * Pushes will parse the key and values and issue one of the following requests to each registered
 * queue. Registered queues must support these endpoints.
 *
 *   queue.push(['send', {key: '$key', value: '$valueString'}, callback]])
 *   queue.push({key: '$key', value: '$valueString'})
 *
 * Pushes can also be issued to individual queues, although this will skip parsing.
 * Thus you'll have to manually construct the push request for the queue.
 *
 *   tracker.get('204').queue.push(['send', {key: '$key', value: '$valueString'}, callback]);
 *
 * When initializing, you can pass in a logger that will be used each time an event is tracked.
 *
 *   var tracker = MultiTracker({logger: MyLog});
 */

import Log from 'js/lib/log';

const EVENTING_TIMEOUT_LIMIT = 500;

function asString(val) {
  if (typeof val === 'string') {
    return val;
  } else {
    return JSON.stringify(val);
  }
}

class MultiTracker {
  constructor(opts) {
    const options = opts || {};
    this.trackers = {};
    this.logger =
      options.logger ||
      Log({
        level: 'error',
      });
  }

  register(name, queue, type, parser) {
    // allow for registering google, key-value or custom event trackers
    // custom event trackers must come with their own parser
    this.trackers[name] = {
      queue: queue || [],
      type: type || 'key-value',
      parse: parser,
      name,
    };
  }

  get(name) {
    return this.trackers[name];
  }

  push() {
    const trackings = arguments;
    let trackEvent;
    let handler;
    let value;

    for (let k = 0; k < trackings.length; k++) {
      const tracking = Array.isArray(trackings[k]) ? trackings[k] : [trackings[k]];

      for (const trackerKey in this.trackers) {
        if (trackerKey !== '400') {
          var tracker = this.trackers[trackerKey];

          if (tracker.type == 'google') {
            // Note: we only send pageview events to google analytics because
            // they are the only events we actively look at in GA and we would
            // exceed the free tier data quota otherwise.
            if (tracking[0] == 'pageview') {
              trackEvent = ['_trackPageview'];
              for (let i = 1; i < tracking.length; i++) {
                trackEvent.push(asString(tracking[i]));
              }
            }
          } else if (tracker.type == 'key-value') {
            value = [];

            for (let a = 1; a < tracking.length; a++) {
              if (typeof tracking[a] === 'function') {
                handler = tracking[a]; // assume any functions are callbacks
              } else {
                value.push(asString(tracking[a]));
              }
            }

            if (value.length) {
              trackEvent = {
                key: tracking[0],
                value: value.join('.'),
              };
            } else {
              trackEvent = {
                key: tracking[0],
              };
            }
          } else if (tracker.type == 'custom' && tracker.parse) {
            trackEvent = tracker.parse.apply(this, tracking);
          }

          if (trackEvent) {
            if (handler) {
              // add a callback so we know when the push is done
              // if tracker doesn't return, force handler in 500ms
              var _handler = handler;
              var timer = window.setTimeout(_handler, EVENTING_TIMEOUT_LIMIT);
              tracker.queue.push([
                'send',
                trackEvent,
                function () {
                  window.clearTimeout(timer);
                  return _handler(tracker.name);
                },
              ]);
            } else {
              tracker.queue.push(trackEvent);
            }
          }

          trackEvent = undefined;
          handler = undefined;
        }
      }

      this.logger.info('multitracker:', ...tracking);
    }
  }

  /**
   * Exactly the same as .push but will not push to '204'
   */
  pushV2() {
    const trackings = arguments;
    let trackEvent;
    let handler;
    let value;

    for (let k = 0; k < trackings.length; k++) {
      const tracking = Array.isArray(trackings[k]) ? trackings[k] : [trackings[k]];

      for (const trackerKey in this.trackers) {
        if (trackerKey !== '204') {
          var tracker = this.trackers[trackerKey];

          if (tracker.type == 'google') {
            // Note: we only send pageview events to google analytics because
            // they are the only events we actively look at in GA and we would
            // exceed the free tier data quota otherwise.
            if (tracking[0] == 'pageview') {
              trackEvent = ['_trackPageview'];
              for (let i = 1; i < tracking.length; i++) {
                trackEvent.push(asString(tracking[i]));
              }
            }
          } else if (tracker.type == 'key-value') {
            value = [];

            for (let a = 1; a < tracking.length; a++) {
              if (typeof tracking[a] === 'function') {
                handler = tracking[a]; // assume any functions are callbacks
              } else {
                value.push(tracking[a]);
              }
            }

            if (value.length) {
              trackEvent = { key: tracking[0], value: value.length == 1 ? value[0] : value };
            } else {
              trackEvent = { key: tracking[0], value: {} };
            }
          } else if (tracker.type == 'custom' && tracker.parse) {
            trackEvent = tracker.parse.apply(this, tracking);
          }

          if (trackEvent) {
            if (handler) {
              // add a callback so we know when the push is done
              // if tracker doesn't return, force handler in 500ms
              var _handler = handler;
              var timer = window.setTimeout(_handler, 500);
              tracker.queue.push([
                'send',
                trackEvent,
                function () {
                  window.clearTimeout(timer);
                  return _handler(tracker.name);
                },
              ]);
            } else {
              tracker.queue.push(trackEvent);
            }
          }

          trackEvent = undefined;
          handler = undefined;
        }
      }

      this.logger.info('multitracker:', ...tracking);
    }
  }
}

export default function (options) {
  return new MultiTracker(options);
}
