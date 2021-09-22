import React from "react";
import { EllipsisDropdownItem, ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { EBrandedNonBrandedValues } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageTypes";
import { useWebsiteKeywordsPageTableTopContext } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageContext";
import { useRankingDistributionTableTopContext } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/RankingDistributionContext";
import { useTrack } from "components/WithTrack/src/useTrack";

const items = [
    {
        text: "analysis.source.search.keywords.filters.branded.default",
        key: "RESET",
    },
    {
        text: "analysis.source.search.keywords.filters.branded.abtest",
        tooltip: "analysis.source.search.keywords.filters.branded.tooltip",
        key: EBrandedNonBrandedValues.IncludeBranded,
    },
    {
        text: "analysis.source.search.keywords.filters.non-branded.abtest",
        tooltip: "analysis.source.search.keywords.filters.non-branded.tooltip",
        key: EBrandedNonBrandedValues.IncludeNoneBranded,
    },
];
// This is the representational component
export const BrandedNonBrandedFilter: React.FC<{
    tableFilters;
    onBrandedNonBrandedChange: (type) => void;
    tooltipText?: string;
}> = ({ tableFilters, onBrandedNonBrandedChange, tooltipText }) => {
    const { IncludeBranded, IncludeNoneBranded } = tableFilters;
    const translate = useTranslation();
    const [trackLegacy, trackWithGuid] = useTrack();
    const onToggle = (isOpen) => {
        if (isOpen) {
            trackWithGuid("website.keywords.table.filters.branded", "open");
        }
    };
    const selected = IncludeBranded
        ? EBrandedNonBrandedValues.IncludeBranded
        : IncludeNoneBranded
        ? EBrandedNonBrandedValues.IncludeNoneBranded
        : null;
    const selectedItem = items.find((item) => item.key === selected);
    return (
        <ChipDownContainer
            width={220}
            onClick={onBrandedNonBrandedChange}
            onToggle={onToggle}
            tooltipText={tooltipText}
            tooltipDisabled={!tooltipText}
            selectedText={selectedItem && translate(selectedItem.text)}
            onCloseItem={() => onBrandedNonBrandedChange(null)}
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

// This are the "connectors" that connect the certain context to the representational component
export const BrandedNonBrandedFilterForWebsiteKeywords = () => {
    const { tableFilters, onBrandedNonBrandedChange } = useWebsiteKeywordsPageTableTopContext();
    return (
        <BrandedNonBrandedFilter
            tableFilters={tableFilters}
            onBrandedNonBrandedChange={onBrandedNonBrandedChange}
        />
    );
};

export const BrandedNonBrandedFilterForRankingDistribution = () => {
    const { tableFilters, onBrandedNonBrandedChange } = useRankingDistributionTableTopContext();
    return (
        <BrandedNonBrandedFilter
            tableFilters={tableFilters}
            onBrandedNonBrandedChange={onBrandedNonBrandedChange}
        />
    );
};
