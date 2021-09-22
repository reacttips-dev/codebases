import * as _ from "lodash";
import { allTrackers } from "./track";

export interface ITrackManagementItem {
    id: number;
    guid: string;
    eventName: string;
    action: string;
    category: string;
    description: string;
}

declare const window;

export class TrackWithGuidService {
    public static trackWithGuid(guid: string, action: string, replacements?: any) {
        let trackValue: ITrackManagementItem = _.get(
            window.trackManagementData,
            `['${guid}']['${action}']`,
            undefined,
        );
        if (trackValue === undefined) {
            console.warn(
                "*****************************************************************************************************************",
            );
            console.warn(
                `%c No track entry was found for guid: ${guid} and action: ${action}`,
                "background: #222; color: #bada55",
            );
            console.warn(
                "*****************************************************************************************************************",
            );
            return;
        }
        trackValue = _.cloneDeep(trackValue);
        if (replacements) {
            for (const key in replacements) {
                if (!replacements.hasOwnProperty(key)) {
                    continue;
                }

                const value = replacements[key];
                let text: string = value;
                if (!value) {
                    text = "";
                }
                trackValue.category = trackValue.category.replace(
                    new RegExp("%" + key + "%", "g"),
                    text,
                );
                trackValue.eventName = trackValue.eventName.replace(
                    new RegExp("%" + key + "%", "g"),
                    text,
                );
                // add optional chaining since the description attribute is not mandatory
                trackValue.description = trackValue.description?.replace(
                    new RegExp("%" + key + "%", "g"),
                    text,
                );
            }
        }
        if (
            process.env.NODE_ENV === "development" ||
            !!~document.cookie.indexOf("locale_track=1")
        ) {
            console.info(
                "*****************************************************************************************************************",
            );
            console.info(
                `%c Track Event: Guid: ${guid} , Action: ${action},
             Category: ${trackValue.category}, EventName: ${trackValue.eventName}, Description: ${trackValue.description}`,
                "background: #222; color: #bada55",
            );
            console.info(
                "*****************************************************************************************************************",
            );
        }

        allTrackers.trackEvent(trackValue.category, trackValue.action, trackValue.eventName);
    }

    public static getInstance(trackDictionary) {
        if (!TrackWithGuidService.instance) {
            TrackWithGuidService.instance = new TrackWithGuidService(trackDictionary);
        }
        return TrackWithGuidService.instance;
    }

    private static instance: TrackWithGuidService;
    private trackDictionary;

    private constructor(trackDictionary) {
        this.trackDictionary = trackDictionary;
    }
}

export type ITrackWithGuidService = typeof TrackWithGuidService;
