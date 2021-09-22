import React, { FunctionComponent } from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { FindAffiliateByIndustryHomePage } from "pages/digital-marketing/find-affiliate/home-pages/FindAffiliateByIndustryHomePage";

const FindAffiliateByIndustryHomePageContainer: FunctionComponent = () => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");

    const visitTrafficChannels = ({
        category,
        country,
    }: {
        category: string;
        country: number;
    }): void => {
        swNavigator.go("findaffiliates_byindustry", {
            category,
            country,
            duration: "3m",
            webSource: "Desktop",
            selectedSourceType: "Referral",
        });
    };
    return <FindAffiliateByIndustryHomePage visitTrafficChannels={visitTrafficChannels} />;
};

SWReactRootComponent(
    FindAffiliateByIndustryHomePageContainer,
    "FindAffiliateByIndustryHomePageContainer",
);
