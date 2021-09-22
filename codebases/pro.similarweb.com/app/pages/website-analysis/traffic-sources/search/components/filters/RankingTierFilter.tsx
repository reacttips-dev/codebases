import React from "react";
import { ChipDownContainer, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { useRankingDistributionTableTopContext } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/RankingDistributionContext";
import {
    ETiers,
    tiersMeta,
} from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/Constants";
import { useTrack } from "components/WithTrack/src/useTrack";
import styled from "styled-components";
import { i18nFilter } from "filters/ngFilters";

const Separator = styled.hr<{ preventDefault?: boolean }>`
    margin: 0;
`;

export const aggregatedTiers = [
    {
        text: "Top 3",
        value: "-3",
        tiers: [ETiers.TIER1],
    },
    {
        text: "Top 10",
        value: "-10",
        tiers: [ETiers.TIER1, ETiers.TIER2],
    },
    {
        text: "Top 20",
        value: "-20",
        tiers: [ETiers.TIER1, ETiers.TIER2, ETiers.TIER3],
    },
    {
        text: "Top 50",
        value: "-50",
        tiers: [ETiers.TIER1, ETiers.TIER2, ETiers.TIER3, ETiers.TIER4],
    },
    {
        text: "Top 100",
        value: "-100",
        tiers: [ETiers.TIER1, ETiers.TIER2, ETiers.TIER3, ETiers.TIER4, ETiers.TIER5],
    },
];

export const singleTiers = [
    {
        text: tiersMeta[ETiers.TIER1].text,
        value: tiersMeta[ETiers.TIER1].id,
        tiers: [ETiers.TIER1],
        compareTableTooltipText: tiersMeta[ETiers.TIER1].compareTableTooltipText,
    },
    {
        text: tiersMeta[ETiers.TIER2].text,
        value: tiersMeta[ETiers.TIER2].id,
        tiers: [ETiers.TIER2],
        compareTableTooltipText: tiersMeta[ETiers.TIER2].compareTableTooltipText,
    },
    {
        text: tiersMeta[ETiers.TIER3].text,
        value: tiersMeta[ETiers.TIER3].id,
        tiers: [ETiers.TIER3],
        compareTableTooltipText: tiersMeta[ETiers.TIER3].compareTableTooltipText,
    },
    {
        text: tiersMeta[ETiers.TIER4].text,
        value: tiersMeta[ETiers.TIER4].id,
        tiers: [ETiers.TIER4],
        compareTableTooltipText: tiersMeta[ETiers.TIER4].compareTableTooltipText,
    },
    {
        text: tiersMeta[ETiers.TIER5].text,
        value: tiersMeta[ETiers.TIER5].id,
        tiers: [ETiers.TIER5],
        compareTableTooltipText: tiersMeta[ETiers.TIER5].compareTableTooltipText,
    },
];

export const RankingTierFilter: React.FC = () => {
    const {
        tableFilters: { ranking },
        onRankingTierChange,
    }: any = useRankingDistributionTableTopContext();
    const translate = useTranslation();
    const [trackLegacy, trackWithGuid] = useTrack();
    const items = [...aggregatedTiers, ...singleTiers];
    const selectedItem = items.find((item) => item.value === ranking);

    const onToggle = (isOpen) => {
        if (isOpen) {
            trackWithGuid("ranking_distribution.table.tier.filter", "open");
        }
    };

    const getItemComponent = (item) => {
        return (
            <EllipsisDropdownItem id={item.value} key={item.value}>
                {translate(item.text)}
            </EllipsisDropdownItem>
        );
    };
    // @ts-ignore
    const itemsComponent = [
        ...aggregatedTiers.map(getItemComponent),
        <Separator key="separator" preventDefault={true} />,
        ...singleTiers.map(getItemComponent),
    ];
    const selectedIds = selectedItem ? { [selectedItem.value]: true } : {};
    return (
        <ChipDownContainer
            width={220}
            onClick={onRankingTierChange}
            onToggle={onToggle}
            selectedText={selectedItem && translate(selectedItem.text)}
            onCloseItem={() => onRankingTierChange(null)}
            buttonText={i18nFilter()("ranking.distribution.filters.position")}
            selectedIds={selectedIds}
        >
            {itemsComponent}
        </ChipDownContainer>
    );
};
