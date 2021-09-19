import ExecutionEnvironment from 'exenv';
import { select, take, takeEvery } from 'redux-saga/effects';

import allEvents from 'events';

import { CLIENT_VIEW_TRACKED } from 'constants/reduxActions';
import { getPageType } from 'store/ducks/readFromStore';
import { devLogger, logToServer } from 'middleware/logger';

export function* triggerEvent(allEventHandlers, appState, actionData, eventType) {
  devLogger(`[EVENT] Action Triggered: ${eventType}`);
  for (const index in allEventHandlers) {
    const eventHandler = allEventHandlers[index];
    const eventName = eventHandler.name;
    try {
      yield eventHandler(appState, actionData);
    } catch (e) {
      logToServer(`[EVENT] Failed on ${eventName}`, e);
    }
  }
}

export function* flushEvents(action = {}) {
  try {
    yield getPageMap(action, true);
  } catch (e) {
    devLogger('[EVENT SERVER SIDE] ERROR: ', e);
  }
}

export function* getPageMap(isServerSide, action, canUseDom = ExecutionEnvironment.canUseDOM, buildEvts = buildEvents) {
  if (canUseDom) {
    const pageType = yield select(getPageType);
    const pageInfo = allEvents[pageType];
    yield buildEvts(action, isServerSide, pageInfo);
  }
}

export function* buildEvents(action, isServerSide, pageInfo, pageEvents = allEvents) {
  // global event
  if (pageEvents.globalEvents.events[action.type]) {
    const appState = yield select();
    const eventHandler = pageEvents.globalEvents.events[action.type];
    yield triggerEvent(eventHandler, appState, action, action.type);
  }

  const eventState = yield select();
  const eventObj = typeof pageInfo === 'function' ? pageInfo(eventState) : pageInfo;
  if (eventObj) {
    const { clientCalled, events, hasRedirects = false, pageEvent } = eventObj;
    if (events && pageEvent) {
      if (!hasRedirects && isServerSide) {
        if (clientCalled) {
          yield take(clientCalled);
        }
        const appState = yield select();
        const allEventHandlers = events[pageEvent];
        if (allEventHandlers) {
          yield triggerEvent(allEventHandlers, appState, action, 'PageEvent');
        }
      } else if ((!hasRedirects && action.type === CLIENT_VIEW_TRACKED) || (!isServerSide && hasRedirects && clientCalled === action.type)) {
        const allEventHandlers = events[pageEvent];
        if (allEventHandlers) {
          const appState = yield select();
          yield triggerEvent(allEventHandlers, appState, action, 'PageEvent');
        }
      } else if (!hasRedirects && events[action.type]) {
        const appState = yield select();
        yield triggerEvent(events[action.type], appState, action, action.type);
      }
    }
  }
}

export function* clientInitiatedEvents() {
  try {
    yield takeEvery('*', getPageMap, false);
  } catch (e) {
    devLogger('[EVENT ACTION EVENT] ERROR: ', e);
  }
}

export default [
  flushEvents,
  clientInitiatedEvents
];
