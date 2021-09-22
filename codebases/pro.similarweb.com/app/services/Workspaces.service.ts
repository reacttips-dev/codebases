import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";

declare const window;
export const Workspaces = "Workspaces";
export const SalesWorkspace = "SalesWorkspace";
export const InvestorsWorkspace = "InvestorsWorkspace";
export const MarketingWorkspace = "MarketingWorkspace";
export const HookWorkspace = "HookWorkspace";

const AvailableWorkspacesTypes = {
    SalesWorkspace: {
        title: "topbar.tabs.workspace.sales.title",
        description: `topbar.tabs.workspace.sales.description`,
        link: "/#/workspace/sales",
        icon: "websites",
        trackName: "Workspaces/Sales",
        modules: ["salesWorkspace"],
    },
    InvestorsWorkspace: {
        title: "topbar.tabs.workspace.investors.title",
        description: `topbar.tabs.workspace.investors.description`,
        link: "/#/workspace/investors",
        icon: "websites",
        trackName: "Workspaces/Investors",
        modules: ["investorsWorkspace"],
    },
    MarketingWorkspace: {
        title: "topbar.tabs.workspace.marketing.title",
        description: `topbar.tabs.workspace.marketing.description`,
        link: "/#/workspace/marketing/home",
        icon: "websites",
        trackName: "Workspaces/Marketing",
        modules: ["marketingWorkspace"],
    },
    HookWorkspace: {
        link: "/#/workspace/hook",
        icon: "websites",
        trackName: "Workspaces/Hook",
        modules: ["hookWorkspace"],
    },
};

interface CurriedFunction<T1, T2, R> {
    (t1: T1): (t2: T2) => R;

    (t1: T1, t2: T2): R;
}
const getWorkspacesComponents = _.memoize((config) => {
    return [Workspaces, ...Object.keys(AvailableWorkspacesTypes)].reduce((all, name) => {
        return {
            ...all,
            [name]: config[name].resources,
        };
    }, {});
});

const hasPermission = _.curry((config, name) => {
    return !config[Workspaces].IsDisabled && !config[name].IsDisabled;
});
const getDefaultConfig = () => getWorkspacesComponents(window.similarweb.settings.components);
// Important notice : we do not want to apply the same permissions to trial user and workspace user
export const hasWorkSpacesPermission = (config = getDefaultConfig()) =>
    hasPermission(config, Workspaces);
export const hasSalesPermission = (config = getDefaultConfig()) =>
    hasPermission(config, SalesWorkspace);
export const hasMarketingPermission = (config = getDefaultConfig()) =>
    hasPermission(config, MarketingWorkspace);
export const hasInvestorPermission = (config = getDefaultConfig()) =>
    hasPermission(config, InvestorsWorkspace);
export const isHookWorkspaceEnabled = (config = getDefaultConfig()) =>
    hasPermission(config, HookWorkspace);
export const getPermittedWorkSpacesTypes = (config = getDefaultConfig()) => {
    const isPermitted = hasPermission(config);
    return _.reduce(
        AvailableWorkspacesTypes,
        (res, val, key) => {
            return isPermitted(key)
                ? {
                      ...res,
                      [key]: { ...val },
                  }
                : res;
        },
        {},
    );
};
export const getWebSource = (country: number) => {
    // default source is Total
    let webSource = "Total";
    const countryHasMobileWeb = swSettings.allowedCountry(country, "MobileWeb");
    const userHasMobileWeb = swSettings.components.MobileWeb.isAllowed;
    // change to the component default source
    if (!countryHasMobileWeb || !userHasMobileWeb) {
        webSource = swSettings.current.resources.DefaultSource.toString();
    }
    return webSource;
};
