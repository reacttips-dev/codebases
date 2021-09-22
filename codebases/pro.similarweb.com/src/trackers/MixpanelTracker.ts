import swLog from "@similarweb/sw-log";
import { getUrlWithTime, isFsLoaded } from "../utils/FullStory";
import { BaseTracker } from "./BaseTracker";
import { ICustomDimensionData } from "./ITrack";
import { deprecatedProperties, propertiesToResetOnPageview } from "./MixpanelProperties";
import getSessionId from "./sessionIdGenerator";

declare const SW_ENV: { debug: boolean; apiCache: boolean };
const TRACK_PAGE_VIEW_KEY = "PageView";

export abstract class MixpanelTracker extends BaseTracker {
  private timeout = 1800000;

protected trackPageViewInternal(customDimsData: ICustomDimensionData) {
    try {

      const mixpanel = this.mixpanel();

      if (!mixpanel) {
        return;
      }

      const customDimentions = {
          url: window.location.href,
          is_sw_user: customDimsData.is_sw_user,
          language: customDimsData.lang,
          ...customDimsData.path,
          ...customDimsData.query,
          ...customDimsData.entity,
          ...customDimsData.filters,
          ...customDimsData.category,
          ...customDimsData.identity,
          ...customDimsData.custom_data,
      };

      // If FullStory is loaded, add the session URL to the event metadata
      if (isFsLoaded()) {
        customDimentions["Fullstory Session"] = getUrlWithTime();
      }

      this.ensureSessionId();
      // Some properties are used in some pages
      // and also events associated with these pages.
      // We want to reset these properties so they aren't
      // sent in pages where they aren't explicitly set.
      this.resetProperties(mixpanel);
      mixpanel.register({
          ...customDimentions,
          last_event_time: Date.now(),
      });

      mixpanel.track(TRACK_PAGE_VIEW_KEY);
      } catch (e) {
        swLog.exception("Error in sending pageview to Mixpanel", e);
      }
}

protected trackEventInternal(category, action, name, value) {
    try {
        const mixpanel = this.mixpanel();
        if (!mixpanel) {
          return;
        }

        this.ensureSessionId();
        mixpanel.register({
            last_event_time: Date.now(),
        });

        if (Array.isArray(category) && category[0] === "PageError") {
            mixpanel.track(category[0], {
            properties: {
                path: category[1],
                error_status_code: category[2],
            },
            });
        } else {
            const nameParams = name.split("/");
            const eventParams = {
            category,
            action,
            event_full_name: name,
            event_name: nameParams[0] || "none",
            event_sub_name: nameParams[1] || "none",
            event_sub_sub_name: nameParams[2] || "none",
            value,
            custom_url: window.location.href,
            };

            // If FullStory is loaded, add the session URL to the event metadata
            if (isFsLoaded()) {
              eventParams["Fullstory Session"] = getUrlWithTime();
            }
            mixpanel.track(category, eventParams);
        }
        } catch (e) {
            swLog.exception("Error in sending Mixpanel event ", e);
        }
  }

  protected healthCheckInternal() {
    const mixpanel = this.mixpanel();

    if (!mixpanel) {
      return;
    }

    if (!("get_property" in mixpanel)) {
      return;
    }

    // check GTM:
    if (!SW_ENV.debug && !window["google_tag_manager"]) {
      swLog.serverLogger("GTM not loaded", null, "Info");
    }

    // Check that the mixpanel script is loaded and initialized
    if (!SW_ENV.debug && !mixpanel) {
      swLog.serverLogger("Mixpanel is not loaded", null, "Info");
    }
  }

  protected abstract mixpanel(): any;

  protected shouldBuffer() {
    return false;
  }

  private setSessionId = mixpanel => {
    mixpanel.register({
      session_id: getSessionId(),
      session_first_event_time: new Date(),
    });
  }

  private resetProperties(mixpanel) {
    // The async part of Mixpanel is required
    // to interact with super properties.
    // We need to validate it's loaded and initialized
    if (!("get_property" in mixpanel)) {
      return;
    }

    propertiesToResetOnPageview.forEach( prop => {
      mixpanel.unregister(prop);
    });
  }

  private unregisterDeprecatedProperties(mixpanel) {
      deprecatedProperties.forEach( elm => {
        mixpanel.unregister(elm);
      });
  }

  private ensureSessionId = () => {
    const mixpanel = this.mixpanel();

    if (!mixpanel) {
      return;
    }

    if (!("get_property" in mixpanel)) {
      return;
    }

    if (!mixpanel.get_property("last_event_time") ||
                !mixpanel.get_property("session_id")) {
      // Super properties are persisted in cookies, so when a property is deprectaed or renamed,
      // it needs to be manually unregistered, or Mixpanel will keep sending it until the cookie is cleared for some reason
      // This call will remove deprected properties before starting a new session.
      // This method is used instead of mixpanel.reset(), so we don't loose data.
      this.unregisterDeprecatedProperties(mixpanel);
      this.setSessionId(mixpanel);
    }

    // Need to add the unary '+' so TS linter doesn't get mad
    // that we are subtracting non-numerical values
    // this is that valueOf of a Date object is a number
    const parsedDate = +new Date(mixpanel.get_property("last_event_time"));
    if (Math.abs(+Date.now() -  parsedDate) > this.timeout) {
      this.setSessionId(mixpanel);
    }
  }
}



// WEBPACK FOOTER //
// ./src/trackers/MixpanelTracker.ts