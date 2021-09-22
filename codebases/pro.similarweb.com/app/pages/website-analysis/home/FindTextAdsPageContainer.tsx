import React, { FunctionComponent } from "react";
import { connect } from "react-redux";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { FindTextAdsPage } from "../../../../.pro-features/pages/module start page/src/website analysis/FindTextAdsPage";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

const FindTextAdsPageContainer: FunctionComponent = () => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const visitTopAds = ({ keyword, country }: { keyword: string; country: number }): void => {
        swNavigator.go("findSearchTextAds_bykeyword", { keyword, country, webSource: "Desktop" });
    };
    return <FindTextAdsPage visitTopAds={visitTopAds} />;
};

const mapDispatchToProps: {} = () => {
    return {};
};

SWReactRootComponent(
    connect(null, mapDispatchToProps)(FindTextAdsPageContainer),
    "FindTextAdsPageContainer",
);
