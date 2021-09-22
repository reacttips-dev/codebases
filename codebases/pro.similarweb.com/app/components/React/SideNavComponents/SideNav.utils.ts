import { i18nFilter } from "../../../filters/ngFilters";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { canNavigate } from "../../../../scripts/common/services/pageClaims";
import CountryService from "services/CountryService";
import { SwTrack } from "services/SwTrack";

export const isBeta = (navListItem) => {
    return navListItem.isBeta;
};

export const isNew = (navListItem) => {
    return navListItem.isNew;
};

export const isLocked = (navListItem) => {
    const isNavigationAllowed = canNavigate({ name: navListItem.state }, { ...navListItem });
    return !isNavigationAllowed || navListItem.lockIcon;
};

export const navItemTooltip = (navListItem) => {
    const swNavigator = Injector.get<any>("swNavigator");
    const chosenSites = Injector.get<any>("chosenSites");

    const isVirtual = chosenSites.isPrimaryVirtual();
    const isUSState = CountryService.isUSState(swNavigator.getParams().country);

    if (isUSState && navListItem.options.isUSStatesSupported === false) {
        return {
            tooltipText: i18nFilter()("analysis.audience.geo.tooltip"),
            tooltipPlacement: "right",
        };
    } else if (isVirtual && navListItem.options.isVirtualSupported === false) {
        return {
            tooltipText: i18nFilter()("analysis.audience.interests.tooltip"),
            tooltipPlacement: "bottom",
        };
    }
};

export const isItemDisabled = (navListItem) => {
    const swNavigator = Injector.get<any>("swNavigator");
    const chosenSites = Injector.get<any>("chosenSites");

    if (navListItem && navListItem.options) {
        const isVirtual = chosenSites.isPrimaryVirtual();
        const isUSState = CountryService.isUSState(swNavigator.getParams().country);

        if (isUSState && navListItem.options.isUSStatesSupported === false) {
            return true;
        } else if (isVirtual && navListItem.options.isVirtualSupported === false) {
            return true;
        }
    }
    return false;
};

export const hasAppTooltip = (navListItem) => {
    return !!(navListItem && navListItem.options && navListItem.options.android === true);
};

export const navItemAppTooltip = () => {
    return {
        tooltipText: i18nFilter()("apps.menu.android-only"),
        tooltipPlacement: "top",
    };
};

export const trackSideNavItemClick = (item, parent?) => {
    const parentTitle = parent ? i18nFilter()(parent.title) + "/" : "";
    SwTrack.all.trackEvent(
        "Internal Link",
        "click",
        `Side Bar/${parentTitle + i18nFilter()(item)}`,
    );
};
