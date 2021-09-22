/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { FC, useMemo } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import {
    marketingWorkspaceSetAllParams,
    marketingWorkspaceUnsetNewlyCreatedStatus,
    setMarketingWorkspaceSetRecommendationEngine,
    clearMarketingWorkspaceSetRecommendationEngine,
} from "actions/marketingWorkspaceActions";
import { MarketingWorkspacesArenasGroup } from "./NavGroups/ArenasNavGroup/MarketingWorkspaceArenasGroup";
import { IRootScopeService } from "angular";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { MarketingWorkspacesKeywordsGroup } from "components/SecondaryBar/NavBars/WorkspacesNavBar/MarketingWorkspaces/MarketingWorkspaceNavBarBody/NavGroups/KeywordsNavGroup/MarketingWorkspaceKeywordsGroup";
import { MarketingWorkspaceWebsitesGroup } from "./NavGroups/WebsitesNavGroup/MarketingWorkspaceWebsitesGroup";
import { IMarketingWorkspaceNavBarBodyProps } from "./MarketingWorkspaceNavBarBodyTypes";
import { i18nFilter } from "filters/ngFilters";
import { IMarketingWorkspaceServices } from "components/SecondaryBar/NavBars/WorkspacesNavBar/MarketingWorkspaces/MarketingWorkspaceNavBarBody/MarketingWorkspaceNavBarBodyTypes";
import { swSettings } from "common/services/swSettings";
import categoryService from "common/services/categoryService";

const BodyContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-left: 8px;
    padding-right: 8px;
`;

export const MarketingWorkspaceNavBarBody: FC<IMarketingWorkspaceNavBarBodyProps> = (props) => {
    const {
        arenas,
        selectedArenaTab,
        params,
        keywordGroups,
        sharedKeywordGroups,
        workspaceId,
        customIndustries,
        websiteGroupRecommendationEngineOn,
        currentPage,
        setMarketingWorkspaceSetRecommendationEngine,
    } = props;

    const services = useMemo<IMarketingWorkspaceServices>(() => {
        return {
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
            rootScope: Injector.get<IRootScopeService>("$rootScope"),
            categoryService,
            translate: i18nFilter(),
        };
    }, []);

    const hasKeywordsGenerator = swSettings.components.KeywordsGenerator.isAllowed;
    const showKeywordsGroups = !swSettings.user.hasSolution2;
    const showPartnerLists = !swSettings.user.hasDM && !swSettings.user.hasMR;

    return (
        <BodyContainer>
            <MarketingWorkspacesArenasGroup
                arenas={arenas}
                selectedArenaTab={selectedArenaTab}
                selectedArenaId={params.arenaId}
                services={services}
            />
            {showKeywordsGroups && (
                <MarketingWorkspacesKeywordsGroup
                    workspaceId={workspaceId}
                    keywordGroups={keywordGroups}
                    sharedKeywordGroups={sharedKeywordGroups}
                    services={services}
                    countryId={params.country}
                    selectedKeywordGroupId={params.keywordGroupId}
                    hasKeywordsGenerator={hasKeywordsGenerator}
                />
            )}
            {showPartnerLists && (
                <MarketingWorkspaceWebsitesGroup
                    arenas={arenas}
                    customIndustries={customIndustries}
                    websiteGroupRecommendationEngineOn={websiteGroupRecommendationEngineOn}
                    currentPage={currentPage}
                    selectedWebsiteGroupId={params.websiteGroupId}
                    workspaceId={workspaceId}
                    setMarketingWorkspaceSetRecommendationEngine={
                        setMarketingWorkspaceSetRecommendationEngine
                    }
                    services={services}
                />
            )}
        </BodyContainer>
    );
};

const mapStateToProps = ({
    marketingWorkspace: {
        allWorkspaces,
        selectedWorkspace,
        selectedArenaTab,
        websiteGroupRecommendationEngineOn,
        websiteGroupRecommendationFailed,
    },
    routing,
}) => {
    const {
        id,
        arenas,
        customIndustries,
        keywordGroups,
        sharedKeywordGroups,
        title,
        isNewlyCreated,
    } = selectedWorkspace;
    const { currentPage, params } = routing;
    return {
        selectedArenaTab,
        allWorkspaces,
        workspaceId: id,
        workspaceName: title,
        title,
        arenas,
        keywordGroups,
        sharedKeywordGroups,
        customIndustries,
        currentPage,
        params,
        isNewlyCreatedWorkspace: isNewlyCreated,
        websiteGroupRecommendationEngineOn,
        websiteGroupRecommendationFailed,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        marketingWorkspaceSetAllParams: (params) => {
            dispatch(marketingWorkspaceSetAllParams(params));
        },
        closeWelcomeModal: () => {
            dispatch(marketingWorkspaceUnsetNewlyCreatedStatus());
        },
        setMarketingWorkspaceSetRecommendationEngine: (arenaId) => {
            dispatch(setMarketingWorkspaceSetRecommendationEngine(arenaId));
        },
        clearMarketingWorkspaceSetRecommendationEngine: () => {
            dispatch(clearMarketingWorkspaceSetRecommendationEngine());
        },
    };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(MarketingWorkspaceNavBarBody);
export default connected;
