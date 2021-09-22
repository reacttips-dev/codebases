/* eslint:disable:max-classes-per-file no-empty */
import {
    AggregatedTracker,
    ConsoleTracker,
    GoogleTracker,
    IntercomTracker,
    MixpanelTracker,
    MunchkinTracker,
    PiwikTracker,
    trackerWithConsole,
} from "@similarweb/sw-track";

import { ILocationService } from "angular";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import { build } from "services/track/CustomUrlBuilderService";
import { PageId } from "userdata";
import { registerToonimoListeners } from "../plugins/ToonimoPlugin";
import { registerSurveyListeners } from "../plugins/WebEngagePlugin";

declare const SW_ENV: { debug: boolean };

const locationService = () => Injector.get("$location") as ILocationService;

// tracker instances
const piwikTrackerInt = new (class extends PiwikTracker {
    protected paq(): any[] {
        return window._paq;
    }

    protected shouldBuffer(): boolean {
        return window.similarweb.config.trackBuffer;
    }

    protected searchParams() {
        return locationService().search();
    }

    protected isEnabled(): boolean {
        return !SW_ENV.debug;
    }
})();

const munchkinTrackerInt = new (class extends MunchkinTracker {
    protected munchkin(): (...params) => void {
        return window.MunchkinAsync;
    }

    protected location(): string {
        return locationService().absUrl();
    }

    protected searchParams() {
        return locationService().search();
    }

    protected marketoEndpoint(): string {
        return "/api/marketo";
    }

    protected isEnabled(): boolean {
        return !SW_ENV.debug;
    }
})();

const googleTrackerInt = new (class extends GoogleTracker {
    protected ga(): (...params) => void {
        return window.ga;
    }

    protected isEnabled(): boolean {
        return !SW_ENV.debug;
    }
})();

const intercomTrackerInt = new (class extends IntercomTracker {
    protected intercom(): (...params) => void {
        return window.Intercom;
    }

    protected isEnabled(): boolean {
        return !SW_ENV.debug;
    }
})();

const mixpanelTrackerInt = new (class extends MixpanelTracker {
    protected mixpanel() {
        return window.mixpanel;
    }

    protected isEnabled(): boolean {
        return !SW_ENV.debug;
    }
})();

// public trackers
export const piwikTracker = trackerWithConsole(piwikTrackerInt, "piwikTracker");
export const munchkinTracker = trackerWithConsole(munchkinTrackerInt, "munchkinTracker");
export const googleTracker = trackerWithConsole(googleTrackerInt, "googleTracker");
export const intercomTracker = trackerWithConsole(intercomTrackerInt, "intercomTracker");
export const mixpanelTracker = trackerWithConsole(mixpanelTrackerInt, "mixpanelTracker");
export const allTrackers = new AggregatedTracker([
    piwikTrackerInt,
    munchkinTrackerInt,
    googleTrackerInt,
    mixpanelTracker,
    /* _intercomTracker */
    new ConsoleTracker("allTrackers"),
]);

export function trackPageViewWithCustomUrl(toState, toParams) {
    const pageTrackingObject: PageId = {
        ...toState.data.getTrackId(toState, toParams),
        pageId: toState.pageTitle,
    };
    const trackingParams = build(
        toState.data.getCustomUrlType(toState),
        pageTrackingObject,
        toParams,
        swSettings.current,
    );
    piwikTracker.trackPageView(trackingParams);
    mixpanelTracker.trackPageView(trackingParams);
    munchkinTracker.trackPageView(trackingParams);
}

export function healthChecks() {
    piwikTracker.healthCheck();
    munchkinTracker.healthCheck();
    googleTracker.healthCheck();
    mixpanelTracker.healthCheck();
}

export function init() {
    registerSurveyListeners();
    registerToonimoListeners();
}
