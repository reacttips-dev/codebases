import * as Redux from "redux";
const { combineReducers } = Redux;
import dashboardWizard from "components/dashboard/widget-wizard/reducers/dashboardWizardReducer";
import dashboardSideNav from "pages/dashboard/DashboardSideNavReducer";
import dashboardTemplate from "../../components/dashboard/dashboard-templates/reducers/dashboardTemplateReducer";
import dashboardCopyToUserDialog from "pages/dashboard/DashboardCopyToUserDialogReducer";

export const customDashboard = combineReducers({
    dashboardWizard,
    dashboardSideNav,
    dashboardTemplate,
    dashboardCopyToUserDialog,
});
