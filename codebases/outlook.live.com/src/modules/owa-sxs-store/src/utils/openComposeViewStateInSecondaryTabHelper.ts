let registeredCallback: (composeId: string) => void = null;

const openComposeViewStateInSecondaryTabHelper = {
    register: (callback: (composeId: string) => void) => {
        registeredCallback = callback;
    },
    available: () => !!registeredCallback,
    run: (composeId: string) => {
        if (registeredCallback) {
            registeredCallback(composeId);
        }
    },
};

export default openComposeViewStateInSecondaryTabHelper;
