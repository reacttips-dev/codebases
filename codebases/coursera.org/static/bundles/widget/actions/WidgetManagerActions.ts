import type Q from 'q';
import type { WidgetRegistry } from 'bundles/widget/reducers/WidgetManagerReducer';
import type { ActionContext } from 'js/lib/ActionContext';
import type { CourseraConnectMessage } from 'bundles/widget/types/Request';

import CourseraConnect from 'bundles/widget/lib/coursera-connect-parent';
import { Actions as WidgetActions } from 'bundles/widget/constants/WidgetConstants';

export const registerWidget = (
  actionContext: ActionContext,
  {
    widgetId,
    widgetRegistry,
  }: {
    widgetId: string;
    widgetRegistry: WidgetRegistry;
  }
) => {
  const isWidgetIdTaken = widgetRegistry[widgetId];

  if (isWidgetIdTaken) {
    actionContext.dispatch(WidgetActions.REGISTER_WIDGET_ID_CONFLICT, { widgetId });
  } else {
    actionContext.dispatch(WidgetActions.REGISTER_WIDGET_ID, { widgetId });
  }
};

export const connectToWidget = (
  actionContext: ActionContext,
  {
    iFrameSrc,
    widgetId,
    rpcActionTypes,
    onReceiveMessage,
    sendMessageToIFrame,
  }: {
    iFrameSrc: string;
    widgetId: string;
    rpcActionTypes: Array<string>;
    onReceiveMessage: (request: CourseraConnectMessage) => Q.Promise<any>;
    sendMessageToIFrame: () => void;
  }
) => {
  if (rpcActionTypes) {
    CourseraConnect.initiateChild(sendMessageToIFrame, widgetId, iFrameSrc)
      .then(() => {
        const removeListenerHandle = CourseraConnect.listenToChildMessages(
          widgetId,
          rpcActionTypes,
          onReceiveMessage,
          sendMessageToIFrame,
          iFrameSrc
        );
        actionContext.dispatch(WidgetActions.CONNECT_WIDGET, {
          widgetId,
          removeListenerHandle,
        });
      })
      .catch((errorMessage: string) => {
        actionContext.dispatch(WidgetActions.CONNECT_WIDGET_ERROR, {
          widgetId,
          errorMessage,
        });
      });
  } else {
    // no need to make connections if there are no rpc actions specified.
    const removeListenerHandle = () => {};
    actionContext.dispatch(WidgetActions.CONNECT_WIDGET, {
      widgetId,
      removeListenerHandle,
    });
  }
};

export const removeWidget = (
  actionContext: ActionContext,
  {
    widgetId,
    removeListenerHandle,
  }: {
    widgetId: string;
    removeListenerHandle: () => void;
  }
) => {
  removeListenerHandle();
  actionContext.dispatch(WidgetActions.DISCONNECT_WIDGET, { widgetId });
};

export const toggleWidgetError = (
  actionContext: ActionContext,
  {
    widgetId,
    error,
  }: {
    widgetId: string;
    error: Error;
  }
) => {
  actionContext.dispatch(WidgetActions.DISPLAY_ERROR_MESSAGE, { widgetId, error });
};
