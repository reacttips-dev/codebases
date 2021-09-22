import { Injector } from "common/ioc/Injector";
import { RangeFilter } from "components/filtersPanel/src/RangeFilter";
import {
    getCpcSelectedText,
    resetRangeValues,
    cpcValuesFormatter,
    cpcValuesParser,
    isValidCpcRangeValues,
    onDoneCallback,
    onContainerKeyDown,
    INITIAL_RANGE_VALUES,
} from "components/filtersPanel/src/RangeFilterUtilityFunctions";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { i18nFilter } from "filters/ngFilters";
import { useWebsiteKeywordsPageTableTopContext } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageContext";
import React from "react";
import { ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import styled from "styled-components";
import { useRankingDistributionTableTopContext } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/RankingDistributionContext";

const RangeFilterContainer = styled.div`
    .range-filter {
        input {
            width: 50px;
        }
    }
`;

const CPC_FILTER_WIDTH = 238;
const CPC_FILTER_BUTTON_TEXT_KEY = "keywords.table.filters.cpc.button";
const CPC_FILTER_DISABLED_TOOLTIP_KEY = "keywords.table.filters.cpc.disabled.tooltip";
const CPC_FROM_PLACEHOLDER = "$0";
const CPC_TO_PLACEHOLDER = ">$20";
const TotalCount = 50 * 1000;

// This is the representational component
export const CpcFilter = ({
    onCpcChange,
    tableFilters,
    tableData,
    disabled,
    tooltipText = null,
}) => {
    const { cpcFromValue, cpcToValue } = tableFilters;
    const cpcChipDownRef = React.useRef(undefined);
    const cpcValue = { fromValue: cpcFromValue, toValue: cpcToValue };
    const i18n = i18nFilter();
    if (disabled && (cpcFromValue || cpcToValue)) {
        onCpcChange(INITIAL_RANGE_VALUES);
        Injector.get("swNavigator").applyUpdateParams({
            cpcFromValue: undefined,
            cpcToValue: undefined,
        });
    }
    return (
        <PlainTooltip enabled={disabled} text={CPC_FILTER_DISABLED_TOOLTIP_KEY}>
            <div onKeyDown={onContainerKeyDown(cpcChipDownRef)}>
                <ChipDownContainer
                    disabled={disabled}
                    closeOnItemClick={false}
                    ref={cpcChipDownRef}
                    width={CPC_FILTER_WIDTH}
                    selectedText={getCpcSelectedText(cpcValue)}
                    buttonText={i18n(CPC_FILTER_BUTTON_TEXT_KEY)}
                    onCloseItem={resetRangeValues(onCpcChange)}
                    tooltipText={tooltipText}
                >
                    {[
                        <RangeFilterContainer key="container">
                            <RangeFilter
                                onDoneCallback={onDoneCallback(onCpcChange, cpcChipDownRef)}
                                initialFromValue={cpcValue.fromValue}
                                initialToValue={cpcValue.toValue}
                                fromPlaceHolder={CPC_FROM_PLACEHOLDER}
                                toPlaceHolder={CPC_TO_PLACEHOLDER}
                                valuesFormatter={cpcValuesFormatter}
                                valuesParser={cpcValuesParser}
                                isValidRangeValues={isValidCpcRangeValues}
                            />
                        </RangeFilterContainer>,
                    ]}
                </ChipDownContainer>
            </div>
        </PlainTooltip>
    );
};

// This are the "connectors" that connect the certain context to the representational component
export const CpcFilterForWebsiteKeywords = () => {
    const { onCpcChange, tableFilters, tableData } = useWebsiteKeywordsPageTableTopContext();
    return (
        <CpcFilter
            disabled={tableData.TotalCount > TotalCount}
            onCpcChange={onCpcChange}
            tableFilters={tableFilters}
            tableData={tableData}
        />
    );
};

export const CpcFilterForRankingDistribution = () => {
    const { onCpcChange, tableFilters, tableData } = useRankingDistributionTableTopContext();
    return (
        <CpcFilter
            disabled={false}
            onCpcChange={onCpcChange}
            tableFilters={tableFilters}
            tableData={tableData}
        />
    );
};
