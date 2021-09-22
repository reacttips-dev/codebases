import {ActionCreatorsMapObject} from "redux";

export const businessContactActionTypes = {
    pageLoad: "BUSINESS_CONTACT_PAGE_LOAD",
};

export interface BusinessContactActionCreators extends ActionCreatorsMapObject {
    pageLoad: () => any;
}

export const businessContactActionCreators: BusinessContactActionCreators = (() => {
    const pageLoad = () => {
        return {
            type: businessContactActionTypes.pageLoad,
        };
    };

    return {
        pageLoad,
    };
})();
