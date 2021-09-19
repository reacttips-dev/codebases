import Titanite from 'titanite-javascript';
import ExecutionEnvironment from 'exenv';
import ab from 'react-redux-hydra';

import { clearEventQueue, storeEventInQueue } from 'actions/amethyst';
import { trackError } from 'helpers/ErrorUtils';
import { logDebug, logError, logToServer } from 'middleware/logger';

const zfcSessionId = ab.zfcSessionId();
const titaniteInstance = new Titanite();
const isTestEnv = process.env.NODE_ENV === 'test';

// make titanite global in case it needs to be shared via remote HF
if (ExecutionEnvironment.canUseDOM) {
  window.titanite = titaniteInstance;
}

if (zfcSessionId) {
  titaniteInstance.setDefaultFieldValue('sessionId', zfcSessionId);
} else if (ExecutionEnvironment.canUseDOM && window.zfcSessionId) {
  titaniteInstance.setDefaultFieldValue('sessionId', window.zfcSessionId);
}

let getAssignments = () => [];
export const registerGetAssignmentsFn = fn => getAssignments = fn;

let queuedAmethystEvents = [];

const addEventCallback = r => {
  const failed = !r.success || r.failedEvents && r.failedEvents.length;
  if (failed) {
    return trackError('NON-FATAL', 'Track Amethyst Event: Titanite FAILED', JSON.stringify(r));
  } else {
    logDebug('Track Amethyst Event: Titanite SUCCESS', JSON.stringify(r));
  }
};

const trackWithAmethyst = ({ eventFunction, eventData, titanite, dispatch, canUseDOM }) => {
  let payload;

  // if event is not passed in
  if (!eventData) {
    logDebug('Please pass in an amethyst event');
    return;
  }

  // if no current zfc session id is set
  if (!ab.zfcSessionId()) {
    logToServer(`[AMETHYST]: No ZFC session ID to set: ${eventFunction?.name || Object.keys(eventFunction || {})?.[0]}`);
  }

  // if using middleware ( 2 params vs original 3 )
  if (!eventFunction) {
    payload = { ...eventData, ...makeABData() };
  } else {
    payload = { ...eventFunction(eventData), ...makeABData() };
  }

  if (!canUseDOM) {
    if (!dispatch) {
      logError('Use serverTrack if attempting to fire an event server-side');
      return;
    }

    dispatch(storeEventInQueue(payload));
  } else if (!hasView) {
    // Queue events that have been fired before titaniteView() has been initiated.
    // Once we have a view then fire the queued events.
    queuedAmethystEvents.push(payload);
    return;
  } else {
    // dispatch amethyst event
    titanite.addEvent(payload, addEventCallback);
  }
};

export const flushServerSideQueue = (store, titanite = titaniteInstance) => {
  const { amethyst: { queue } } = store.getState();
  if (queue.length) {
    titanite.addEvents(queue, addEventCallback);
    store.dispatch(clearEventQueue());
  }
};

const fireQueuedAmethystEvents = (titanite = titaniteInstance) => {
  if (queuedAmethystEvents.length) {
    queuedAmethystEvents.forEach(payload => titanite.addEvent(payload, addEventCallback));
    queuedAmethystEvents = [];
  }
};

let hasView = false;
const trackViewWithTitanite = titanite => {
  if (hasView) {
    titanite.endView();
  }

  hasView = true;
  titanite.startView();

  fireQueuedAmethystEvents(titanite);
};

/**
 * tracking amethyst event Server-Side
 * @param  {Function} eventData       function that returns an array that contains the event function and object
 *                                    track(() => ([eventFunction, eventObject]))
 * @param  {Function} dispatch
 */
export const serverTrack = eventData => dispatch => track(eventData, dispatch);

/**
 * tracking amethyst event
 * @param  {Function} eventMethod       function that returns an array that contains the event function and object
 *                                    track(() => ([eventFunction, eventObject]))
 * @param  {Boolean} dispatch         needed if event is triggered server-side
 * All params below are for mocking and testing.
 * @param  {Boolean} canUseDOM        is the DOM available?
 * @param  {Object} titanite          Is the instance of titanite from the library?
 * @param  {Boolean} overrideTestEnv  Are we faking the test environment?
 * @param  {Function} sendTrackError  for tracking errors
 */
export const track = (
  eventMethod,
  dispatch = undefined,
  canUseDOM = ExecutionEnvironment.canUseDOM,
  titanite = titaniteInstance,
  overrideTestEnv = false,
  sendTrackError = trackError
) => {
  try {
    const [eventFunction, eventData] = eventMethod();
    if (eventFunction) {
      (!isTestEnv || overrideTestEnv) && trackWithAmethyst({ eventFunction, eventData, titanite, dispatch, canUseDOM });
    }
  } catch (err) {
    sendTrackError('NON-FATAL', 'Amethyst data error.', err);
  }
};

// new fire event middleware
export const middlewareTrack = (
  eventData,
  canUseDOM = ExecutionEnvironment.canUseDOM,
  titanite = titaniteInstance,
  overrideTestEnv = false
) => (!isTestEnv || overrideTestEnv) && trackWithAmethyst({ eventData, titanite, canUseDOM });

// fire start/end view
export const titaniteView = (
  canUseDOM = ExecutionEnvironment.canUseDOM,
  titanite = titaniteInstance
) => canUseDOM && trackViewWithTitanite(titanite);

// creates the ABTest data for the payload
export const makeABData = (assignments = getAssignments()) => {
  if (!assignments) {
    return {};
  }

  const abData = [];
  { Object.keys(assignments).map(test => {
    const { name, phase, index: testGroup } = assignments[test];
    abData.push({
      name,
      phase,
      testGroup
    });
  });
  }

  return { abTests: [...abData] };
};
