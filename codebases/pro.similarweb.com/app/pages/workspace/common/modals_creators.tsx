import { colorsPalettes } from "@similarweb/styles";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import React from "react";
import reactDOM from "react-dom";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { allTrackers } from "../../../services/track/track";
import { ListSettingsModal, TSelectedTab } from "./ListSettingsModal";
import {
    IOpportunityListItem,
    IOpportunityListItemTrackStatus,
    IOpportunityUpdateInfo,
} from "./types";
import { WatchListModal } from "./WatchListModal";

export interface IListSettings {
    list?: IOpportunityListItem;
    mode?: string;
    editFeedGeos?: boolean;
    selectedTab?: TSelectedTab;
    unsupportedFeatures: Set<string>;
    variant?: "old" | "new";
}

export const editListModal = (props = {} as IListSettings): Promise<IOpportunityUpdateInfo> => {
    const domEl = document.createElement("div");
    document.body.appendChild(domEl);
    const removeModal = () => {
        setTimeout(() => {
            reactDOM.unmountComponentAtNode(domEl);
        }, 1000);
    };
    return new Promise((resolve) => {
        reactDOM.render(
            <ListSettingsModal onClose={removeModal} onUpdate={resolve} {...props} />,
            domEl,
        );
        allTrackers.trackEvent(
            "pop up/list model setting",
            "open",
            (props.list && props.list.friendlyName) || "create new list",
        );
    });
};

export const addToWatchlistModal = (domain): Promise<IOpportunityListItemTrackStatus> => {
    const domEl = document.createElement("div");
    document.body.appendChild(domEl);

    return new Promise((resolve, reject) => {
        let resolved = false;
        const onSelect = (args) => {
            TrackWithGuidService.trackWithGuid("website_analysis.watchlist_modal.add", "click");
            resolved = true;
            resolve(args);
        };
        const removeModal = () => {
            setTimeout(() => {
                reactDOM.unmountComponentAtNode(domEl);
            }, 1000);
            if (!resolved) {
                reject();
            }
        };
        // PopupHoverContainer.closePopup();
        reactDOM.render(
            <WatchListModal onClose={removeModal} onSelect={onSelect} domain={domain} />,
            domEl,
        );
    });
};
