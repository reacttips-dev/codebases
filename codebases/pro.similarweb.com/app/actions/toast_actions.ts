import { IToast } from "components/React/Toast/types";

export type SHOW_TOAST = "SHOW_TOAST";
export const SHOW_TOAST: SHOW_TOAST = "SHOW_TOAST";
export type HIDE_TOAST = "HIDE_TOAST";
export const HIDE_TOAST: HIDE_TOAST = "HIDE_TOAST";

export interface ToastAction {
    type: SHOW_TOAST | HIDE_TOAST;
    toast: IToast;
}

const showToast = (text: string, className: string) => ({
    type: SHOW_TOAST,
    toast: {
        timestamp: Date.now(),
        text,
        className,
    },
});

export const hideToast = (toast: IToast): ToastAction => ({
    type: HIDE_TOAST,
    toast,
});

export const showSuccessToast = (text?: any) => (dispatch: any, getState: any): void => {
    const toastAction = showToast(text, "success");
    dispatch(showToast(text, "success"));
    setTimeout(() => dispatch(hideToast(toastAction.toast)), 5000);
};

export const showErrorToast = (text?: string) => (dispatch: any, getState: any): void => {
    const toastAction = showToast(text, "error");
    dispatch(showToast(text, "error"));
    setTimeout(() => dispatch(hideToast(toastAction.toast)), 3500);
};
