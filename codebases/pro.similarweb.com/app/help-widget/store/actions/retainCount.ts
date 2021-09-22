import { IHelpWidget } from "help-widget/HelpWidget";
import { UPDATE_COUNT } from "help-widget/store/actionTypes";
import { selectCount, selectPreviousCount } from "help-widget/store/reducers/main";
import debounce from "lodash/debounce";
import { hideIntercom, showIntercom } from "services/IntercomService";

const updateCountBy = (value: number) => ({
    type: UPDATE_COUNT,
    payload: value,
});

// Debouncing to prevent unnecessary hide/show calls
const reactToChange = debounce((getState, helpWidget) => {
    const state = getState();
    const count = selectCount(state);
    const previousCount = selectPreviousCount(state);

    if (count > 0 && !previousCount) {
        helpWidget.show();
        hideIntercom();
    }
    if (count === 0 && previousCount > 0) {
        helpWidget.close();
        helpWidget.hide();
        showIntercom();
    }
}, 200);

const update = (value: number, helpWidget: IHelpWidget) => (dispatch, getState) => {
    dispatch(updateCountBy(value));
    reactToChange(getState, helpWidget);
};

export const increment = (helpWidget: IHelpWidget) => update(1, helpWidget);
export const decrement = (helpWidget: IHelpWidget) => update(-1, helpWidget);
