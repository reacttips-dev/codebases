const popoutLoadedCallbacks: PopoutLoadedCallback[] = [];
type PopoutLoadedCallback = (tabId: string) => Promise<void>;

export const popoutLoaded = (tabId: string) => {
    for (const cb of popoutLoadedCallbacks) {
        cb(tabId);
    }
};

export const registerPopoutLoadedCallback = (cb: PopoutLoadedCallback) => {
    popoutLoadedCallbacks.push(cb);
};
