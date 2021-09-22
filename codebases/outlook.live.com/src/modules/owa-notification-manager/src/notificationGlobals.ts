import { getGuid } from 'owa-guid';

// Global notification state with side effects
let channelId: string;
let channelReady: Promise<void>;
let resolveReady: () => void;

export const getChannelId: () => string = () => {
    if (!channelId) {
        channelId = getGuid();
    }

    return channelId;
};

export const ensureChannelReadyInitialized = () => {
    if (channelReady === undefined) {
        /* tslint:disable:promise-must-complete */
        channelReady = new Promise(res => {
            resolveReady = res;
        });
        /* tslint:enable:promise-must-complete */
    }
};

export const getChannelReady: () => Promise<void> = () => {
    ensureChannelReadyInitialized();
    return channelReady;
};

export const resolveChannelReady = () => {
    ensureChannelReadyInitialized();
    resolveReady();
};

// Testing only
export const resetGlobals = () => {
    channelId = undefined;
    channelReady = undefined;
    resolveReady = undefined;
};
