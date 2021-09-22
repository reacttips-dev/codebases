import { SET_DIALOG_IS_OPEN, SET_SELECTED_DASHBOARD } from "./DashboardCopyToUserDialogActionTypes";

const DEFAULT_DASHBOARD_COPY_TO_USER_DIALOG_STATE = { isOpen: false, selectedDashboard: null };

export default function (state = DEFAULT_DASHBOARD_COPY_TO_USER_DIALOG_STATE, action) {
    switch (action.type) {
        case SET_DIALOG_IS_OPEN:
            return {
                ...state,
                isOpen: action.isOpen,
            };
        case SET_SELECTED_DASHBOARD:
            return {
                ...state,
                selectedDashboard: action.selectedDashboard,
            };
        default:
            return {
                ...state,
            };
    }
}
