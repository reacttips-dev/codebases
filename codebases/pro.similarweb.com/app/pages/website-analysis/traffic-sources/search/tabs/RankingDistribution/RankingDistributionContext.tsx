import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { IWidgetTableResult } from "components/widget/widget-types/TableWidget";
import {
    EBrandedNonBrandedValues,
    IWebsiteKeywordsPageFilters,
} from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageTypes";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import React, { useContext } from "react";
import { IChosenItem } from "../../../../../../@types/chosenItems";
import {
    aggregatedTiers,
    singleTiers,
} from "pages/website-analysis/traffic-sources/search/components/filters/RankingTierFilter";

export interface IRankingDistributionTableTopContext {
    chosenItems: IChosenItem[];
    tableFilters: IWebsiteKeywordsPageFilters;
    onBrandedNonBrandedChange: (value) => void;
    onPhraseChange: (value) => void;
    onVolumeChange: (value) => void;
    onCpcChange: (value) => void;
    onSerpFilterApply: (features) => void;
    isCompare: boolean;
    tableData: IWidgetTableResult;
}

const RankingDistributionTableTopContext = React.createContext<IRankingDistributionTableTopContext>(
    null,
);
export const RankingDistributionTableTopContextProvider =
    RankingDistributionTableTopContext.Provider;
export const useRankingDistributionTableTopContext = (): IRankingDistributionTableTopContext =>
    useContext(RankingDistributionTableTopContext);

export const mapStateToProps = (state) => {
    const { routing } = state;
    const { currentPage, params, chosenItems } = routing;
    return {
        currentPage,
        params,
        chosenItems,
    };
};

export const getRankingDistributionTableTopContext = (args) => {
    const { isCompare, chosenItems, tableData, tableFilters, onFilterChange } = args;
    const swNavigator: SwNavigator = Injector.get("swNavigator");
    return {
        isCompare,
        chosenItems: chosenItems,
        tableFilters,
        tableData: tableData,

        onBrandedNonBrandedChange: (item) => {
            const params = {
                IncludeBranded: item?.id === EBrandedNonBrandedValues.IncludeBranded || false,
                IncludeNoneBranded:
                    item?.id === EBrandedNonBrandedValues.IncludeNoneBranded || false,
            };
            swNavigator.applyUpdateParams(params);
            onFilterChange(params);
            item &&
                TrackWithGuidService.trackWithGuid(
                    "website.keywords.table.filters.branded",
                    "click",
                    { value: EBrandedNonBrandedValues[item.id] },
                );
        },
        onVolumeChange: (value) => {
            const { fromValue, toValue } = value;
            const params = {
                volumeFromValue: fromValue,
                volumeToValue: toValue,
            };
            swNavigator.applyUpdateParams(params);
            onFilterChange(params);
            if (fromValue || toValue) {
                TrackWithGuidService.trackWithGuid(
                    "website.keywords.table.filters.volume",
                    "switch",
                    { fromValue: fromValue, toValue: toValue },
                );
            }
        },
        onCpcChange: (value) => {
            const { fromValue, toValue } = value;
            const params = {
                cpcFromValue: fromValue,
                cpcToValue: toValue,
            };
            swNavigator.applyUpdateParams(params);
            onFilterChange(params);
            if (fromValue || toValue) {
                TrackWithGuidService.trackWithGuid("website.keywords.table.filters.cpc", "switch", {
                    fromValue: fromValue,
                    toValue: toValue,
                });
            }
        },
        onPhraseChange: (value) => {
            const params = {
                selectedPhrase: value,
            };
            swNavigator.applyUpdateParams(params);
            onFilterChange(params);
            value &&
                TrackWithGuidService.trackWithGuid(
                    "website.keywords.table.filters.phrase",
                    "click",
                    { value: value },
                );
        },
        onSerpFilterApply: (features) => {
            const params = {
                serp: features.join(","),
            };
            swNavigator.applyUpdateParams(params);
            onFilterChange({ serp: features });
        },
        onRankingTierChange: (rankingTier) => {
            const params = {
                ranking: rankingTier?.id ?? null,
            };
            swNavigator.applyUpdateParams(params);
            onFilterChange(params);
            if (rankingTier) {
                const single = singleTiers.find((tier) => tier.value === rankingTier.id);
                const aggregated = aggregatedTiers.find((tier) => tier.value === rankingTier.id);
                const trackingValue = single ? single.value : aggregated.text;
                TrackWithGuidService.trackWithGuid(
                    "ranking_distribution.table.tier.filter",
                    "click",
                    {
                        position: trackingValue,
                    },
                );
            }
        },
    };
};
