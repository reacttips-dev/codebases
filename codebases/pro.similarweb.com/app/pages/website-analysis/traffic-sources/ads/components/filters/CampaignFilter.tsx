import React, { StatelessComponent } from "react";
import Filter from "./Filter";
import { ALL_CAMPAIGNS } from "../../availableFilters";
import {
    DropdownButtonStyled,
    CheckableDropdownItem,
    ConfigDropDown,
} from "@similarweb/ui-components/dist/dropdown";

const toDropDownCampaignItem = ({ text, value = text }: any) => ({
    id: text,
    text,
    key: text,
    value,
    children: text,
});
const getCampaignList = (campaigns) => {
    const allCampaigns = toDropDownCampaignItem({
        id: "All Campaigns",
        text: "All Campaigns",
        value: ALL_CAMPAIGNS,
    });
    const dropDownCampaignList = campaigns.map(toDropDownCampaignItem);
    return [allCampaigns, ...dropDownCampaignList];
};

const CampaignFilter: StatelessComponent<any> = ({
    campaigns,
    selectedCampaign,
    onCampaignChanged,
}) => {
    const campaignList = getCampaignList(campaigns);
    const selectedCampaignForDropDown = campaignList.find(
        ({ value }) => value === selectedCampaign,
    );
    return (
        <Filter fieldName="Campaign" tooltip="analysis.sources.ads.gallery.campaignsdd.tooltip">
            <ConfigDropDown
                items={campaignList}
                selectedItemId={selectedCampaignForDropDown.id}
                ItemComponent={CheckableDropdownItem}
                ButtonComponent={DropdownButtonStyled}
                width="auto"
                onClick={({ value }) => onCampaignChanged(value)}
            />
        </Filter>
    );
};

export default CampaignFilter;
