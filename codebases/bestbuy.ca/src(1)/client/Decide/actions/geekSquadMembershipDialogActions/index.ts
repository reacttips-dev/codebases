import {ActionCreatorsMapObject} from "redux";

export const geekSquadMembershipDialogActionTypes = {
    open: "GEEK_SQUAD_MEMBERSHIP_SUBSCRIPTION_DIALOG_OPEN",
    close: "GEEK_SQUAD_MEMBERSHIP_SUBSCRIPTION_DIALOG_CLOSE",
};

export interface GeekSquadMembershipDialogActionCreators extends ActionCreatorsMapObject {
    open: () => any;
    close: () => any;
}

export const geekSquadMembershipDialogActionCreators: GeekSquadMembershipDialogActionCreators = (() => {
    const open = () => {
        return {
            type: geekSquadMembershipDialogActionTypes.open,
        };
    };

    const close = () => {
        return {
            type: geekSquadMembershipDialogActionTypes.close,
        };
    };

    return {
        open,
        close,
    };
})();
