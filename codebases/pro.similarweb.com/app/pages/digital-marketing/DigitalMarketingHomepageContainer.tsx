import SWReactRootComponent from "decorators/SWReactRootComponent";
import React from "react";
import { DigitalMarketingDefault as DigitalMarketingDefaultOld } from "./home-pages/DigitalMarketingDefault";
import { DigitalMarketingDefault as DigitalMarketingDefaultNew } from "./home-pages/DigitalMarketingDefaultNew";
import { swSettings } from "common/services/swSettings";
import { DigitalMarketingNoTouchSearch } from "./home-pages/DigitalMarketingNoTouchSearch";
import { DigitalMarketingNoTouchDisplay } from "./home-pages/DigitalMarketingNoTouchDisplay";
import { DigitalMarketingNoTouchAffiliate } from "./home-pages/DigitalMarketingNoTouchAffiliate";
import {
    NT_SEARCH_MARKETING_PRODUCT_KEY,
    NT_DISPLAY_MARKETING_PRODUCT_KEY,
    NT_AFFILIATE_MARKETING_PRODUCT_KEY,
} from "constants/ntProductKeys";
import ABService, { EVwoDMIHomepageVariation } from "services/ABService";

export const DigitalMarketingModuleHomePage: React.FC = () => {
    const productKey = swSettings.components.Home.resources.ProductKey;
    const shouldShowNewHomepage =
        ABService.getFlag("vwoDMIHomepageVariation") !== EVwoDMIHomepageVariation.Control;

    if (shouldShowNewHomepage) {
        return <DigitalMarketingDefaultNew />;
    } else {
        switch (productKey) {
            case NT_SEARCH_MARKETING_PRODUCT_KEY:
                return <DigitalMarketingNoTouchSearch />;
            case NT_DISPLAY_MARKETING_PRODUCT_KEY:
                return <DigitalMarketingNoTouchDisplay />;
            case NT_AFFILIATE_MARKETING_PRODUCT_KEY:
                return <DigitalMarketingNoTouchAffiliate />;
            default:
                return <DigitalMarketingDefaultOld />;
        }
    }
};

SWReactRootComponent(DigitalMarketingModuleHomePage, "DigitalMarketingModuleHomePage");
