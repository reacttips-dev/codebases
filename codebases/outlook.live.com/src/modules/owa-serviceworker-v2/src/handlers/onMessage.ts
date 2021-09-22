import * as trace from '../utils/trace';
import { Action, ClientMessage } from 'owa-serviceworker-common';
import install from '../actions/install';
import uninstall from '../actions/uninstall';
import { setClientId } from '../analytics/logDatapoint';
import { setWindowHeight, setReadingPanePosition } from '../utils/preloadStartupData';

export function onMessage(event: ExtendableMessageEvent): any {
    trace.log('Message Recieved', event?.data);
    if (event.data) {
        const message = <ClientMessage>event.data;
        setClientId(message.clientId);
        setWindowHeight(message.windowHeight);
        setReadingPanePosition(message.readingPanePosition);
        if (typeof message.tracingEnabled == 'string') {
            trace.tracingToggle(message.tracingEnabled);
        }
        if (message.source) {
            switch (message.action) {
                case Action.Install:
                    install(message);
                    break;
                case Action.UnInstall:
                    uninstall(message);
                    break;
            }
        }
    }
}
