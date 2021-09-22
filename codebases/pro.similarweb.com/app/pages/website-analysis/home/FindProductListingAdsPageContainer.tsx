import React, { FunctionComponent } from "react";
import { connect } from "react-redux";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { FindProductListingAdsPage } from "../../../../.pro-features/pages/module start page/src/website analysis/FindProductListingAdsPage";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

const FindProductListingAdsPageContainer: FunctionComponent = () => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const visitTopAds = ({ keyword, country }: { keyword: string; country: number }): void => {
        swNavigator.go("findProductListingAds_bykeyword", {
            keyword,
            country,
        });
    };
    return <FindProductListingAdsPage visitTopAds={visitTopAds} />;
};

const mapDispatchToProps: {} = () => {
    return {};
};

SWReactRootComponent(
    connect(null, mapDispatchToProps)(FindProductListingAdsPageContainer),
    "FindProductListingAdsPageContainer",
);
