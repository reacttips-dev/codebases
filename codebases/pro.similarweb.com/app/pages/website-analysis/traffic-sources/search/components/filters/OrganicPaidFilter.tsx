import React from "react";
import { abbrNumberVisitsFilter } from "filters/ngFilters";
import { EllipsisDropdownItem, ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { EOrganicPaidFilterValues } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageTypes";
import { useWebsiteKeywordsPageTableTopContext } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageContext";

const items = [
    {
        text: "analysis.source.search.keywords.filters.organicpaid.default",
        key: "RESET",
    },
    {
        text: "analysis.source.search.keywords.filters.organic",
        key: EOrganicPaidFilterValues.IncludeOrganic,
        tooltip: "analysis.source.search.keywords.filters.organic.tooltip",
    },
    {
        text: "analysis.source.search.keywords.filters.paid.abtest",
        key: EOrganicPaidFilterValues.IncludePaid,
        tooltip: "analysis.source.search.keywords.filters.paid.tooltip",
    },
];
// This is the representational component
const OrganicPaidFilter = ({ tableFilters, onOrganicPaidChange }) => {
    const { IncludeOrganic, IncludePaid } = tableFilters;
    const translate = useTranslation();
    const selected = IncludeOrganic
        ? EOrganicPaidFilterValues.IncludeOrganic
        : IncludePaid
        ? EOrganicPaidFilterValues.IncludePaid
        : null;
    const selectedItem = items.find((item) => item.key === selected);
    return (
        <ChipDownContainer
            width={220}
            onClick={onOrganicPaidChange}
            tooltipDisabled={true}
            selectedText={selectedItem && translate(selectedItem.text)}
            onCloseItem={() => onOrganicPaidChange(null)}
            buttonText={translate(items[0].text)}
        >
            {items.map((item, index) => {
                return (
                    <EllipsisDropdownItem
                        selected={selected === item.key}
                        id={item.key}
                        key={index}
                        tooltipText={translate(item.tooltip)}
                    >
                        {translate(item.text)}
                    </EllipsisDropdownItem>
                );
            })}
        </ChipDownContainer>
    );
};

export const OrganicPaidFilterForWebsiteKeywords = () => {
    const { tableFilters, onOrganicPaidChange } = useWebsiteKeywordsPageTableTopContext();
    return (
        <OrganicPaidFilter tableFilters={tableFilters} onOrganicPaidChange={onOrganicPaidChange} />
    );
};
