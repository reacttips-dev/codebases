import React, { FunctionComponent, useState, useEffect } from "react";
import { connect } from "react-redux";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { MediaBuyingAdNetworksStartPage } from "../../../../.pro-features/pages/module start page/src/website analysis/MediaBuyingAdNetworksStartPage";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import {
    IMarketingWorkspace,
    marketingWorkspaceApiService,
} from "services/marketingWorkspaceApiService";
import { RecentService } from "services/recent/recentService";

const MediaBuyingAdNetworksStartPageContainer: FunctionComponent = () => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const recentSearches = RecentService.getRecents();
    const [workspaces, setWorkspaces] = useState<IMarketingWorkspace[]>([]);
    useEffect(() => {
        marketingWorkspaceApiService.getMarketingWorkspaces().then((workspaces) => {
            setWorkspaces(workspaces);
        });
    }, []);
    const visitTrafficChannels = ({
        category,
        country,
    }: {
        category: string;
        country: number;
    }): void => {
        swNavigator.go("findadnetworks_byindustry", {
            category,
            country,
            selectedCategory: "Computers_Electronics_and_Technology~Advertising_Networks",
        });
    };
    const visitIncomingTraffic = ({ key }: { key: string }): void => {
        swNavigator.go("findadnetworks_bycompetition", { key, isWWW: "*" });
    };
    return (
        <MediaBuyingAdNetworksStartPage
            visitTrafficChannels={visitTrafficChannels}
            visitUserAcquisitionNetworks={visitIncomingTraffic}
            recentSearches={recentSearches}
            workspaces={workspaces}
        />
    );
};

const mapDispatchToProps: {} = () => {
    return {};
};

SWReactRootComponent(
    connect(null, mapDispatchToProps)(MediaBuyingAdNetworksStartPageContainer),
    "MediaBuyingAdNetworksStartPageContainer",
);
