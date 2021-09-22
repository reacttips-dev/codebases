import React from "react";
import Filter from "./Filter";
import {
    DESKTOP_DISPLAY,
    MOBILE_DISPLAY,
    DESKTOP_VIDEO,
    MOBILE_VIDEO,
    ALL_DISPLAY,
    ALL_VIDEO,
} from "../../channels";
import ChannelDropDownItem from "../ChannelDropDownItem";
import { i18nFilter } from "filters/ngFilters";
import { DropdownButtonStyled, ConfigDropDown } from "@similarweb/ui-components/dist/dropdown";

const translate = i18nFilter();

const getChannelTextAndIcon = (channel) => {
    switch (channel) {
        case ALL_DISPLAY:
        case ALL_VIDEO:
            return {
                text: translate("websources.total"),
                icon: "combined",
            };
        case DESKTOP_DISPLAY:
        case DESKTOP_VIDEO:
            return {
                text: translate("toggler.title.desktop"),
                icon: "desktop",
            };
        case MOBILE_DISPLAY:
        case MOBILE_VIDEO:
            return {
                text: translate("toggler.title.mobile"),
                icon: "mobile-web",
            };
    }
};

const getChannelList = (availableChannels, lockedChannels, onChannelLocked) => {
    return availableChannels.map((channel) => {
        const { text, icon } = getChannelTextAndIcon(channel);
        const locked = lockedChannels
            ? lockedChannels.find((lockedChannel) => lockedChannel == channel)
            : false;
        return {
            id: channel,
            locked,
            preventDefault: locked,
            onClick: locked ? onChannelLocked : undefined,
            text,
            icon,
            children: text,
        };
    });
};

const ChannelFilter = ({
    selectedChannel,
    onChannelChanged,
    availableChannels,
    onChannelLocked,
    lockedChannels,
}) => {
    const items = getChannelList(availableChannels, lockedChannels, onChannelLocked);
    const selectedChannelDropDownItem = items.find(({ id }) => id === selectedChannel);
    return (
        <Filter fieldName="Device">
            <ConfigDropDown
                items={items}
                selectedItemId={selectedChannelDropDownItem.id}
                ItemComponent={ChannelDropDownItem}
                ButtonComponent={DropdownButtonStyled}
                width="auto"
                onClick={({ id }) => onChannelChanged(id)}
            />
        </Filter>
    );
};

export default ChannelFilter;
