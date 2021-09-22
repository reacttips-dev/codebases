import _ from 'underscore';
import _t from 'i18n!nls/widget';
import createStoreFromReducer from 'js/lib/create-store-from-reducer';
import { Actions as WidgetActions, WidgetReadyStates } from 'bundles/widget/constants/WidgetConstants';
import { deepCopy } from 'bundles/widget/utils';

export type ConnectedWidget = {
  removeListenerHandle: () => void;
  isConnected: true;
};

export type DisconnectedWidget = {
  isConnected: false;
};

export type WidgetRegistry = {
  [widgetId: string]: ConnectedWidget | DisconnectedWidget;
};

export type WidgetError = {
  code: string;
  message: string;
};

export type WidgetState = {
  widgetId: string;
  error?: WidgetError;
  readyState:
    | typeof WidgetReadyStates.NOT_LOADED
    | typeof WidgetReadyStates.REGISTERING
    | typeof WidgetReadyStates.READY
    | typeof WidgetReadyStates.ERROR;
};

type WidgetStates = {
  [widgetId: string]: WidgetState;
};

export type WidgetManagerState = {
  widgetRegistry: WidgetRegistry;
  widgetStates: WidgetStates;
  error?: WidgetError;
};

type Action =
  | {
      type: typeof WidgetActions.REGISTER_WIDGET_ID;
      widgetId: string;
    }
  | {
      type: typeof WidgetActions.DISCONNECT_WIDGET;
      widgetId: string;
    }
  | {
      type: typeof WidgetActions.CONNECT_WIDGET;
      widgetId: string;
      removeListenerHandle: () => void;
    }
  | {
      type: typeof WidgetActions.REGISTER_WIDGET_ID_CONFLICT;
      widgetId: string;
    }
  | {
      type: typeof WidgetActions.CONNECT_WIDGET_ERROR;
      widgetId: string;
      errorMessage: string;
    }
  | {
      type: typeof WidgetActions.DISPLAY_ERROR_MESSAGE;
      widgetId: string;
      error:
        | Error
        | WidgetError
        | string
        | {
            stack: string;
          };
    };

const initialState = {
  widgetRegistry: {},
  widgetStates: {},
};

function WidgetManager(state: WidgetManagerState = initialState, action: Action) {
  // Do not use the "JSON.parse(JSON.stringify(" method for deep copying widgetRegistry
  // as it contains non-serizliable values (functions).
  const widgetRegistry: WidgetRegistry = deepCopy(state.widgetRegistry);
  const widgetStates: WidgetStates = JSON.parse(JSON.stringify(state.widgetStates));
  const widgetState = {} as WidgetState;
  const { widgetId } = action;

  switch (action.type) {
    case WidgetActions.REGISTER_WIDGET_ID:
      widgetRegistry[widgetId] = {
        isConnected: false,
      };

      widgetState.widgetId = widgetId;
      widgetState.readyState = WidgetReadyStates.REGISTERING;

      widgetStates[widgetId] = widgetState;

      return {
        ...state,
        widgetRegistry,
        widgetStates,
      };
    case WidgetActions.REGISTER_WIDGET_ID_CONFLICT:
      return {
        ...state,
        error: {
          code: 'widgetIdConflict',
          message: _t('There is a conflicting Widget Id: ') + widgetId,
        },
      };
    case WidgetActions.CONNECT_WIDGET:
      widgetRegistry[widgetId] = {
        removeListenerHandle: action.removeListenerHandle,
        isConnected: true,
      };

      widgetState.widgetId = widgetId;
      widgetState.readyState = WidgetReadyStates.READY;

      widgetStates[widgetId] = widgetState;

      return {
        ...state,
        widgetRegistry,
        widgetStates,
      };
    case WidgetActions.CONNECT_WIDGET_ERROR:
      widgetState.widgetId = widgetId;
      widgetState.readyState = WidgetReadyStates.ERROR;
      widgetState.error = {
        code: 'failedWidgetConnection',
        message: _t('Error encountered while loading widget. Please kindly refresh the page.'),
      };
      // eslint-disable-next-line no-console
      console.error(action.errorMessage);

      widgetStates[widgetId] = widgetState;

      return {
        ...state,
        widgetStates,
      };
    case WidgetActions.DISCONNECT_WIDGET:
      delete widgetRegistry[widgetId];
      widgetState.widgetId = widgetId;
      widgetState.readyState = WidgetReadyStates.NOT_LOADED;

      widgetStates[widgetId] = widgetState;

      return {
        ...state,
        widgetRegistry,
        widgetStates,
      };
    case WidgetActions.DISPLAY_ERROR_MESSAGE:
      widgetState.widgetId = widgetId;
      widgetState.readyState = WidgetReadyStates.ERROR;
      widgetState.error = {
        code: 'widgetInternalError',
        message: _t('There is an internal error with the widget.'),
      };

      if ((action.error as { stack: string }).stack) {
        // eslint-disable-next-line no-console
        console.error((action.error as { stack: string }).stack);
      } else {
        // eslint-disable-next-line no-console
        console.error(action.error);
      }

      widgetStates[widgetId] = widgetState;

      return {
        ...state,
        widgetStates,
      };
    default:
      return state;
  }
}

const actionValues = _.values(WidgetActions);

export const store = createStoreFromReducer<WidgetManagerState, Action>(
  WidgetManager,
  'WidgetManagerStore',
  actionValues,
  initialState
);
export const reducer = WidgetManager;
