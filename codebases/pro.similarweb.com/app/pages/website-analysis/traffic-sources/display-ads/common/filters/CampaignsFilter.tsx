import { abbrNumberVisitsFilter, i18nFilter } from "filters/ngFilters";
import React, { FC } from "react";
import { ICampaignFilter } from "pages/website-analysis/traffic-sources/display-ads/common/displayAdsTypes";
import MultiChipDown from "components/MultiChipDown/src/MultiChipDown";
import { getInitialSelectedItemsIds } from "./FiltersHelper";
import { StyledEllipsisDropdownItem } from "pages/website-analysis/traffic-sources/display-ads/common/StyledComponents";

export const CampaignsFilter: FC<ICampaignFilter> = (props) => {
    const { selectedCampaigns, campaigns, onCampaignsFilterChange } = props;

    const getDropdownMultiSelectItem = (option) => (
        <StyledEllipsisDropdownItem
            showCheckBox
            key={option.id}
            id={option.id}
            infoText={abbrNumberVisitsFilter()(option?.count || 0)}
            imageUrl={option?.imageUrl}
            childrenTooltip={option.text}
            disabled={option?.count == 0}
        >
            {i18nFilter()(option.text)}
        </StyledEllipsisDropdownItem>
    );

    return (
        <MultiChipDown
            initialSelectedItems={getInitialSelectedItemsIds(selectedCampaigns, campaigns)}
            options={campaigns}
            onDone={onCampaignsFilterChange}
            buttonText={i18nFilter()("traffic.sources.display.ads.campaigns.chipdown.text")}
            searchPlaceHolder={i18nFilter()(
                "traffic.sources.display.ads.campaigns.chipdown.placeholder",
            )}
            hasSearch={true}
            dropdownWidth={520}
            isDisabled={!campaigns || campaigns.length === 0}
            getDropdownItem={getDropdownMultiSelectItem}
            virtualize={campaigns?.length > 999 ? { itemBuffer: 50 } : null}
            maxVirtualItemsToRender={campaigns?.length > 999 ? 1000 : null}
            clearSelectionWhenOneOption={false}
        />
    );
};
