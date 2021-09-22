/**
 * Retracked wraps your event recording system in an API optimized for React components.
 *
 * .track(key, values) records an event immediately. (values are optional)
 *
 * .track.handle(key, values) returns a function that records the event when evaluated.
 */

import React from 'react';
import PropTypes from 'prop-types';

import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';
import logger from 'js/app/loggerSingleton';
import { throttle, debounce, omit } from 'lodash';

let _recordEvent = function (fullEventKey, values) {
  throw new Error('Retracked setup() must first be called with an event recording function.');
};

let _actionNames = [];

function setup(recordEventFn, actionNames) {
  _recordEvent = recordEventFn;
  _actionNames = actionNames;
}

/**
 * Clone object, evaluting each property that is a function
 * @param  {Object} map keys map to simple values or functions
 * @return {Object}     Clone of object, with each function value evaluated
 */
function cloneWithPropertyEval(map) {
  const evaluatedMap = {};
  Object.keys(map).forEach((key) => {
    const valOrFunc = map[key];
    evaluatedMap[key] = typeof valOrFunc === 'function' ? valOrFunc() : valOrFunc;
  });
  return evaluatedMap;
}

// TODO(zhaojun): deprecate this makeTracker API after we finalize the newest version
function makeTracker(config = {}) {
  /**
   * Expand the key argument into the full key that would be sent to eventing
   * @param  {String}
   * @return {String} the full key to send to eventing
   */
  function expandKey(eventKey) {
    return config.namespace ? config.namespace + '.' + eventKey : eventKey;
  }

  /**
   * Track an event in the app.
   * @param {String} eventKey name of the event
   * @param {Object} moreValues dictionary of values to attach to the logged event
   * @param {SyntheticEvent} [uiEvent] React's event, passed by track.handle
   */
  function track(eventKey, moreValues, uiEvent) {
    const fullEventKey = expandKey(eventKey);

    const includeValues = cloneWithPropertyEval(config.include || {});

    const values = Object.assign({}, includeValues, moreValues);

    if (uiEvent && uiEvent.currentTarget) {
      // record features of the element interacted upon
      const el = uiEvent.currentTarget;
      if (el.href) {
        values.href = el.href;
      }
    }

    _recordEvent(fullEventKey, values);
  }

  /**
   * Curried form of track
   *
   * @returns {function} that calls event with the same args
   */
  track.handle = function (eventKey, moreValues) {
    return track.bind(null, eventKey, moreValues);
  };

  // create functions like `track.click` that take the client target as the key
  _actionNames.forEach(function (actionName) {
    track[actionName] = function (objectName, moreValues) {
      const eventKey = actionName + '.' + objectName;
      return track.bind(null, eventKey, moreValues);
    };
  });

  /**
   * Expand the objectName argument into the full key that would be sent to eventing.
   *
   * This is used by preloader's instrumentLinks function.
   *
   * @param  {String}
   * @return {String} the full key to send to eventing
   */
  track.clickKey = function (objectName) {
    return expandKey('click.' + objectName);
  };

  return track;
}

function createContainer(Component, config) {
  const baseName = Component.displayName || Component.name;

  class TrackingProvider extends React.Component {
    displayName = baseName + 'TrackingProvider';

    childContextTypes = {
      track: PropTypes.func.isRequired,
    };

    getChildContext() {
      return Object.assign({}, this.context, {
        track: makeTracker(config),
      });
    }

    render() {
      // eslint-disable-next-line react/no-this-in-sfc
      return <Component {...this.props} />;
    }
  }

  return TrackingProvider;
}

const RetrackedContext = React.createContext({});

/**
 * Create the newest generation of tracking container.
 * Please contact @zhaojun or @cliu if you have questions about usage.
 * @param  {Object} A callback of (props, context) => object, and the object will be deeply
 *                  merged to context._eventData
 * @return {Object} The component with tracking data in the context.
 */
function createTrackedContainerImpl(Component, getEventData, withTrackingData) {
  const baseName = Component.displayName || Component.name;

  class TrackingProvider extends React.Component {
    static displayName = baseName + 'TrackingProvider';

    static contextTypes = {
      _eventData: PropTypes.object,
    };

    static childContextTypes = {
      _eventData: PropTypes.object.isRequired,
      _withTrackingData: PropTypes.func,
    };

    // This function merges the eventData and namespace coming from the context of this component
    // with the data coming from the getEventData function passed to the createTrackedContainer HOC
    getMergedEventData() {
      const { _eventData } = this.context;
      // TODO(zhaojun): use deep merge
      const eventDataFromContext = _eventData || {};
      const eventData = getEventData(this.props, this.context);

      return {
        ...eventDataFromContext,
        ...eventData,
        namespace: {
          ...eventDataFromContext.namespace,
          ...eventData.namespace,
        },
      };
    }

    getChildContext() {
      return {
        _eventData: this.getMergedEventData(),

        // Here `this.props` is the own props of the component wrapped by `createTrackedContainer`.
        // We set `this.props` as the first argument of `_withTrackingData` so that when `_withTrackingData` is called,
        // this.props can be accessed in the `withTrackingData` callback.
        // This allows the callback to compute injected data using `this.props`, i.e. the wrapped component's own props.
        _withTrackingData: withTrackingData ? (...args) => withTrackingData(this.props, ...args) : undefined,
      };
    }

    render() {
      // Can't just let `ref` pass through, since `ref` is not a normal prop, but a special prop used by React.
      // So we introduced a new normal prop, `componentRef`, that can be used to pass a ref function to the wrapped
      // component.
      //
      // From the [Forwarding Refs](https://reactjs.org/docs/forwarding-refs.html) documentation:
      //
      // > Regular function or class components don’t receive the `ref` argument, and ref is not available in props either.
      return (
        <RetrackedContext.Provider
          value={{
            eventData: this.getMergedEventData(),
          }}
        >
          <Component {...this.props} ref={this.props.componentRef} />
        </RetrackedContext.Provider>
      );
    }
  }

  hoistNonReactStatics(TrackingProvider, Component);
  return TrackingProvider;
}

/**
 * Create an HoC component that can automatically add tracking data to all events
 * issued by TrackedComponents that are children of the HoC.
 *
 * The HoC component created by the below function does not do any tracking.
 *
 * For example,
 *
 * val OfferingCard = Retracked.createTrackedContainer(
 *   (props) => {
 *     const offering = props.offering;
 *     return {
 *       id: offering.id,
 *       target: offering.link,
 *       offeringType: offering.offeringType,
 *     };
 *   }
 * )(OfferingCard);
 *
 * In a fully rendered React component hierarchy:
 *
 * <OfferingCard>
 *   <SomethingElseOrNothing>
 *     <TrackedLink2 />
 *   </SomethingElseOrNothing>
 * </OfferingCard>
 *
 * When a user click the link, the value of the event issued by TrackedLink2 will
 * have the three fields specified in the createTrackedContainer code, e.g., the following is
 * the part of the value field
 * {
 *   id: ...,
 *   target: ...,
 *   offeringType: ...,
 *   ...
 * }
 *
 * An additional prop, `componentRef`, can be passed to the HOC. This prop will be sent to the
 * wrapped component's `ref` prop, so that a ref to the wrapped component can be captured.
 * Note: In the future, you should be able to use `ref` in the place of `componentRef`, but
 * this feature (ref forwarding) was only introduced in React 16.3.
 *
 * See https://reactjs.org/docs/forwarding-refs.html
 */
function createTrackedContainer(...args) {
  return (Component) => {
    return createTrackedContainerImpl.apply(this, [Component].concat(args));
  };
}

function _isTrackable(contextData) {
  return contextData && contextData.namespace && contextData.namespace.app && contextData.namespace.page;
}

function _getEventKey(contextData, trackingName, action) {
  const { namespace } = contextData;
  const { app, page } = namespace;
  const eventKey = [app, page, action, trackingName].join('.');
  if (!/^[_0-9a-z.]*$/.test(eventKey)) {
    logger.warn(
      'The event key ' +
        eventKey +
        ' should be `snake_cased`. ' +
        'See https://coursera.atlassian.net/wiki/spaces/EN/pages/46432678/Eventing#Eventing-NamingConvention'
    );
  }
  return eventKey;
}

function _getEventValue(contextData, propsData, trackingName, action) {
  return {
    // TODO(zhaojun): use deep merge
    ...contextData,
    ...propsData,
    namespace: {
      ...contextData.namespace,
      action,
      component: trackingName,
    },
    schema_type: 'FRONTEND',
  };
}

function trackComponent(contextData, propsData, trackingName, action, withTrackingData = undefined) {
  // gracefully handle the cases when the data was not set up correctly (e.g., no app name)
  if (!_isTrackable(contextData) || !trackingName) {
    logger.warn(
      `Retracked can't track with trackingName: ${trackingName}\taction: ${action}\t` +
        `context data: ${JSON.stringify(contextData)}` +
        `\tprops data: ${JSON.stringify(propsData)}`
    );
    return;
  }

  const data = withTrackingData
    ? { ...propsData, ...withTrackingData({ trackingData: propsData, trackingName, action }) }
    : propsData;

  const track = makeTracker();
  const eventKey = _getEventKey(contextData, trackingName, action);
  const eventValue = _getEventValue(contextData, data, trackingName, action);

  track(eventKey, eventValue);
}

// from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
const generateUUID = () => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0; // eslint-disable-line no-bitwise
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16); // eslint-disable-line no-bitwise
  });
  return uuid;
};

/**
 * Create an HoC component that automatically adds visibility events when its child moves in
 * and out of the user's viewport.
 * To use:
 * Create the HoC with the child as the component you want visibility tracking on
 *   (e.g const WithVisibility = Retracked.withVisibilityTracking(MyComponent))
 *   Make sure to re-use the same `WithVisibility` component in all `render` functions, instead of recreating it.
 *   Otherwise `render` will unmount the previous instance and remount because it sees two different Components.
 *
 * If your element is in the viewport but is not visible [e.g due to a carousel implementation], set
 * aria-hidden = 'true' will prevent the view event from firing.
 */
function withVisibilityTracking(Component) {
  const baseName = Component.displayName || Component.name;

  class VisibilityTracking extends React.Component {
    displayName = baseName + 'VisibilityTracking';

    static propTypes = {
      // when this component comes into the user's viewport, we fire the event
      // {group}.{page}.view.{trackingName} (this sets the last part)
      trackingName: PropTypes.string.isRequired,

      // Optionally, a viewport event may attach data. We use the same `data` key as the new Tracked Components.
      data: PropTypes.object,
      // If true, visibility is only achieved when the entire component boundary is within viewport.
      requireFullyVisible: PropTypes.bool,
      // If true, changes in visibility on a given page will not fire additional events.
      atMostOnce: PropTypes.bool,
    };

    static contextTypes = {
      _eventData: PropTypes.object,
    };

    static defaultProps = {
      requireFullyVisible: true,
      atMostOnce: true,
    };

    constructor() {
      super();
      // If defined, element is currently visible. Will send an event with `action` = 'hide' for there
      // given visibilityUUID once/if element disappears from viewport (i.e due to scrolling/page unloading)
      // Do not use React `this.state` because visibility changes should not trigger React rerendering.
      // Shape is {UUID: UUID_for_visit, timestamp: Unix timestamp}
      this.visibilityMetadata = undefined;
      this.isVisible = this.isVisible.bind(this);
      this.handleVisibilityCheckThrottled = throttle(this.handleVisibilityCheck, 100 /* ms */);
      this.sentVisibilityEvent = false;
      // starting visibility tracking 1000 ms after tracked element is mounted;
      // when we started the visibility tracking immediately after the element is mounted,
      // we observed that the element to be hidden by a scrolled container becomes visible,
      // generating a visibility impression. It is because the scroller container was rendered slightly
      // after the element is rendered, allowing the element that's supposed to be hidden actually shown
      this.startVisibilityTrackingDebounced = debounce(this.startVisibilityTracking, 1000 /* ms */);
      this.visibilityTrackingDiv = null;
    }

    componentDidMount() {
      this.startVisibilityTrackingDebounced();
    }

    componentWillUnmount() {
      this.stopVisibilityTracking();
    }

    handleVisibilityCheck = () => {
      const { atMostOnce } = this.props;
      const isVisible = this.isVisible();
      if (
        (isVisible && this.visibilityMetadata) ||
        (!isVisible && !this.visibilityMetadata) ||
        (this.sentVisibilityEvent && atMostOnce)
      ) {
        return;
      }

      if (isVisible && !this.visibilityMetadata) {
        this.visibilityMetadata = {
          UUID: generateUUID(),
          timestamp: new Date().getTime(),
          // If updating schema, please bump up version to make downstream analysis easier.
          version: 1,
        };
      } else if (this.visibilityMetadata) {
        this.visibilityMetadata = {
          ...this.visibilityMetadata,
          timestamp: new Date().getTime(),
        };
      }

      this.trackWithVisibilityMetadataForAction(isVisible ? 'view' : 'hide');

      if (!isVisible) {
        this.visibilityMetadata = undefined;
      }
    };

    handleUnload() {
      if (this.visibilityMetadata) {
        this.trackWithVisibilityMetadataForAction('hide');
      }
    }

    trackWithVisibilityMetadataForAction(actionName) {
      const { data, trackingName } = this.props;
      const { _eventData } = this.context;

      // TODO(zhaojun, cliu): figure out how to handle hide events
      if (actionName === 'hide') {
        return;
      }

      const toTrackData = {
        ...data,
        visibilityMetadata: this.visibilityMetadata,
      };
      this.sentVisibilityEvent = true;

      trackComponent(_eventData, toTrackData, trackingName, actionName);
    }

    // TODO(cliu): This is not completely robust, if for example, the div is behind a parent node, or
    // such as in the case of a carousel implementation. Look into more robust way of detecting visibility.
    isVisible() {
      const {
        visibilityTrackingDiv,
        props: { requireFullyVisible },
      } = this;
      // `visibilityTrackingDiv` may be NULL when the component is unmounted, according to React DOM documentation.
      // See https://facebook.github.io/react/docs/refs-and-the-dom.html#the-ref-callback-attribute
      if (visibilityTrackingDiv === null) {
        return false;
      }

      const isPageVisible = !document.hidden;
      if (!isPageVisible) {
        return false;
      }

      // This check allows carousel implementations to not fire view events when aria-hidden attribute is set
      const isComponentHiddenAccordingToAria = visibilityTrackingDiv.getAttribute('aria-hidden') === 'true';
      if (isComponentHiddenAccordingToAria) {
        return false;
      }

      const elementBounds = visibilityTrackingDiv.getBoundingClientRect();

      const windowBounds = {
        top: 0,
        left: 0,
        bottom: window.innerHeight || document.documentElement.clientHeight,
        right: window.innerWidth || document.documentElement.clientWidth,
      };

      return VisibilityTracking.isElementWithinCountainer(elementBounds, windowBounds, requireFullyVisible);
    }

    static isElementWithinCountainer(elementBounds, containerBounds, requireFullyVisible) {
      if (requireFullyVisible) {
        const fullyVisibleVertically =
          elementBounds.top >= containerBounds.top && elementBounds.bottom <= containerBounds.bottom;
        const fullyVisibleHorizontally =
          elementBounds.left >= containerBounds.left && elementBounds.right <= containerBounds.right;

        return fullyVisibleVertically && fullyVisibleHorizontally;
      } else {
        const partiallyVisibleVertically =
          (elementBounds.top >= containerBounds.top && elementBounds.top <= containerBounds.bottom) ||
          (elementBounds.bottom >= containerBounds.top && elementBounds.bottom <= containerBounds.bottom);

        const partiallyVisibleHorizontally =
          (elementBounds.left >= containerBounds.left && elementBounds.left <= containerBounds.right) ||
          (elementBounds.right >= containerBounds.left && elementBounds.right <= containerBounds.right);

        return partiallyVisibleVertically && partiallyVisibleHorizontally;
      }
    }

    startVisibilityTracking() {
      if (this.visibilityTrackingDiv !== null) {
        window.addEventListener('scroll', this.handleVisibilityCheckThrottled);
        window.addEventListener('resize', this.handleVisibilityCheckThrottled);
        window.addEventListener('animationend', this.handleVisibilityCheckThrottled);
        window.addEventListener('transitionend', this.handleVisibilityCheckThrottled);
        this.visibilityTrackingDiv.addEventListener('mouseenter', this.handleVisibilityCheckThrottled);
        window.addEventListener('unload', this.handleUnload);
        document.addEventListener('visibilitychange', this.handleVisibilityCheckThrottled);
        this.handleVisibilityCheck();
      }
    }

    stopVisibilityTracking() {
      // Always remove the listeners since our ref can (read: will) be unset before we unmount.
      window.removeEventListener('scroll', this.handleVisibilityCheckThrottled);
      window.removeEventListener('resize', this.handleVisibilityCheckThrottled);
      window.removeEventListener('animationend', this.handleVisibilityCheckThrottled);
      window.removeEventListener('transitionend', this.handleVisibilityCheckThrottled);
      window.removeEventListener('unload', this.handleUnload);
      document.removeEventListener('visibilitychange', this.handleVisibilityCheckThrottled);
      if (this.visibilityTrackingDiv !== null) {
        this.visibilityTrackingDiv.removeEventListener('mouseenter', this.handleVisibilityCheckThrottled);
        this.handleUnload();
      }
      this.handleVisibilityCheckThrottled.cancel();
      this.startVisibilityTrackingDebounced.cancel();
    }

    _handleRef = (ref) => {
      this.visibilityTrackingDiv = ref;
    };

    render() {
      const { 'aria-hidden': ariaHidden } = this.props;
      const componentProps = omit(this.props, 'requireFullyVisible', 'atMostOnce');
      return (
        <div ref={this._handleRef} aria-hidden={ariaHidden}>
          <Component {...componentProps} />
        </div>
      );
    }
  }
  hoistNonReactStatics(VisibilityTracking, Component);
  return VisibilityTracking;
}

/**
 * Hook for calling retrack trackComponent.
 * Returns a function that when call will log the event
 * It needs to have a trackingName, an action and trackingData, and it can be provided either when calling the hook,
 *  or when calling the log function
 * It automatically gets the namespace of the event from the context
 * 
 * 
    const trackMeClicked = useRetracked();
    return (
      <button type="button" onClick={() => trackMeClicked({ trackingName: 'track-me', action: 'click', trackingData: { value: 2 } })}>
        Track me!
      </button>
    );
 */
export const useRetracked = () => {
  const { eventData } = React.useContext(RetrackedContext);
  // We use useCallback to make sure that the function identity returned by useRetracked is stable and won’t change on re-renders
  // This is useful to prevent unnecessary renders
  return React.useCallback((props) => {
    trackComponent(eventData, props.trackingData, props.trackingName, props.action);
  }, []);
};

export default {
  setup,
  createContainer,
  makeTracker,
  createTrackedContainer,
  trackComponent,
  withVisibilityTracking,
};
