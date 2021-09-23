'use es6';

import { combineReducers } from 'redux';
import connectedAccounts from './reducers/connectedAccountReducer';
import content from './reducers/contentReducer';
import contentPayload from './reducers/contentPayloadReducer';
import decks from './reducers/decksReducer';
import enrollType from './reducers/enrollTypeReducer';
import salesModalInterface from './reducers/salesModalInterfaceReducer';
import sequence from './reducers/sequenceReducer';
import enrollHealthStatus from './reducers/enrollHealthStatusReducer';
import properties from './reducers/propertiesReducer';
import flattenedProperties from './reducers/flattenedPropertiesReducer';
import ui from './reducers/uiReducer';
import enrollmentState from './reducers/enrollmentState';
import tasks from './reducers/tasks';
export default combineReducers({
  connectedAccounts: connectedAccounts,
  content: content,
  contentPayload: contentPayload,
  decks: decks,
  enrollType: enrollType,
  salesModalInterface: salesModalInterface,
  sequence: sequence,
  enrollHealthStatus: enrollHealthStatus,
  properties: properties,
  flattenedProperties: flattenedProperties,
  ui: ui,
  enrollmentState: enrollmentState,
  tasks: tasks
});