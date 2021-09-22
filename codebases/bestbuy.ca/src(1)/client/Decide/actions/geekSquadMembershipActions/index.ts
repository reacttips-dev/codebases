import {ActionCreatorsMapObject} from "redux";

export const geekSquadMembershipActionTypes = {
    pageLoad: "GEEK_SQUAD_MEMBERSHIP_PAGE_LOAD",
};

export interface GeekSquadMembershipActionCreators extends ActionCreatorsMapObject {
    pageLoad: () => any;
}

export const geekSquadMembershipActionCreators: GeekSquadMembershipActionCreators = (() => {
    const pageLoad = () => {
        return {
            type: geekSquadMembershipActionTypes.pageLoad,
        };
    };

    return {
        pageLoad,
    };
})();
