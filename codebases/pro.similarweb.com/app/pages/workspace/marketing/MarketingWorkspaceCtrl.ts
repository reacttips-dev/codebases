import { ECategoryType } from "common/services/categoryService.types";
import { swSettings } from "common/services/swSettings";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { SwNavigator } from "../../../../scripts/common/services/swNavigator";
import {
    marketingWorkspaceSetAllParams,
    marketingWorkspaceSetSelectedWorkspace,
} from "../../../actions/marketingWorkspaceActions";
import {
    IMarketingWorkspace,
    IMarketingWorkspaceGroup,
    IMarketingWorkspaceWebsiteGroup,
    marketingWorkspaceApiService,
} from "../../../services/marketingWorkspaceApiService";
import { getAvailableWebSource } from "components/filters-bar/utils";
import categoryService from "common/services/categoryService";
import { NT_AFFILIATE_MARKETING_PRODUCT_KEY } from "constants/ntProductKeys";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

export const MarketingWorkspaceNewCtrl = async ($scope, $ngRedux, swNavigator) => {
    $scope.ready = false;
    try {
        const workspaces = await marketingWorkspaceApiService.getMarketingWorkspaces();
        $scope.$apply(() => {
            const { toState, toParams } = marketingWorkspaceValidation(
                workspaces,
                $ngRedux,
                swNavigator,
                categoryService,
            );
            marketingWorkspaceRedirect(swNavigator.current(), toState, toParams);
            $scope.ready = true;
        });
    } catch (e) {}
};

export const MarketingWorkspaceExistsCtrl = ($scope, $ngRedux, swNavigator) => {
    $scope.hideSideNav = () => {
        return swNavigator.current().data.hideSideNav;
    };
    const update = async () => {
        try {
            const workspaces = await marketingWorkspaceApiService.getMarketingWorkspaces();
            $scope.$apply(() => {
                const { toState, toParams } = marketingWorkspaceValidation(
                    workspaces,
                    $ngRedux,
                    swNavigator,
                    categoryService,
                );
                marketingWorkspaceRedirect(swNavigator.current(), toState, toParams);
                $scope.ready = true;
            });
        } catch (e) {}
    };
    $scope.ready = false;
    $scope.$on("navChangeComplete", () => {
        update();
    });
    update();
};

export function marketingWorkspaceValidation(
    marketingWorkspaces: IMarketingWorkspace[],
    $ngRedux,
    swNavigator,
    categoryService,
) {
    if (Array.isArray(marketingWorkspaces) && marketingWorkspaces.length > 0) {
        const currentState = swNavigator.current();
        const currentParams = swNavigator.getParams();
        // default page is arena overview page
        let toState = "marketingWorkspace-arena";
        const toParams: any = {};
        const customCategories = UserCustomCategoryService.getCustomCategories();
        // if workspace has at least one arena
        if (
            Array.isArray(marketingWorkspaces[0].arenas) &&
            marketingWorkspaces[0].arenas.length > 0
        ) {
            toParams.arenaId =
                swNavigator.getParams().arenaId || marketingWorkspaces[0].arenas[0].id;
        }
        // 2nd option - keyword group
        else if (
            Array.isArray(marketingWorkspaces[0].keywordGroups) &&
            marketingWorkspaces[0].keywordGroups.length > 0
        ) {
            toParams.keywordGroupId = marketingWorkspaces[0].keywordGroups[0].id;
            toState = "marketingWorkspace-keywordGroup";
        }
        // 3rd option - website group
        else if (
            Array.isArray(marketingWorkspaces[0].customIndustries) &&
            marketingWorkspaces[0].customIndustries.length > 0
        ) {
            toParams.websiteGroupId = marketingWorkspaces[0].customIndustries[0].id;
            toState = "marketingWorkspace-websiteGroup";
        }
        // 4th option - non attached keyword groups (keyword groups that aren't connected to the workspace)
        else if (keywordsGroupsService.userGroups.length > 0) {
            toParams.keywordGroupId = keywordsGroupsService.userGroups[0].Id;
            toState = "marketingWorkspace-keywordGroup";
        }
        // 5th option - non attached websites groups (websites groups that aren't connected to the workspace)
        else if (Array.isArray(customCategories) && customCategories.length > 0) {
            toParams.websiteGroupId = customCategories[0].categoryId;
            toState = "marketingWorkspace-websiteGroup";
        }

        if (currentState.name === "marketingWorkspace-arena-edit") {
            toState = currentState.name;
        }

        if (currentState.name === "marketingWorkspace-arena-new") {
            toState = currentState.name;
        }

        if (currentState.name === "marketingWorkspace-keywordGroup") {
            toState = currentState.name;
            toParams.keywordGroupId = currentParams.keywordGroupId;
        }

        if (currentState.name === "marketingWorkspace-websiteGroup") {
            toState = currentState.name;
            toParams.websiteGroupId = currentParams.websiteGroupId;
        }

        if (currentState.name === "marketingWorkspace-websiteGroupRecommendation") {
            toState = currentState.name;
        }

        if (currentState.name === "marketingWorkspace-keywordGeneratorTool") {
            toState = currentState.name;
        }

        if (currentState.name === "marketingWorkspace-new") {
            // user can go to workspace wizard only if he didn't reach his workspaces limit
            if (
                marketingWorkspaces.length <
                swSettings.components.MarketingWorkspace.resources.WorkspacesLimit
            ) {
                toState = currentState.name;
            }
        }

        const {
            duration,
            websource,
            keywordsType,
            workspaceId,
            sites,
            arenaId,
            isWWW,
            category,
            country,
        } = swNavigator.getParams();
        let workspace: IMarketingWorkspace;
        if (workspaceId) {
            workspace =
                marketingWorkspaces.find((workspace) => workspace.id === workspaceId) ||
                marketingWorkspaces[0];
        } else {
            workspace = marketingWorkspaces[0];
        }
        const arena = workspace.arenas.find((arena) => arena.id === arenaId);

        const hasMultipleWorkspaces =
            swSettings.components.MarketingWorkspace.resources.WorkspacesLimit > 1;
        const keywordsGroupsForWorkspace = getKeywordsGroupsForWorkspace(
            workspace.keywordGroups,
            hasMultipleWorkspaces,
        );
        const sharedKeywordGroupsForWorkspace = getSharedKeywordsGroupsForWorkspace(
            keywordsGroupsService.getSharedGroups(),
        );
        const websitesGroups = getWebsitesListsForWorkspace(
            categoryService,
            workspace.customIndustries,
            hasMultipleWorkspaces,
        );

        // order of preference for selected country: 1) url param if allowed 2) current arena's chosen country
        // 3) first country in list of allowed countries (which is user's main country)
        const selectedCountry =
            country &&
            swSettings?.current?.allowedCountries?.find((c) => c.id === parseInt(country, 10))
                ? country
                : arena?.country
                ? arena?.country
                : swSettings.current.allowedCountries[0].id;
        const availableWebSources = getAvailableWebSource(
            { name: "websites-audienceOverview" },
            { duration, selectedCountry },
        );
        let selectedWebSource = availableWebSources.find((w) => w.id === websource);
        // Handle edge case where preferences and available countries
        // don't intersect. Select Desktop as default
        if (selectedWebSource === undefined) {
            selectedWebSource = availableWebSources.find((w) => w.id === "Desktop");
        }

        return {
            toState,
            toParams: {
                ...toParams,
                workspaceId: workspace.id,
                workspaceParams: {
                    allWorkspaces: marketingWorkspaces,
                    selectedWorkspace: {
                        id: workspace.id,
                        keys:
                            workspace.arenas.length > 0
                                ? [
                                      ...workspace.arenas[0].allies,
                                      ...workspace.arenas[0].competitors,
                                  ]
                                : undefined,
                        title: workspace.friendlyName,
                        arenas: workspace.arenas,
                        customIndustries: websitesGroups,
                        keywordGroups: keywordsGroupsForWorkspace,
                        sharedKeywordGroups: sharedKeywordGroupsForWorkspace,
                        filters: {
                            country: selectedCountry,
                            duration,
                            websource: selectedWebSource.id,
                            keywordsType,
                            sites: sites && sites.split(","),
                            isWWW,
                            category,
                        },
                    },
                },
            },
        };
    }
    // no workspaces - redirect to wizard
    else {
        const productKey = swSettings.components.Home.resources.ProductKey;
        const [lastRoute] = swNavigator.getRouteHistory();
        // only for NT affiliate users landing on the / route first time.
        if (productKey === NT_AFFILIATE_MARKETING_PRODUCT_KEY && lastRoute?.state?.name === "") {
            return {
                toState: "digitalmarketing-home",
                toParams: {},
            };
        } else {
            return {
                toState: "marketingWorkspace-new",
                toParams: {},
            };
        }
    }
}

function marketingWorkspaceRedirect(currentState, toState, toParams) {
    if (currentState !== toState) {
        if (Injector.get<any>("$state").includes("marketingWorkspace-exists")) {
            Injector.get<any>("$ngRedux").dispatch(
                marketingWorkspaceSetAllParams({
                    ...toParams.workspaceParams,
                }),
            );
        }
        Injector.get<SwNavigator>("swNavigator").go(toState, toParams);
    }
}

export const marketingWorkspaceGo = async (toState, toParams, isNewlyCreatedWorkspace = false) => {
    const store = Injector.get<any>("$ngRedux");
    const navigator = Injector.get<SwNavigator>("swNavigator");

    try {
        const updateWorkspace = await marketingWorkspaceApiService.refreshWorkspaces();
        const sharedKeywordGroupsForWorkspace = getSharedKeywordsGroupsForWorkspace(
            keywordsGroupsService.getSharedGroups(),
        );
        const hasMultipleWorkspaces =
            swSettings.components.MarketingWorkspace.resources.WorkspacesLimit > 1;
        const keywordsGroupsForWorkspace = getKeywordsGroupsForWorkspace(
            updateWorkspace.keywordGroups,
            hasMultipleWorkspaces,
        );
        store.dispatch(
            marketingWorkspaceSetSelectedWorkspace(
                {
                    ...updateWorkspace,
                    keywordGroups: keywordsGroupsForWorkspace,
                    sharedKeywordGroups: sharedKeywordGroupsForWorkspace,
                },
                isNewlyCreatedWorkspace,
            ),
        );
        navigator.go(toState, toParams);
    } catch (e) {}
};

function getKeywordsGroupsForWorkspace(
    linkedGroups: IMarketingWorkspaceGroup[],
    hasMultipleWorkspaces,
) {
    return keywordsGroupsService.userGroups.map((g) => {
        return {
            addedTime: g.AddedTime,
            groupHash: g.GroupHash,
            id: g.Id,
            keywords: g.Keywords,
            lastUpdated: g.LastUpdated,
            name: g.Name,
            userId: g.UserId,
            // when user has multiple workspace permission, only linked groups are displayed
            linked: !hasMultipleWorkspaces || linkedGroups.some((group) => group.id === g.Id),
            sharedWithAccounts: g.SharedWithAccounts,
            sharedWithUsers: g.SharedWithUsers,
            ownerId: g.OwnerId,
        };
    });
}

function getSharedKeywordsGroupsForWorkspace(keywordsGroups) {
    return keywordsGroups.map((g) => {
        return {
            addedTime: g.AddedTime,
            groupHash: g.GroupHash,
            id: g.Id,
            keywords: g.Keywords,
            lastUpdated: g.LastUpdated,
            name: g.Name,
            userId: g.UserId,
            sharedWithAccounts: [],
            sharedWithUsers: [],
            ownerId: g.userId,
        };
    });
}

function getWebsitesListsForWorkspace(
    categoryService,
    linkedGroups: IMarketingWorkspaceWebsiteGroup[],
    hasMultipleWorkspaces,
) {
    return UserCustomCategoryService.getCustomCategories()
        .filter((c) => c.categoryType && c.categoryType === ECategoryType.PARTNERS_LIST)
        .map((category) => {
            const linkedGroup = linkedGroups.find(({ id }) => id === category.categoryId);
            return {
                categoryHash: category.categoryHash,
                domains: category.domains,
                id: category.categoryId,
                categoryType: category.categoryType,
                name: category.text,
                // when user has multiple workspace permission, only linked groups are displayed
                linked: !hasMultipleWorkspaces || linkedGroup,
                generatedFromArenaId: linkedGroup && linkedGroup.generatedFromArenaId,
            };
        });
}
