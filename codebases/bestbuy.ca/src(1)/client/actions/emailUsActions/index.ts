import {Location} from "history";
import {State} from "store";
import routeManager from "utils/routeManager";
import {routingActionCreators} from "actions/routingActions";
import {ContactUsRequest} from "@bbyca/ecomm-communications-components/dist/redux/providers/CommunicationProvider/requests/SendMessageRequest";
import {notificationActionCreators} from "actions";
import {ApiCsrfTokenProvider} from "@bbyca/account-components";
import {ApiContactUsProvider} from "@bbyca/ecomm-communications-components";
import {ActionCreatorsMapObject} from "redux";

export interface EmailUsActionCreators extends ActionCreatorsMapObject {
    syncEmailUsStateWithLocation: (location: Location) => any;
    sendFormData: (formData: ContactUsRequest, locale: Locale, retryAction: () => any) => any;
}

export const emailUsActionCreators: EmailUsActionCreators = (() => {
    const syncEmailUsStateWithLocation = (location: Location) => {
        return async (dispatch, getState) => {
            const state: State = getState();
            const previousLocation =
                state.routing.previousLocationBeforeTransitions || state.routing.locationBeforeTransitions;
            if (typeof window !== "undefined" && previousLocation.pathname === location.pathname) {
                return;
            }
            const language = state.intl.language;
            await dispatch(
                routingActionCreators.setAltLangHrefs({
                    altLangUrl: routeManager.getAltLangPathByKey(language, "emailUs"),
                    curLangUrl: routeManager.getCurrLang(location.pathname),
                }),
            );
        };
    };

    const sendFormData = (payload, locale, retryAction) => {
        return async (dispatch, getState) => {
            try {
                const state: State = getState();
                const cieServiceURL = state.config.appPaths.customerIdentityExperienceService;
                const communicationApiUrl = state.config.dataSources.communicationApiUrl;
                const contactUsProvider = new ApiContactUsProvider(
                    communicationApiUrl,
                    new ApiCsrfTokenProvider(cieServiceURL),
                );

                await contactUsProvider.sendContactUsMessage(locale, payload);
            } catch (error) {
                await dispatch(notificationActionCreators.connectionError(retryAction));
                throw error;
            }
        };
    };

    return {
        syncEmailUsStateWithLocation,
        sendFormData,
    };
})();
