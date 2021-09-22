import {Action} from "../";
import State from "../../store";
import {ActionCreatorsMapObject} from "redux";

export const notificationActionType = {
    close: "NOTIFICATION_CLOSE",
    notify: "NOTIFICATION_NOTIFY",
};

export interface Action {
    name: string;
    onAction: () => void;
}

export interface NotificationActionCreators extends ActionCreatorsMapObject {
    close();
    notify(message: string, action?: Action, autoHideDuration?: number);
    connectionError(...retryActionCreator: Array<() => void>);
    addToCartError();
    geoLocationError();
    geeksquadChatLoadError();
    homepageError();
}

export const notificationActionCreators: NotificationActionCreators = (() => {
    const close = () => {
        return {
            type: notificationActionType.close,
        };
    };

    const notify = (message: string, action?: Action, autoHideDuration?: number) => {
        return {
            message,
            action,
            autoHideDuration,
            type: notificationActionType.notify,
        };
    };

    const connectionError = (...retryActionCreator: Array<() => void>) => {
        return (dispatch, getState) => {
            const messages = (getState() as State).intl.messages;
            const onAction = async () => {
                dispatch(close());

                for (const action of retryActionCreator) {
                    await dispatch(action());
                }
            };

            dispatch(
                notify(messages["common.notification.connectionError"], {
                    name: messages["common.notification.retry"],
                    onAction,
                }),
            );
        };
    };

    const homepageError = (...retryActionCreator: Array<() => void>) => {
        return (dispatch, getState) => {
            const messages = (getState() as State).intl.messages;
            const onAction = async () => {
                dispatch(close());

                for (const action of retryActionCreator) {
                    await dispatch(action());
                }
            };

            dispatch(
                notify(messages["common.notification.connectionError"], {
                    name: messages["common.notification.retry"],
                    onAction,
                }),
            );
        };
    };

    const addToCartError = () => {
        return (dispatch, getState) => {
            const messages = (getState() as State).intl.messages;
            dispatch(notify(messages["common.notification.addToCartError"], undefined, 2000));
        };
    };

    const geoLocationError = () => {
        return (dispatch, getState) => {
            const messages = (getState() as State).intl.messages;

            dispatch(notify(messages["common.notification.geoLocationError"], undefined, 2000));
        };
    };

    const geeksquadChatLoadError = () => {
        return (dispatch, getState) => {
            const messages = (getState() as State).intl.messages;
            const onAction = () => dispatch(close());

            dispatch(
                notify(messages["common.notification.geeksquadChatLoadError"], {
                    name: messages["common.notification.dismiss"],
                    onAction,
                }),
            );
        };
    };

    return {
        close,
        notify,
        connectionError,
        addToCartError,
        geoLocationError,
        geeksquadChatLoadError,
        homepageError,
    };
})();
