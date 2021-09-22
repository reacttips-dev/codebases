import {ActionCreatorsMapObject} from "redux";

export const healthContactActionTypes = {
    pageLoad: "HEALTH_CONTACT_PAGE_LOAD",
};

export interface HealthContactActionCreators extends ActionCreatorsMapObject {
    pageLoad: () => any;
}

export const healthContactActionCreators: HealthContactActionCreators = (() => {
    const pageLoad = () => {
        return {
            type: healthContactActionTypes.pageLoad,
        };
    };

    return {
        pageLoad,
    };
})();
