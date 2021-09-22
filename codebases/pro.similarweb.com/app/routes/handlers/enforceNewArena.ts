import angular from "angular";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import { getWorkspaceConfig } from "routes/workspaceConfig";
import { marketingWorkspaceApiService } from "services/marketingWorkspaceApiService";
import { hasUseCaseConfig } from "use-case/common/config/useCaseConfig";
import { IAngularEvent } from "angular";
import { IRouterState } from "routes/allStates";

export const enforceNewArena = (swNavigator: SwNavigator) => async (
    event: IAngularEvent,
    toState: IRouterState,
) => {
    const isSolutions2 = swSettings.user.hasSolution2;

    if (!hasUseCaseConfig(swSettings) && !isSolutions2) {
        const newArenaRoute = getWorkspaceConfig()["marketingWorkspace-new"]?.name;

        if (newArenaRoute && toState.name !== newArenaRoute) {
            const { isFro } = swSettings.user;
            const workspaces = await marketingWorkspaceApiService.getMarketingWorkspaces();
            const isDisabledMarketingWorkspace =
                swSettings.components.MarketingWorkspace.isDisabled;
            const isArenaCreated =
                Array.isArray(workspaces) && workspaces.length
                    ? workspaces.some(({ arenas }) => arenas && arenas.length)
                    : false;

            if (isFro && !isArenaCreated && !isDisabledMarketingWorkspace) {
                event.preventDefault();
                swNavigator.go(newArenaRoute);
            }
        }
    }
};

angular.module("sw.common").factory("enforceNewArena", enforceNewArena);
