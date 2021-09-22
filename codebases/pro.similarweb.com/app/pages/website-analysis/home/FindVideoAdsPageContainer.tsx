import React, { FC } from "react";
import { connect } from "react-redux";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { FindVideoAdsPage } from "../../../../.pro-features/pages/module start page/src/website analysis/FindVideoAdsPage";

const FindVideoAdsPageContainer: FC = () => {
    return <FindVideoAdsPage />;
};

const mapDispatchToProps: {} = () => {
    return {};
};

SWReactRootComponent(
    connect(null, mapDispatchToProps)(FindVideoAdsPageContainer),
    "FindVideoAdsPageContainer",
);
