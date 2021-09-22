const CURRENT_POPOUT_VERSION = 2;
const ALLOWED_ORIGIN = [window.location.origin];

export enum PopoutMessageType {
    Unknown = 0,
    PopoutReady = 1,
    SetData = 2,
    CloseWindow = 3,
    DeeplinkReady = 4,
}

export interface PopoutMessage {
    version: number;
    type: PopoutMessageType;
    serializedData: string;
}

export function postMessage(targetWindow: Window, type: PopoutMessageType, data?: Object) {
    let message: PopoutMessage = {
        version: CURRENT_POPOUT_VERSION,
        type,
        serializedData: JSON.stringify(data),
    };

    // eslint-disable-next-line @microsoft/sdl/no-postmessage-star-origin
    targetWindow.postMessage(JSON.stringify(message), '*');
}

export function parseMessage(e: MessageEvent): PopoutMessage {
    if (ALLOWED_ORIGIN.indexOf(e.origin) >= 0) {
        let message: PopoutMessage;

        try {
            message = JSON.parse(e.data) as PopoutMessage;
        } catch {
            // Fail to parse message
            return null;
        }

        if (message) {
            if (CURRENT_POPOUT_VERSION == message.version) {
                return message;
            } else {
                // TODO: Handle version difference
            }
        }
    }

    return null;
}
