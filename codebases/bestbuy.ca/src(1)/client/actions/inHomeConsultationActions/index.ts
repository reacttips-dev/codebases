export const inHomeConsultationSellerActionTypes = {
    pageLoad: "IN_HOME_CONSULTATION_SIGN_UP_PAGE_LOAD",
};

export interface InHomeConsultationActionCreators {
    pageLoad: () => any;
}

export const inHomeConsultationActionCreators: InHomeConsultationActionCreators = (() => {
    const pageLoad = () => {
        return {
            type: inHomeConsultationSellerActionTypes.pageLoad,
        };
    };

    return {
        pageLoad,
    };
})();
