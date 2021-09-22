import React, { FunctionComponent, useEffect, useState } from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { FindAffiliateByCompetitionHomePage } from "pages/digital-marketing/find-affiliate/home-pages/FindAffiliateByCompetitionHomePage";
import {
    IMarketingWorkspace,
    marketingWorkspaceApiService,
} from "services/marketingWorkspaceApiService";
import { RecentService } from "services/recent/recentService";

const FindAffiliateByCompetitionHomePageContainer: FunctionComponent = () => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const recentSearches = RecentService.getRecents();
    const [workspaces, setWorkspaces] = useState<IMarketingWorkspace[]>([]);
    const visitIncomingTraffic = ({ key }: { key: string }): void => {
        swNavigator.go("findaffiliates_bycompetition", {
            key,
            webSource: "Desktop",
            duration: "3m",
            limits: "ReferralOpportunities",
            isWWW: "*",
            country: "999",
        });
    };

    useEffect(() => {
        marketingWorkspaceApiService.getMarketingWorkspaces().then((workspaces) => {
            setWorkspaces(workspaces);
        });
    }, []);

    return (
        <FindAffiliateByCompetitionHomePage
            visitIncomingTraffic={visitIncomingTraffic}
            recentSearches={recentSearches}
            workspaces={workspaces}
        />
    );
};

SWReactRootComponent(
    FindAffiliateByCompetitionHomePageContainer,
    "FindAffiliateByCompetitionHomePageContainer",
);
