import React from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { connect } from "react-redux";
import { setDialogIsOpen } from "./DashboardCopyToUserDialogActions";
import { ProModal } from "components/Modals/src/ProModal";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { ListItemUser } from "@similarweb/ui-components/dist/list-item";
import ImpersonateAuthModal from "components/React/ImpersonateAuth/ImpersonateAuthModal";
import ImpersonateAuthCtrl from "components/React/ImpersonateAuth/ImpersonateAuthCtrl";
import { Header } from "components/Dashboard/SharedDashboardModal";
import I18n from "components/React/Filters/I18n";
import { DefaultFetchService } from "services/fetchService";
import { duplicateDashboardTo } from "user-data/UserResource";
import { IDashboardNavItem } from "components/SecondaryBar/NavBars/DashboardsNavBar/DashboardNavBarTypes";
import { showSuccessToast } from "actions/toast_actions";
const fetchService = DefaultFetchService.getInstance();

interface IDashboardCopyToUserDialogProps {
    isOpen: boolean;
    setDialogIsOpen: (isOpen: boolean) => void;
    selectedDashboard: IDashboardNavItem;
    showCopyToSuccess: (message: string) => void;
}
const DashboardCopyToUserDialog: React.FC<IDashboardCopyToUserDialogProps> = ({
    isOpen,
    setDialogIsOpen,
    selectedDashboard,
    showCopyToSuccess,
}) => {
    const [showImpersonateAuth, setShowImpersonateAuth] = React.useState(false);
    const [showAutocomplete, setShowAutocomplete] = React.useState(false);
    const onClose = () => {
        setShowAutocomplete(false);
        setDialogIsOpen(false);
    };
    const onClickUser = (user) => async () => {
        const { Id: userId, UserName } = user;
        const { id: dashbordId, title: dashboardTitle } = selectedDashboard;
        const newDashboardTitle = `Copy of ${dashboardTitle}`;
        await duplicateDashboardTo({ Id: dashbordId, Name: newDashboardTitle, UserId: userId });
        showCopyToSuccess(`Copy of "${dashboardTitle}" to ${UserName} is done`);
        // setShowAutocomplete(false);
        // setDialogIsOpen(false);
    };
    const getListItems = async (query) => {
        const url = `/useridentity/getidentities?action=DuplicateDashboardToOthers&token=${query.trim()}`;
        const { Result: users } = await fetchService.get(url);
        return users.slice(0, 10).map((user) => {
            const { UserName, Id, AccountName } = user;
            return (
                <ListItemUser
                    key={Id.toString()}
                    email={AccountName}
                    name={UserName}
                    onClick={onClickUser(user)}
                >
                    {UserName}
                </ListItemUser>
            );
        });
    };
    const onImpersonateVerification = () => {
        setShowImpersonateAuth(false);
    };
    const onImpersonateClose = () => {
        setShowImpersonateAuth(false);
        setDialogIsOpen(false);
    };
    React.useEffect(() => {
        if (isOpen) {
            setShowImpersonateAuth(true);
            ImpersonateAuthCtrl.shouldAuthenticate()
                .then((res) => {
                    if (!res) {
                        setShowImpersonateAuth(false);
                        setShowAutocomplete(true);
                    }
                })
                .catch((err) => console.log(err));
        } else {
            setShowImpersonateAuth(false);
        }
    }, [isOpen]);
    const proModalProps: any = {
        customStyles: {
            content: {
                padding: "24px",
                width: "580px",
            },
        },
    };
    return (
        <>
            <ProModal isOpen={showAutocomplete} onCloseClick={onClose} {...proModalProps}>
                <Header>
                    <I18n>Usermanagement.Modal.Duplicate.Dashboard.Title</I18n>
                </Header>

                <Autocomplete
                    getListItems={getListItems}
                    loadingComponent={<DotsLoader />}
                    debounce={400}
                />
            </ProModal>
            {showImpersonateAuth ? (
                <ImpersonateAuthModal
                    onVerify={onImpersonateVerification}
                    onClose={onImpersonateClose}
                />
            ) : null}
        </>
    );
};
const mapStateToProps = (store) => {
    const { isOpen, selectedDashboard } = store.customDashboard.dashboardCopyToUserDialog;
    return {
        isOpen,
        selectedDashboard,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setDialogIsOpen: (isOpen = false) => {
            dispatch(setDialogIsOpen(isOpen));
        },
        showCopyToSuccess: (message) => {
            dispatch(showSuccessToast(message));
        },
    };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(DashboardCopyToUserDialog);

SWReactRootComponent(connected, "DashboardCopyToUserDialog");
export default connected;
