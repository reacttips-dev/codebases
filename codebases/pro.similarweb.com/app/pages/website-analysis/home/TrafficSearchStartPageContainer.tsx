import SWReactRootComponent from "decorators/SWReactRootComponent";
import { FunctionComponent, useEffect, useState } from "react";
import * as React from "react";
import { connect } from "react-redux";
import { TrafficSearchStartPage } from "../../../../.pro-features/pages/module start page/src/website analysis/TrafficSearchStartPage";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import {
    IMarketingWorkspace,
    marketingWorkspaceApiService,
} from "services/marketingWorkspaceApiService";
import { RecentService } from "services/recent/recentService";

const TrafficSearchStartPageContainer: FunctionComponent = () => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const recentSearches = RecentService.getRecents();
    const [workspaces, setWorkspaces] = useState<IMarketingWorkspace[]>([]);

    const visitKeywordGenerator = ({ keyword, country }) => {
        swNavigator.go("findkeywords_keywordGeneratorTool", {
            keyword,
            country,
            webSource: "Desktop",
        });
    };
    const visitTopKeywords = ({ category, country }) => {
        swNavigator.go("findkeywords_byindustry", {
            category,
            country,
            duration: "3m",
            webSource: "Desktop",
        });
    };
    const visitTrafficSearch = ({ key }) => {
        swNavigator.go("findkeywords_bycompetition", {
            selectedTab: "keywords",
            key,
            IncludeNoneBranded: true,
            limits: "opportunities",
            duration: "3m",
            isWWW: "*",
        });
    };
    useEffect(() => {
        marketingWorkspaceApiService.getMarketingWorkspaces().then((workspaces) => {
            setWorkspaces(workspaces);
        });
    }, []);
    return (
        <TrafficSearchStartPage
            visitTrafficSearch={visitTrafficSearch}
            visitKeywordGenerator={visitKeywordGenerator}
            visitTopKeywords={visitTopKeywords}
            recentSearches={recentSearches}
            workspaces={workspaces}
        />
    );
};

const mapDispatchToProps = () => {
    return {};
};

export const Connected = connect(null, mapDispatchToProps)(TrafficSearchStartPageContainer);

SWReactRootComponent(Connected, "TrafficSearchStartPageContainer");
