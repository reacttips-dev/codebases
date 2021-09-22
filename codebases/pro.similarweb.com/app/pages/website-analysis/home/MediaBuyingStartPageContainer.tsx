import React, { FunctionComponent, useState, useEffect } from "react";
import { connect } from "react-redux";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { MediaBuyingStartPage } from "../../../../.pro-features/pages/module start page/src/website analysis/MediaBuyingStartPage";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import {
    IMarketingWorkspace,
    marketingWorkspaceApiService,
} from "services/marketingWorkspaceApiService";
import { RecentService } from "services/recent/recentService";

const MediaBuyingStartPageContainer: FunctionComponent = () => {
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
        swNavigator.go("findpublishers_byindustry", {
            category,
            country,
            selectedSourceType: "Display Ad",
        });
    };
    const visitIncomingTraffic = ({ key }: { key: string }): void => {
        swNavigator.go("findpublishers_bycompetition", { key, selectedTab: "publishers" });
    };
    return (
        <MediaBuyingStartPage
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
    connect(null, mapDispatchToProps)(MediaBuyingStartPageContainer),
    "MediaBuyingStartPageContainer",
);
