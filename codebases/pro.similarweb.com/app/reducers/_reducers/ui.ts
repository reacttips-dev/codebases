import { SHOW_TOAST, HIDE_TOAST, ToastAction } from "actions/toast_actions.ts";
import { IToast } from "components/React/Toast/types";

export interface UiState {
    toasts: IToast[];
}

const DEFAULT_STATE: UiState = {
    toasts: [],
};

type ActionType = ToastAction | { type: "" };

export const uiReducers = (state: UiState = DEFAULT_STATE, action: ActionType): UiState => {
    switch (action.type) {
        case HIDE_TOAST:
            return {
                ...state,
                toasts: state.toasts.filter(
                    (toast: IToast) => toast.timestamp !== action.toast.timestamp,
                ),
            };
        case SHOW_TOAST:
            return {
                ...state,
                toasts: [...state.toasts, action.toast],
            };
        default:
            return state;
    }
};

export default uiReducers;
