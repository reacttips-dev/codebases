/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { EMarketingWorkspacePage } from "reducers/_reducers/marketingWorkspaceReducer";
import { IArena } from "services/marketingWorkspaceApiService";
import _ from "lodash";
import {
    IMarketingWorkspaceKeywordGroup,
    IMarketingWorkspaceWebsiteGroup,
} from "../MarketingWorkspaceNavBarBody/MarketingWorkspaceNavBarBodyTypes";
import { swSettings } from "common/services/swSettings";
import { IMarketingWorkspaceServices } from "components/SecondaryBar/NavBars/WorkspacesNavBar/MarketingWorkspaces/MarketingWorkspaceNavBarBody/MarketingWorkspaceNavBarBodyTypes";

const getWebsiteGroupCountry = (group: any, arenas: IArena[]) => {
    // if the group was auto generated from arena, use the arena's country
    if (group.generatedFromArenaId) {
        const arena = arenas.find(({ id }) => id === group.generatedFromArenaId);
        if (arena) {
            return arena.country;
        }
    }
    // get the first country from web analysis analysis module
    return swSettings.components.WebAnalysis.allowedCountries[0].id;
};

const isWebsiteGroupRecommendationisWorking = (
    websiteGroupRecommendationEngineOn: string,
    currentPage: string,
) => {
    return (
        websiteGroupRecommendationEngineOn &&
        currentPage === "marketingWorkspace-websiteGroupRecommendation"
    );
};

export const adaptWebsitesData = (
    customIndustries: IMarketingWorkspaceWebsiteGroup[],
    arenas: IArena[],
    websiteGroupRecommendationEngineOn: string,
    currentPage: string,
    services: IMarketingWorkspaceServices,
) => {
    const adaptedData = customIndustries.map((group) => {
        return {
            id: group.id,
            name: group.name,
            totalItems: group.domains.length,
            linked: group.linked,
            onClick: () =>
                services.swNavigator.go("marketingWorkspace-websiteGroup", {
                    websiteGroupId: group.id,
                    duration: "3m",
                    websource: "Desktop",
                    country: getWebsiteGroupCountry(group, arenas),
                }),
        };
    });

    if (isWebsiteGroupRecommendationisWorking(websiteGroupRecommendationEngineOn, currentPage)) {
        adaptedData.push({
            id: "recommendation",
            name: services.categoryService.getNextCategoryName(
                services.translate("workspaces.marketing.websitegroup.recommendation.default.name"),
            ),
            onClick: () =>
                services.swNavigator.go("marketingWorkspace-websiteGroupRecommendation", {
                    websiteGroupId: "recommendation",
                    duration: "3m",
                    websource: "Desktop",
                    // get the first country from web analysis analysis module
                    country: swSettings.components.WebAnalysis.allowedCountries[0].id,
                    arenaId: websiteGroupRecommendationEngineOn,
                }),
            totalItems: null,
            linked: true,
        });
    }

    return _.sortBy(adaptedData, (websiteGroup) => websiteGroup.name.toUpperCase());
};

export const adaptKeyowrdsData = (
    keywordGroups: IMarketingWorkspaceKeywordGroup[],
    countryId: string,
    services: IMarketingWorkspaceServices,
) => {
    const adaptedData = keywordGroups.map((group) => {
        return {
            id: group.id,
            name: group.name,
            totalItems: group.keywords.length,
            linked: group.linked,
            onClick: () =>
                services.swNavigator.go("marketingWorkspace-keywordGroup", {
                    keywordGroupId: group.id,
                    duration: "3m",
                    websource: "Desktop",
                    keywordsType: "both",
                    isWWW: "*",
                    country: countryId,
                }),
            isShared: group.sharedWithAccounts.length > 0 || group.sharedWithUsers.length > 0,
        };
    });

    return _.sortBy(adaptedData, (group) => group.name.toUpperCase());
};

export const adaptArenasData = (
    arenas: IArena[],
    selectedArenaTab: number,
    services: IMarketingWorkspaceServices,
) => {
    const adaptedData = arenas.map((arena) => {
        return {
            id: arena.id,
            name: arena.friendlyName,
            onClick: () =>
                services.swNavigator.go("marketingWorkspace-arena", {
                    arenaId: arena.id,
                    selectedArenaTab,
                }),
        };
    });
    return _.sortBy(adaptedData, (arena) => arena.name.toUpperCase());
};
