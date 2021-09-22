import { SET_DIALOG_IS_OPEN, SET_SELECTED_DASHBOARD } from "./DashboardCopyToUserDialogActionTypes";

export const setDialogIsOpen = (isOpen = false) => {
    return {
        type: SET_DIALOG_IS_OPEN,
        isOpen,
    };
};
export const setSelectedDashboard = (selectedDashboard = null) => {
    return {
        type: SET_SELECTED_DASHBOARD,
        selectedDashboard,
    };
};
