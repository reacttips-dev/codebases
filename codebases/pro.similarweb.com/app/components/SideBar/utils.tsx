import { isAvailable } from "common/services/pageClaims";
import { swSettings } from "common/services/swSettings";
import { IProSidebarItem } from "components/SideBar/SideBarItems";
import * as _ from "lodash";
import { PrimaryNavOverrideMode } from "reducers/_reducers/primaryNavOverrideReducer";

export type PackageType =
    | "workspace"
    | "home"
    | "current"
    | "legacy"
    | "dashboard"
    | "all"
    | "digitalmarketing"
    | "marketresearch"
    | "si"
    | "internal"
    | "productupdates"
    | "all-s2"
    | "deepinsights";

export const hasDigitalMarketingPermission = (): boolean =>
    swSettings.user.hasDM || swSettings.user.isSimilarWebUser;

export const hasMarketResearchPermission = (): boolean =>
    swSettings.user.hasMR || swSettings.user.isSimilarWebUser;

export const hasConversionPermission = (): boolean =>
    isAvailable(swSettings.components.Conversion) || swSettings.user.isSimilarWebUser;

export const hasAppsPermission = (): boolean =>
    isAvailable(swSettings.components.Solutions2AppAnalysisHome);

export const getPackageFilters = (
    hasWorkspacePermissions: boolean,
    primaryNavOverride: PrimaryNavOverrideMode = PrimaryNavOverrideMode.All,
): PackageType[] => {
    const packageArray: PackageType[] = ["all"];

    if (swSettings.user.hasProductBoardAccess) {
        packageArray.push("productupdates");
    }

    if (!swSettings.components.DeepInsights.resources.IsDisabled) {
        packageArray.push("deepinsights");
    }

    if (swSettings.user.isSimilarWebUser) {
        packageArray.push("internal");
        switch (primaryNavOverride) {
            case PrimaryNavOverrideMode.All:
                packageArray.push("dashboard");
                packageArray.push("workspace");
                packageArray.push("current");
                packageArray.push("legacy");
                packageArray.push("si");
                packageArray.push("home");
                packageArray.push("all-s2");
                break;
            case PrimaryNavOverrideMode.Legacy:
                packageArray.push("legacy");
                packageArray.push("dashboard");
                packageArray.push("home");
                break;
            case PrimaryNavOverrideMode.S1:
                packageArray.push("dashboard");
                packageArray.push("workspace");
                packageArray.push("legacy");
                break;
            case PrimaryNavOverrideMode.S2:
                packageArray.push("dashboard");
                packageArray.push("workspace");
                packageArray.push("current");
                packageArray.push("si");
                packageArray.push("all-s2");
                break;
        }
    } else {
        packageArray.push(
            hasWorkspacePermissions ? "workspace" : !swSettings.user.hasSolution2 ? "home" : null,
        );
        packageArray.push(swSettings.user.hasSolution2 ? "current" : "legacy");

        if (swSettings.user.hasSolution2) {
            packageArray.push("all-s2");
        }

        if (swSettings.user.hasSI) {
            packageArray.push("si");
        }

        packageArray.push("dashboard");
    }

    return packageArray;
};

// The packageFilters array is built dynamically based on the users claims and permissions.
// We are using it to determine which sidebar items to include, by filtering out the items
// that don't have any of the packages in their package property.
export const filterItemsAccordingToPackages = (
    filters: string[],
    items: IProSidebarItem[],
): IProSidebarItem[] => {
    return items.filter(
        (item) => item.package.filter((packageName) => _.includes(filters, packageName)).length > 0,
    );
};

export const filterByCurrentModule = (
    currentModule: string,
    items: IProSidebarItem[],
): IProSidebarItem[] => {
    return items.filter((item) => {
        // no per-modules filter were defined for the items, i.e. always included
        if (!("inModules" in item)) {
            return true;
        }

        // exclution (hide) takes precedence
        if ("hide" in item.inModules && item.inModules.hide.includes(currentModule)) {
            return false;
        }

        // then the inclution (show)
        if ("show" in item.inModules && !item.inModules.show.includes(currentModule)) {
            return false;
        }

        return true;
    });
};
