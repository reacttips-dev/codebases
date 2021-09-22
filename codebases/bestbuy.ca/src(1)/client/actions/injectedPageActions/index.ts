export const injectedPageActionTypes = {
    trackPageLoad: "INJECTED_PAGE_LOAD",
};

export interface InjectedPageActionCreators {
    trackInjectedPageLoad: (dispatch) => any;
}

export const injectedPageActionCreator: InjectedPageActionCreators = (() => {
    const trackInjectedPageLoad = (dispatch) => {
        return (url) =>
            dispatch({
                type: injectedPageActionTypes.trackPageLoad,
                payload: url,
            });
    };

    return {
        trackInjectedPageLoad,
    };
})();
