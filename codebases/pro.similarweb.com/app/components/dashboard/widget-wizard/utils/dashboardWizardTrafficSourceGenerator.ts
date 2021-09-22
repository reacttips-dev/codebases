import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";

export class TrafficSource {
    id: string | number;
    text: string;
    icon: string;
    upgrade?: boolean;
    url?: string;
    disabled?: boolean;

    constructor(id: string | number, text: string, icon: string, url?: string, disabled?: boolean) {
        this.id = id;
        this.text = text;
        this.icon = icon;
        this.url = url;
        this.disabled = disabled || false;
        this.upgrade = !!url;
    }

    public static get DESKTOP_KEY(): string {
        return "analysis.audience.mobileweb.desktop.traffic";
    }

    public static get MOBILE_KEY(): string {
        return "analysis.audience.overview.mobile";
    }

    public static get TOTAL_KEY(): string {
        return "analysis.single.trafficsources.tabs.total";
    }

    public static get DESKTOP_ICON(): string {
        return "desktop";
    }

    public static get MOBILE_ICON(): string {
        return "mobile-web";
    }

    public static get TOTAL_ICON(): string {
        return "sw-icon-widget-total";
    }

    public static get DESKTOP(): string {
        return "Desktop";
    }

    public static get MOBILE(): string {
        return "MobileWeb";
    }

    public static get TOTAL(): string {
        return "Total";
    }

    public static get UPGRADE_LINK(): string {
        return swSettings.swurls.EnterpriseUpgradeAccountURL;
    }
}

export function initFullTrafficSources(): TrafficSource[] {
    return [
        new TrafficSource(TrafficSource.TOTAL, TrafficSource.TOTAL_KEY, TrafficSource.TOTAL_ICON),
        new TrafficSource(
            TrafficSource.DESKTOP,
            TrafficSource.DESKTOP_KEY,
            TrafficSource.DESKTOP_ICON,
        ),
        new TrafficSource(
            TrafficSource.MOBILE,
            TrafficSource.MOBILE_KEY,
            TrafficSource.MOBILE_ICON,
        ),
    ];
}

export function initTrafficSourcesExcludeTotal(): TrafficSource[] {
    return [
        new TrafficSource(
            TrafficSource.TOTAL,
            TrafficSource.TOTAL_KEY,
            TrafficSource.TOTAL_ICON,
            null,
            true,
        ),
        new TrafficSource(
            TrafficSource.DESKTOP,
            TrafficSource.DESKTOP_KEY,
            TrafficSource.DESKTOP_ICON,
        ),
        new TrafficSource(
            TrafficSource.MOBILE,
            TrafficSource.MOBILE_KEY,
            TrafficSource.MOBILE_ICON,
        ),
    ];
}

export function initTrafficSourcesExcludeDesktopAndMobile(): TrafficSource[] {
    return [
        new TrafficSource(TrafficSource.TOTAL, TrafficSource.TOTAL_KEY, TrafficSource.TOTAL_ICON),
        new TrafficSource(
            TrafficSource.DESKTOP,
            TrafficSource.DESKTOP_KEY,
            TrafficSource.DESKTOP_ICON,
            null,
            true,
        ),
        new TrafficSource(
            TrafficSource.MOBILE,
            TrafficSource.MOBILE_KEY,
            TrafficSource.MOBILE_ICON,
            null,
            true,
        ),
    ];
}

export function initPartialTrafficSourcesExcludeTotalUpgradeMobile(): TrafficSource[] {
    return [
        new TrafficSource(
            TrafficSource.TOTAL,
            TrafficSource.TOTAL_KEY,
            TrafficSource.TOTAL_ICON,
            null,
            true,
        ),
        new TrafficSource(
            TrafficSource.DESKTOP,
            TrafficSource.DESKTOP_KEY,
            TrafficSource.DESKTOP_ICON,
        ),
        new TrafficSource(
            TrafficSource.MOBILE,
            TrafficSource.MOBILE_KEY,
            TrafficSource.MOBILE_ICON,
            TrafficSource.UPGRADE_LINK,
            null,
        ),
    ];
}

export function initTrafficSourcesUpgradeMobile(): TrafficSource[] {
    return [
        new TrafficSource(TrafficSource.TOTAL, TrafficSource.TOTAL_KEY, TrafficSource.TOTAL_ICON),
        new TrafficSource(
            TrafficSource.MOBILE,
            TrafficSource.MOBILE_KEY,
            TrafficSource.MOBILE_ICON,
            TrafficSource.UPGRADE_LINK,
            null,
        ),
        new TrafficSource(
            TrafficSource.DESKTOP,
            TrafficSource.DESKTOP_KEY,
            TrafficSource.DESKTOP_ICON,
            null,
        ),
    ];
}

export function initTrafficSourcesDefault(): TrafficSource[] {
    return [
        new TrafficSource(
            TrafficSource.TOTAL,
            TrafficSource.TOTAL_KEY,
            TrafficSource.TOTAL_ICON,
            null,
            true,
        ),
        new TrafficSource(
            TrafficSource.DESKTOP,
            TrafficSource.DESKTOP_KEY,
            TrafficSource.DESKTOP_ICON,
        ),
        new TrafficSource(
            TrafficSource.MOBILE,
            TrafficSource.MOBILE_KEY,
            TrafficSource.MOBILE_ICON,
            null,
            true,
        ),
    ];
}
