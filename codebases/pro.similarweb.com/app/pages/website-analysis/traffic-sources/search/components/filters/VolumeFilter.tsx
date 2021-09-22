import { Injector } from "common/ioc/Injector";
import { RangeFilter } from "components/filtersPanel/src/RangeFilter";
import {
    getVolumeSelectedText,
    INITIAL_RANGE_VALUES,
    isValidVolumeRangeValues,
    onContainerKeyDown,
    onDoneCallback,
    resetRangeValues,
} from "components/filtersPanel/src/RangeFilterUtilityFunctions";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { i18nFilter, tableFilterFilter } from "filters/ngFilters";
import { useWebsiteKeywordsPageTableTopContext } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageContext";
import React from "react";
import { ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { useRankingDistributionTableTopContext } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/RankingDistributionContext";

const VOLUME_FILTER_WIDTH = 298;
const VOLUME_FILTER_BUTTON_TEXT_KEY = "keywords.table.filters.volume.button";
const VOLUME_FILTER_DISABLED_TOOLTIP_KEY = "keywords.table.filters.volume.disabled.tooltip";
const VOLUME_FILTER_SUPPORT_MAXIMUM_ROWS_AMOUNT = 50 * 1000;

// This is the representational component
export const VolumeFilter = ({
    onVolumeChange,
    tableFilters,
    tableData,
    disabled,
    tooltipText = null,
}) => {
    const { volumeFromValue, volumeToValue } = tableFilters;
    const { TotalCount: tableTotalCount } = tableData;
    const volumeChipDownRef = React.useRef(undefined);
    const i18n = i18nFilter();
    const volumeValue = { fromValue: volumeFromValue, toValue: volumeToValue };
    if (disabled && (volumeFromValue || volumeToValue)) {
        onVolumeChange(INITIAL_RANGE_VALUES);
        Injector.get("swNavigator").applyUpdateParams({
            volumeFromValue: undefined,
            volumeToValue: undefined,
        });
    }
    return (
        <PlainTooltip enabled={disabled} text={VOLUME_FILTER_DISABLED_TOOLTIP_KEY}>
            <div onKeyDown={onContainerKeyDown(volumeChipDownRef)}>
                <ChipDownContainer
                    disabled={disabled}
                    closeOnItemClick={false}
                    ref={volumeChipDownRef}
                    width={VOLUME_FILTER_WIDTH}
                    selectedText={getVolumeSelectedText(volumeValue)}
                    buttonText={i18n(VOLUME_FILTER_BUTTON_TEXT_KEY)}
                    onCloseItem={resetRangeValues(onVolumeChange)}
                    tooltipText={tooltipText}
                >
                    {[
                        <RangeFilter
                            key="range-filter"
                            onDoneCallback={onDoneCallback(onVolumeChange, volumeChipDownRef)}
                            initialFromValue={volumeValue.fromValue}
                            initialToValue={volumeValue.toValue}
                            isValidRangeValues={isValidVolumeRangeValues}
                        />,
                    ]}
                </ChipDownContainer>
            </div>
        </PlainTooltip>
    );
};
// This are the "connectors" that connect the certain context to the representational component
export const VolumeFilterForWebsiteKeywords = () => {
    const { onVolumeChange, tableFilters, tableData } = useWebsiteKeywordsPageTableTopContext();
    return (
        <VolumeFilter
            disabled={tableData.TotalCount > VOLUME_FILTER_SUPPORT_MAXIMUM_ROWS_AMOUNT}
            tableFilters={tableFilters}
            tableData={tableData}
            onVolumeChange={onVolumeChange}
        />
    );
};

export const VolumeFilterForRankingDistribution = () => {
    const { onVolumeChange, tableFilters, tableData } = useRankingDistributionTableTopContext();
    return (
        <VolumeFilter
            disabled={false}
            tableFilters={tableFilters}
            tableData={tableData}
            onVolumeChange={onVolumeChange}
        />
    );
};
