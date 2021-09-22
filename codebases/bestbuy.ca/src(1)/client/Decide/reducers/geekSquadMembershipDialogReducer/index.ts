import { geekSquadMembershipDialogActionTypes } from "../../actions";

export interface GeekSquadMembershipDialogState {
    isOpen: boolean;
}

export const initialGeekSquadMembershipDialogState: GeekSquadMembershipDialogState = {
    isOpen: false,
};

export const geekSquadMembershipDialog = (state = initialGeekSquadMembershipDialogState, action): GeekSquadMembershipDialogState => {
    switch (action.type) {
        case geekSquadMembershipDialogActionTypes.close:
            return {
                ...state,
                isOpen: false,
            };
        case geekSquadMembershipDialogActionTypes.open:
            return {
                ...state,
                isOpen: true,
            };
        default:
            return state;
    }
};
