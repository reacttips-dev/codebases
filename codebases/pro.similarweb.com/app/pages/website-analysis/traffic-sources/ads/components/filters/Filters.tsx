import React from "react";
import SiteFilter from "./SiteFilter";
import CampaignFilter from "./CampaignFilter";
import SortByField from "./SortByField";
import SortDirection from "./SortDirection";
import ClearAllButton from "./ClearAllButton";
import ChannelFilter from "./ChannelFilter";
import styled from "styled-components";

const ClearButtonContainer = styled.div`
    position: relative;
    top: 10px;
`;

const Filters = ({
    campaigns,
    sources,
    formats,
    selectedCampaign,
    onCampaignChanged,
    onChannelChanged,
    availableChannels,
    selectedSortField,
    onSort,
    selectedSortDirection,
    onSortDirection,
    selectedChannel,
    sites,
    selectedSite,
    onSiteChanged,
    isCompare,
    onSortDropDownToggle,
    onReset,
    lockedChannels,
    onChannelLocked,
}) => {
    return (
        <div className="gallery-filters u-flex-row u-flex-center">
            {isCompare && <SiteFilter {...{ sites, selectedSite, onSiteChanged }} />}
            <CampaignFilter {...{ campaigns, selectedCampaign, onCampaignChanged }} />
            <SortByField
                {...{ selectedSortField, onSort, onSortDropDownToggle, selectedChannel }}
            />
            <ChannelFilter
                {...{
                    onChannelChanged,
                    availableChannels,
                    selectedChannel,
                    lockedChannels,
                    onChannelLocked,
                }}
            />
            <SortDirection {...{ selectedSortDirection, onSortDirection }} />
            <ClearButtonContainer>
                <ClearAllButton
                    {...{
                        selectedCampaign,
                        selectedSortField,
                        selectedChannel,
                        selectedSortDirection,
                        selectedSite,
                        onReset,
                    }}
                />
            </ClearButtonContainer>
        </div>
    );
};

export default Filters;
