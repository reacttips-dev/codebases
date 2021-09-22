let registeredCallback: (targetWindow: Window, sxsId: string) => void = null;

const insertSxSV2IntoDomHelper = {
    register: (callback: (targetWindow: Window, sxsId: string) => void) => {
        registeredCallback = callback;
    },
    available: () => !!registeredCallback,
    run: (targetWindow: Window, sxsId: string) => {
        if (registeredCallback) {
            registeredCallback(targetWindow, sxsId);
        }
    },
};

export default insertSxSV2IntoDomHelper;
