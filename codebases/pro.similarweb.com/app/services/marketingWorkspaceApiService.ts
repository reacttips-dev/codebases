import { SwLog } from "@similarweb/sw-log";
import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import { hasMarketingPermission } from "services/Workspaces.service";
import { DefaultFetchService } from "./fetchService";

export interface IMarketingWorkspaceGroup {
    id: string;
    name: string;
}

export interface IMarketingWorkspaceWebsiteGroup extends IMarketingWorkspaceGroup {
    generatedFromArenaId?: string;
}

interface IDomain {
    domain: string;
    favicon: string;
}

export interface IArena<T = IDomain> {
    id: string;
    country: number;
    friendlyName: string;
    competitors: T[];
    allies: T[];
    dashboards: any[];
    subscription: boolean;
}

export interface IMarketingWorkspace {
    customIndustries: IMarketingWorkspaceWebsiteGroup[];
    keywordGroups: IMarketingWorkspaceGroup[];
    arenas: IArena[];
    friendlyName: string;
    id: string;
}

interface IArenaConfig {
    arenaName: string;
    country: number;
    allies: string[];
    competitors: string[];
}

const fetchService = DefaultFetchService.getInstance();
const url = (url) => `${url}?t=${Date.now()}`;
const subscriptionApi = (arenaId) => `api/userdata/digest/notifications/${arenaId}/subscriptions`;
let marketingWorkspaces: IMarketingWorkspace[] = [];
export let shouldRefresh = true;
export const marketingWorkspaceApiService = {
    shouldRefresh: (status: boolean) => {
        shouldRefresh = status;
    },
    getWorkspaceIfExists: async (): Promise<{
        exists?: boolean;
        shouldCreate?: boolean;
        id?: string;
    }> => {
        try {
            const hasMarketingWorkspace = hasMarketingPermission();
            const hasMultipleWorkspaces =
                swSettings.components.MarketingWorkspace.resources.WorkspacesLimit > 1;
            const activeWorkspaces = await marketingWorkspaceApiService.getMarketingWorkspaces();
            // only if the user doesn't have multiple workspace permission,
            // and he doesn't have workspaces yet
            if (hasMarketingWorkspace && !hasMultipleWorkspaces) {
                if (activeWorkspaces.length === 0) {
                    return { exists: false, shouldCreate: true };
                } else {
                    return {
                        exists: true,
                        id: activeWorkspaces[0].id,
                    };
                }
            }
            return { exists: false };
        } catch (e) {
            SwLog.error("Error: ", e);
            return { exists: false };
        }
    },
    getOrCreateAnEmptyWorkspace: async (name?, arenaConfig?) => {
        try {
            const workspace = await marketingWorkspaceApiService.getWorkspaceIfExists();
            if (workspace.exists === false) {
                if (workspace.shouldCreate) {
                    const workspacesResponse = await marketingWorkspaceApiService.addMarketingWorkspace(
                        name || i18nFilter()("workspace.marketing.default.title"),
                        arenaConfig,
                    );
                    if (workspacesResponse.id) {
                        return workspacesResponse.id;
                    }
                }
            } else {
                return workspace.id;
            }
        } catch (e) {
            SwLog.error("Error: ", e);
            return null;
        }
    },
    addMarketingWorkspace: (friendlyName: string, arenaConfig?: IArenaConfig) => {
        shouldRefresh = true;
        const postParams: { friendlyName: string; arena?: object } = {
            friendlyName,
        };
        if (arenaConfig) {
            const { arenaName, country, allies, competitors } = arenaConfig;
            postParams.arena = {
                friendlyName: arenaName,
                country,
                allies,
                competitors,
            };
        }
        return fetchService.post<IMarketingWorkspace>(
            `/api/userdata/workspaces/marketing`,
            postParams,
        );
    },
    addArena: (
        workspaceId: string,
        friendlyName: string,
        country: number,
        allies: string[],
        competitors: string[],
    ): Promise<IArena> => {
        shouldRefresh = true;
        const postPatams = {
            friendlyName,
            country,
            allies,
            competitors,
        };
        return fetchService.post<IArena>(
            `/api/userdata/arenas/marketing?workspaceId=${workspaceId}`,
            postPatams,
        );
    },
    updateArena: (
        arenaId: string,
        friendlyName: string,
        country: number,
        allies: string[],
        competitors: string[],
    ) => {
        return fetchService.put<IArena>(`/api/userdata/arenas/marketing/${arenaId}`, {
            arenaId,
            friendlyName,
            country,
            allies,
            competitors,
        });
    },
    deleteArena: (arenaId) => {
        return fetchService.delete(`/api/userdata/arenas/marketing/${arenaId}`);
    },
    updateMarketingWorkspace: (workspaceId: string, friendlyName: string) => {
        shouldRefresh = true;
        return fetchService.put<IMarketingWorkspace>(
            `/api/userdata/workspaces/marketing/${workspaceId}`,
            { friendlyName },
        );
    },
    removeMarketingWorkspace: (workspaceId) => {
        shouldRefresh = true;
        return fetchService.delete(`/api/userdata/workspaces/marketing/${workspaceId}`);
    },
    removeAllMarketingWorkspaces: () => {
        return fetchService.delete(`/api/userdata/workspaces/marketing`);
    },
    getMarketingWorkspaces: async (): Promise<IMarketingWorkspace[]> => {
        if (!shouldRefresh) {
            return marketingWorkspaces;
        } else {
            try {
                const workspaces = await fetchService.get<IMarketingWorkspace[]>(
                    url(`/api/userdata/workspaces/marketing`),
                );
                shouldRefresh = false;
                return (marketingWorkspaces = workspaces.map((workspace) => {
                    // todo filter by
                    return {
                        ...workspace,
                        arenas: workspace.arenas.map((arena) => {
                            return {
                                ...arena,
                                allies: arena.allies.map((domain) => {
                                    return {
                                        ...domain,
                                        type: "website",
                                    };
                                }),
                                competitors: arena.competitors.map((competitor) => {
                                    return {
                                        ...competitor,
                                        type: "website",
                                    };
                                }),
                            };
                        }),
                        // keywordGroups: [],
                        // customIndustries: []
                    };
                }));
            } catch (e) {
                SwLog.error("Error while trying to get workspaces: ", e);
            }
        }
    },
    getSitesIcons: (domains) => {
        return fetchService.get(`/api/images/?domains=${domains.join(`,`)}`);
    },
    linkMarketingWorkspaceToDashboard: (workspaceId, dashboardId) => {
        shouldRefresh = true;
        return fetchService.put(
            `/api/userdata/workspaces/marketing/${workspaceId}/assets/dashboards?id=${dashboardId}`,
            {},
        );
    },
    linkKeywordGroupToWorkspace: (groupId, workspaceId) => {
        shouldRefresh = true;
        return fetchService.put(
            `/api/userdata/workspaces/marketing/${workspaceId}/assets/keywordGroups?id=${groupId}`,
            {},
        );
    },
    linkWebsiteGroupToWorkspace: (groupId, workspaceId) => {
        shouldRefresh = true;
        return fetchService.put(
            `/api/userdata/workspaces/marketing/${workspaceId}/assets/customIndustries?id=${groupId}`,
            {},
        );
    },
    linkDashboardToArena: (dashboardId, arenaId) => {
        shouldRefresh = true;
        return fetchService.put(
            `/api/userdata/arenas/marketing/${arenaId}/assets/dashboards?id=${dashboardId}`,
            {},
        );
    },
    refreshWorkspaces: async () => {
        shouldRefresh = true;
        const workspaces = await marketingWorkspaceApiService.getMarketingWorkspaces();
        // currently we support only single workspace
        const workspace = workspaces[0];
        return {
            id: workspace.id,
            title: workspace.friendlyName,
            arenas: workspace.arenas,
            customIndustries: workspace.customIndustries,
            keywordGroups: workspace.keywordGroups,
            filters: {},
        };
    },
    overrideWorkspaceLinkedGroups: async (
        workspaceId,
        Industries: string[] = [],
        KeywordGroups: string[] = [],
    ) => {
        shouldRefresh = true;
        return fetchService.put(
            `/api/userdata/workspaces/marketing/${workspaceId}/assets/override`,
            {
                KeywordGroups,
                Industries,
            },
        );
    },
    getWebsiteRecommendations: async (sites, date, country): Promise<string[]> => {
        return fetchService.get(`api/recommendations/affiliates`, { sites, date, country });
    },
    isSubscriptionOn: (arena: IArena) => {
        try {
            if (arena) {
                return arena.subscription;
            } else {
                return true; // subscribe to arena during the creation process.
            }
        } catch (e) {
            return false;
        }
    },
    subscribeToNotification: async (arenaId) => {
        return fetchService.post(subscriptionApi(arenaId), {});
    },
    unsubscribeToNotification: async (arenaId) => {
        return fetchService.delete(subscriptionApi(arenaId), {});
    },
    getStrategicOverviewHighlights: async (arenaId, includeSubDomains) => {
        return fetchService.get<any>(
            `api/userdata/arenas/marketing/${arenaId}/alerts?includeSubdomains=${includeSubDomains}`,
        );
    },
};
