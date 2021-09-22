/**
 * Created by olegg on 18-May-17.
 */
import * as popularPagesActions from "action_types/popularPages_action_types";

export const popularPagesDataFetched = (payload) => {
    return {
        type: popularPagesActions.POPULAR_PAGES_DATA_FETCHED,
        payload,
    };
};

export const popularPagesDataFetching = () => {
    return {
        type: popularPagesActions.POPULAR_PAGES_DATA_FETCHING,
    };
};

export const popularPagesCheckboxChanged = (checkboxIsSelected: boolean) => {
    return {
        type: popularPagesActions.POPULAR_PAGES_UTM_CHECKBOX_CLICKED,
        checkboxIsSelected,
    };
};

export const popularPagesRadioButtonClicked = (radioButtonItem: string) => {
    return {
        type: popularPagesActions.POPULAR_PAGES_RADIO_BUTTON_CLICKED,
        radioButtonItem,
    };
};
export const popularPagesShowRequestMessage = (keys, isRobotsError) => {
    return {
        type: popularPagesActions.POPULAR_PAGES_SHOW_REQUEST_MESSAGE,
        keys,
        isRobotsError,
    };
};
export const popularPagesHideRequestMessage = (keys) => {
    return {
        type: popularPagesActions.POPULAR_PAGES_HIDE_REQUEST_MESSAGE,
        keys,
    };
};
