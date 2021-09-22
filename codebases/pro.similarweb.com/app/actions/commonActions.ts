/**
 * Created by Eyal.Albilia on 5/4/2017.
 */
import {
    COMMON_SW_SETTINGS_READY,
    COMMON_UPDATE_BETA_VS_LIVE_TOGGLE,
    COMMON_UPDATE_BETA_VS_LIVE_TOGGLE_CCOMPLETED,
    COMMON_UPDATE_ESTIMATED_VS_GA_TOGGLE,
    CREATE_USERMANAGEMENT_LINK,
    EMPTY_TOP_BAR,
    ESTIMATIONS_VS_GA_USER_PREFRENCES_UPDATE_FAILURE,
    ESTIMATIONS_VS_GA_USER_PREFRENCES_UPDATE_SUCCESS,
    HIDE_COUNTRY_TOOLTIP,
    HIDE_TOP_NAV,
    HIDE_WEBSOURCE_TOOLTIP,
    TOGGLE_RESET_BETA_VS_LIVE_MODAL,
    POPULATE_TOP_BAR,
    REMOVE_USERMANAGEMENT_LINK,
    SHOW_TOP_NAV,
    UNSUPPORTED_COUNTRY_REDIRECT,
    UNSUPPORTED_WEBSOURCE_REDIRECT,
} from "../action_types/common_action_types";

export const betaVsLiveSwitchToggle = (value, isUpdating = false) => {
    return {
        type: COMMON_UPDATE_BETA_VS_LIVE_TOGGLE,
        value,
        isUpdating,
    };
};

export const betaVsLiveUpdateCompleted = () => {
    return {
        type: COMMON_UPDATE_BETA_VS_LIVE_TOGGLE_CCOMPLETED,
    };
};

export const toggleResetBetaBranchModal = (isOpen, updateParams) => {
    return {
        type: TOGGLE_RESET_BETA_VS_LIVE_MODAL,
        isOpen,
        updateParams,
    };
};

export const estimatedVsGaSwitchToggle = (showGAApprovedData) => {
    return {
        type: COMMON_UPDATE_ESTIMATED_VS_GA_TOGGLE,
        showGAApprovedData,
    };
};

export const swSettingsReady = (swSettings) => {
    return {
        type: COMMON_SW_SETTINGS_READY,
        swSettings,
    };
};

export const estimationsVsGaUserPreferencesUpdateSuccess = (response) => {
    return {
        type: ESTIMATIONS_VS_GA_USER_PREFRENCES_UPDATE_SUCCESS,
        response,
    };
};

export const estimationsVsGaUserPreferencesUpdateFailure = (error) => {
    return {
        type: ESTIMATIONS_VS_GA_USER_PREFRENCES_UPDATE_FAILURE,
        error,
    };
};

export const onUnsupportedWebSourceRedirect = () => {
    return {
        type: UNSUPPORTED_WEBSOURCE_REDIRECT,
    };
};

export const onUnsupportedCountryRedirect = () => {
    return {
        type: UNSUPPORTED_COUNTRY_REDIRECT,
    };
};

export const hideWebsourceTooltip = () => {
    return {
        type: HIDE_WEBSOURCE_TOOLTIP,
    };
};

export const showTopNav = () => {
    return {
        type: SHOW_TOP_NAV,
    };
};

export const hideTopNav = () => {
    return {
        type: HIDE_TOP_NAV,
    };
};

export const emptyTopBar = () => {
    return {
        type: EMPTY_TOP_BAR,
    };
};

export const populateTopBar = () => {
    return {
        type: POPULATE_TOP_BAR,
    };
};

export const hideCountryTooltip = () => {
    return {
        type: HIDE_COUNTRY_TOOLTIP,
    };
};

export const createUserManagementLink = (userManagementLink) => {
    return {
        type: CREATE_USERMANAGEMENT_LINK,
        userManagementLink,
    };
};

export const removeUserManagementLink = (linkId) => {
    return {
        type: REMOVE_USERMANAGEMENT_LINK,
        linkId,
    };
};
