import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import { HasWorkspaceTrialPermission } from "../../../app/pages/workspace/common/workspacesUtils";
import { getWsConfigFromState } from "../../../app/pages/workspace/config/stateToWsConfigMap";
import { hasWorkSpacesPermission } from "../../../app/services/Workspaces.service";
import { Injector } from "../ioc/Injector";

export const isLocked = (component): boolean =>
    component && component.resources && component.resources.AvaliabilityMode === "Hook";
export const isHidden = (component): boolean =>
    component && component.resources && component.resources.AvaliabilityMode === "Hidden";
export const isAvailable = (component): boolean => !isLocked(component) && !isHidden(component);

export const isHiddenForWorldWideOnlyUsers = (component): boolean =>
    //case page is unavailable for certain countries and total available countries is 0
    component && component.totalCountries?.length === 0;

export function canNavigate(toState: string | { name?: string }, toParams): boolean {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    toState = typeof toState === "string" ? swNavigator.getState(toState) : toState;
    // Important notice : we do not want to apply the same permissions to trial user and workspace user
    const workspaceEnabled = hasWorkSpacesPermission() && !HasWorkspaceTrialPermission();
    const wsConfig = getWsConfigFromState(toState, toParams);
    const originComponent = swNavigator.getConfigIdFromStateConfig(toState, toParams);

    const isSolutions2 = swSettings.user.hasSolution2;
    // probably not the best solution to target MR/DM packages like that but what could I do

    const component =
        swSettings.components[
            ((workspaceEnabled || isSolutions2) && wsConfig && wsConfig.wsComponent) ||
                originComponent
        ];
    return isAvailable(component);
}
