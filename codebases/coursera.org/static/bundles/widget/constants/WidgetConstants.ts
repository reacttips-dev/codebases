/**
 * Constants representing server and view actions for Widgets
 */

/**
 * Actions used by the widget frame to communicate with the widget.
 */
const Actions: {
  REGISTER_WIDGET_ID: 'registerWidgetId';
  REGISTER_WIDGET_ID_CONFLICT: 'registerWidgetIdConflict';
  CONNECT_WIDGET: 'connectWidget';
  CONNECT_WIDGET_ERROR: 'connectWidgetError';
  DISCONNECT_WIDGET: 'disconnectWidget';
  DISPLAY_ERROR_MESSAGE: 'displayErrorMessage';
} = {
  REGISTER_WIDGET_ID: 'registerWidgetId',
  REGISTER_WIDGET_ID_CONFLICT: 'registerWidgetIdConflict',
  CONNECT_WIDGET: 'connectWidget',
  CONNECT_WIDGET_ERROR: 'connectWidgetError',
  DISCONNECT_WIDGET: 'disconnectWidget',
  DISPLAY_ERROR_MESSAGE: 'displayErrorMessage',
};

/**
 * RPC Actions are possible actions that a widget can call.
 *
 * TODO: These are out of date. There are more RPC actions than this.
 */
const RPCActions: {
  LOAD_WIDGET_ERROR: 'LOAD_WIDGET_ERROR'; // default RPC action. widget developers should not be able to call this.
  SET_COMPLETE: 'SET_COMPLETE';
  GET_SESSION_CONFIGURATION: 'GET_SESSION_CONFIGURATION';
  SET_ANSWER: 'SET_ANSWER';
  SET_HEIGHT: 'SET_HEIGHT';
} = {
  LOAD_WIDGET_ERROR: 'LOAD_WIDGET_ERROR',
  SET_COMPLETE: 'SET_COMPLETE',
  GET_SESSION_CONFIGURATION: 'GET_SESSION_CONFIGURATION',
  SET_ANSWER: 'SET_ANSWER',
  SET_HEIGHT: 'SET_HEIGHT',
};

const WidgetReadyStates: {
  NOT_LOADED: 'notLoaded';
  REGISTERING: 'registering';
  READY: 'ready';
  ERROR: 'error';
} = {
  NOT_LOADED: 'notLoaded',
  REGISTERING: 'registering',
  READY: 'ready',
  ERROR: 'error',
};

const FocusableElements = {
  FOCUSABLE_SELECTOR: 'a,button,textarea,input,select,div[contenteditable="true"],[tabindex="0"], iframe',
  NOT_FOCUSABLE: '[tabindex=-1],[disabled],:hidden',
};

export default {
  Actions,
  RPCActions,
  WidgetReadyStates,
  FocusableElements,
};

export { Actions, RPCActions, WidgetReadyStates, FocusableElements };
