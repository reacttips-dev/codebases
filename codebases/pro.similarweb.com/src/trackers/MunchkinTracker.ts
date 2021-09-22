import * as pickBy from "lodash.pickby";

import swLog from "@similarweb/sw-log";
import { createQueryString, filterEmptyParams } from "../utils/helpers";
import { BaseTracker } from "./BaseTracker";
import { ICustomDimensionData } from "./ITrack";

declare const SW_ENV: { debug: boolean, apiCache: boolean };

export abstract class MunchkinTracker extends BaseTracker {

    public updateLeadAction(fieldMap: any, user: { username: string, firstname: string, lastname: string }) {
        // add mandatory fields
        fieldMap.Email = user.username;
        fieldMap.FirstName = user.firstname;
        fieldMap.LastName = user.lastname;
        return fetch(this.marketoEndpoint(), {
            method: "POST",
            credentials: "include",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(fieldMap),
        });
    }

    public clickLinkAction(href) {
        try {
            const munchkin = this.munchkin();
            if (munchkin) {
                munchkin("clickLink", {
                    href,
                });
            }
        } catch (e) {
            swLog.exception("Error in munchkin", e);
        }
    }

    public associateLeadAction(fieldMap) {
        try {
            this.munchkin()("associateLead", fieldMap);
        } catch (e) {
            swLog.exception("Error in munchkin", e);
        }
    }

    protected trackPageViewInternal(customDimsData: ICustomDimensionData) {
        try {
            // TODO: verify the change in munchkin
            const munchkin = this.munchkin();
            if (munchkin) {
                munchkin("visitWebPage", {
                    url: this.location(),
                });
            }
        } catch (e) {
            swLog.exception("Error in munchkin", e);
        }
    }

    protected trackEventInternal(category, action, label, value) {
        this.clickLinkAction("/" + category + "/" + action + "/" + label);
    }

    protected healthCheckInternal() {
        if (!SW_ENV.debug && window["GTM"] && window["GTM"].marketo.enabled && (!window["Munchkin"] || !window["Munchkin"].munchkinFunction)) {
            swLog.serverLogger("Munchkin is not loaded", null, "Info");
        }
    }

    /**
     * getter for the native tracker
     */
    protected abstract munchkin(): (...params) => void;

    /**
     * getter for the location URL
     */
    protected abstract location(): string;

    /**
     * getter for the search params object
     */
    protected abstract searchParams(): any;

    /**
     * getter for the marketo submit endpoint
     */
    protected abstract marketoEndpoint(): string;
}



// WEBPACK FOOTER //
// ./src/trackers/MunchkinTracker.ts