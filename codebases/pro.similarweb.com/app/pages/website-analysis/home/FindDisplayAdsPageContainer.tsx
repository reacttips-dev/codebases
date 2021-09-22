import React, { FC } from "react";
import { connect } from "react-redux";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { FindDisplayAdsPage } from "../../../../.pro-features/pages/module start page/src/website analysis/FindDisplayAdsPage";

const FindDisplayAdsPageContainer: FC = () => {
    return <FindDisplayAdsPage />;
};

const mapDispatchToProps: {} = () => {
    return {};
};

SWReactRootComponent(
    connect(null, mapDispatchToProps)(FindDisplayAdsPageContainer),
    "FindDisplayAdsPageContainer",
);
