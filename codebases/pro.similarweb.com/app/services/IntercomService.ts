// https://developers.intercom.com/reference
import { i18nFilter } from "filters/ngFilters";

declare const window: {
    Intercom: any;
};

export const hideIntercom = () => {
    window.Intercom && window.Intercom("shutdown");
};

export const showIntercom = () => {
    window.Intercom && window.Intercom("boot");
};

export const showMarketingTour = () => {
    const id = parseInt(i18nFilter()("workspaces.marketing.product_tour.intercom_id"), 10);
    if (window.Intercom) {
        window.Intercom("startTour", id);
    }
};
