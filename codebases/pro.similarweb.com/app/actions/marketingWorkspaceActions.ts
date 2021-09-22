import { Injector } from "common/ioc/Injector";
import { ECategoryType } from "common/services/categoryService.types";
import { marketingWorkspaceGo } from "pages/workspace/marketing/MarketingWorkspaceCtrl";
import { marketingWorkspaceApiService } from "services/marketingWorkspaceApiService";
import {
    MARKETING_WORKSPACE_ARENA_SET_SELECTED_TAB,
    MARKETING_WORKSPACE_CLEAR_ALL_PARAMS,
    MARKETING_WORKSPACE_SET_ALL_PARAMS,
    MARKETING_WORKSPACE_SET_CATEGORY,
    MARKETING_WORKSPACE_SET_COUNTRY,
    MARKETING_WORKSPACE_SET_DURATION,
    MARKETING_WORKSPACE_SET_FILTERS,
    MARKETING_WORKSPACE_SET_IS_WWW,
    MARKETING_WORKSPACE_SET_KEYWORDS_TYPE,
    MARKETING_WORKSPACE_SET_RECOMMENDATION_ENGINE_CLEAR,
    MARKETING_WORKSPACE_SET_RECOMMENDATION_ENGINE_FAILED,
    MARKETING_WORKSPACE_SET_RECOMMENDATION_ENGINE_START,
    MARKETING_WORKSPACE_SET_RECOMMENDATION_ENGINE_SUCCESS,
    MARKETING_WORKSPACE_SET_SELECTED_WORKSPACE,
    MARKETING_WORKSPACE_SET_SELECTED_WORKSPACE_KEYWORD_GROUPS,
    MARKETING_WORKSPACE_SET_SITES,
    MARKETING_WORKSPACE_SET_WEBSOURCE,
    MARKETING_WORKSPACE_UNSET_NEWLY_CREATED,
    MARKETING_WORKSPACE_UPDATE_SELECTED_WORKSPACE_KEYWORD_GROUP,
} from "../action_types/marketing_workspace_action_types";
import { PreferencesService } from "services/preferences/preferencesService";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";

export const marketingWorkspaceSetCountry = (country) => {
    return {
        type: MARKETING_WORKSPACE_SET_COUNTRY,
        country,
        urlMapping: {
            country,
        },
    };
};

export const marketingWorkspaceSetDuration = (duration) => {
    return {
        type: MARKETING_WORKSPACE_SET_DURATION,
        duration,
        urlMapping: {
            duration,
        },
    };
};

export const marketingWorkspaceSetWebsource = (websource) => {
    return {
        type: MARKETING_WORKSPACE_SET_WEBSOURCE,
        websource,
        urlMapping: {
            websource,
        },
    };
};

export const marketingWorkspaceSetIsWWW = (isWWW) => {
    return {
        type: MARKETING_WORKSPACE_SET_IS_WWW,
        isWWW,
        urlMapping: {
            isWWW,
        },
    };
};

export const marketingWorkspaceSetSites = (sites) => {
    return {
        type: MARKETING_WORKSPACE_SET_SITES,
        sites,
        urlMapping: {
            sites: sites ? sites.join(",") : null,
        },
    };
};

export const marketingWorkspaceSetKeywordsType = (keywordsType) => {
    return {
        type: MARKETING_WORKSPACE_SET_KEYWORDS_TYPE,
        keywordsType,
        urlMapping: {
            keywordsType,
        },
    };
};

export const marketingWorkspaceSetFilters = (filters) => {
    return {
        type: MARKETING_WORKSPACE_SET_FILTERS,
        filters,
        urlMapping: {
            duration: filters.duration,
            country: filters.country,
            websource: filters.websource,
            isWWW: filters.isWWW,
        },
    };
};

export const marketingWorkspaceSetAllParams = ({
    allWorkspaces,
    selectedWorkspace: {
        id,
        title,
        filters,
        arenas,
        customIndustries,
        keywordGroups,
        sharedKeywordGroups,
    },
}) => {
    return {
        type: MARKETING_WORKSPACE_SET_ALL_PARAMS,
        allWorkspaces,
        selectedWorkspace: {
            filters,
            id,
            title,
            arenas,
            customIndustries,
            keywordGroups,
            sharedKeywordGroups,
        },
    };
};

export const marketingWorkspaceSetSelectedWorkspace = (
    { id, title, filters, arenas, customIndustries, keywordGroups, sharedKeywordGroups },
    isNewlyCreated = false,
) => {
    return {
        type: MARKETING_WORKSPACE_SET_SELECTED_WORKSPACE,
        selectedWorkspace: {
            filters,
            id,
            title,
            arenas,
            customIndustries,
            keywordGroups,
            sharedKeywordGroups,
            isNewlyCreated,
        },
    };
};

export const marketingWorkspaceUnsetNewlyCreatedStatus = () => {
    return {
        type: MARKETING_WORKSPACE_UNSET_NEWLY_CREATED,
    };
};

export const marketingWorkspaceClearAllParams = () => {
    return {
        type: MARKETING_WORKSPACE_CLEAR_ALL_PARAMS,
    };
};

export const batchActions = (...actions) => {
    return {
        type: "BATCH_ACTIONS",
        actions,
    };
};

export const marketingWorkspaceArenaSetSelectedTab = (selectedTab) => {
    return {
        type: MARKETING_WORKSPACE_ARENA_SET_SELECTED_TAB,
        selectedTab: parseInt(selectedTab, 10),
        urlMapping: {
            selectedArenaTab: selectedTab,
        },
    };
};

export const marketingWorkspaceArenaSetCategory = (categoryId) => {
    return {
        type: MARKETING_WORKSPACE_SET_CATEGORY,
        category: categoryId,
        urlMapping: {
            category: categoryId,
        },
    };
};

export const setMarketingWorkspaceSetRecommendationEngine = (arenaId) => {
    return {
        type: MARKETING_WORKSPACE_SET_RECOMMENDATION_ENGINE_START,
        arenaId,
    };
};

export const addRecommendedWebsiteGroup = (title, workspaceId, arenaId, params) => async (
    dispatch,
    getState,
) => {
    try {
        const result = await getRecommendations(params);

        if (result.length === 0) {
            // empty state
            dispatch(setWebsiteGroupRecommendationFailed());
            return;
        }

        // add the group
        const addResult = await UserCustomCategoryService.addCustomCategoryFromArena(
            {
                name: title,
                domains: result.slice(0, 100),
                categoryType: ECategoryType.PARTNERS_LIST,
            },
            arenaId,
        );

        const addedGroup = addResult.find((group) => group.Name === title);
        // link newly created group to workspace
        await marketingWorkspaceApiService.linkWebsiteGroupToWorkspace(addedGroup.Id, workspaceId);
        // set flag in user data for the newly created group
        await PreferencesService.add({
            [`website-recommendation-${addedGroup.Id}`]: true,
        });

        // show success tooltip only if the user switched to another page
        // or redirect it to the newly created group
        const { currentPage } = getState().routing;
        const newGroupLink = Injector.get<any>("swNavigator").href(
            "marketingWorkspace-websiteGroup",
            {
                workspaceId,
                websiteGroupId: addedGroup.Id,
                sites: null,
                country: params.country,
            },
        );
        if (currentPage !== "marketingWorkspace-websiteGroupRecommendation") {
            dispatch(setWebsiteGroupRecommendationSuccess(newGroupLink));
        } else {
            dispatch(clearWebsiteGroupRecommendation());
            marketingWorkspaceGo("marketingWorkspace-websiteGroup", {
                workspaceId,
                websiteGroupId: addedGroup.Id,
                sites: null,
                country: params.country,
            });
        }
    } catch (e) {
        dispatch(setWebsiteGroupRecommendationFailed());
    }
};

const getRecommendations = ({ sites, date, country }): Promise<string[]> => {
    return marketingWorkspaceApiService.getWebsiteRecommendations(sites, date, country);
};

export const clearMarketingWorkspaceSetRecommendationEngine = () => {
    return {
        type: MARKETING_WORKSPACE_SET_RECOMMENDATION_ENGINE_START,
        arenaId: null,
    };
};

export const setWebsiteGroupRecommendationSuccess = (groupId) => {
    return {
        type: MARKETING_WORKSPACE_SET_RECOMMENDATION_ENGINE_SUCCESS,
        websiteGroupRecommendationSuccess: groupId,
    };
};

export const setWebsiteGroupRecommendationFailed = () => {
    return {
        type: MARKETING_WORKSPACE_SET_RECOMMENDATION_ENGINE_FAILED,
    };
};

export const clearWebsiteGroupRecommendation = () => {
    return {
        type: MARKETING_WORKSPACE_SET_RECOMMENDATION_ENGINE_CLEAR,
    };
};

export const setSelectedWorkspaceKeywordGroups = (keywordGroups) => {
    return {
        type: MARKETING_WORKSPACE_SET_SELECTED_WORKSPACE_KEYWORD_GROUPS,
        keywordGroups,
    };
};

export const updateSelectedWorkspaceKeywordGroup = (group) => {
    return {
        type: MARKETING_WORKSPACE_UPDATE_SELECTED_WORKSPACE_KEYWORD_GROUP,
        group,
    };
};
