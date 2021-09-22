import React, { FC } from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { Injector } from "common/ioc/Injector";
import { DisplayAdsCompareContainer } from "pages/website-analysis/traffic-sources/display-ads/overview/compare/DisplayAdsCompareContainer";
import { DisplayAdsSingleContainer } from "pages/website-analysis/traffic-sources/display-ads/overview/single/DisplayAdsSingleContainer";

export const DisplayAdsOverviewPage: FC<any> = () => {
    const swNavigator = Injector.get("swNavigator") as any;
    const params = swNavigator.getParams();
    const chosenSitesService = Injector.get("chosenSites") as any;
    const getSiteColor = chosenSitesService.getSiteColor;
    const chosenSites = chosenSitesService.get;
    const isCompare = params.key.split(",").length > 1;

    return (
        <>
            {isCompare && (
                <DisplayAdsCompareContainer
                    params={params}
                    getSiteColor={getSiteColor}
                    chosenSites={chosenSites}
                />
            )}
            {!isCompare && (
                <DisplayAdsSingleContainer
                    params={params}
                    getSiteColor={getSiteColor}
                    chosenSites={chosenSites}
                />
            )}
        </>
    );
};

SWReactRootComponent(DisplayAdsOverviewPage, "DisplayAdsOverviewPage");
