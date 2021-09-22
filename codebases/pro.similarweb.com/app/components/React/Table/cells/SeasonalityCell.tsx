import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { colorsPalettes } from "@similarweb/styles";
import styled, { css } from "styled-components";
import { setFont } from "@similarweb/styles/src/mixins";
import { ShortenedMonthsKeys } from "UtilitiesAndConstants/Constants/Months";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";

const MonthsAmount = 12;
const TooltipItemsSeparator = ", ";
const TooltipRangeSeparator = "-";
const TooltipPrefixKey = "industry.analysis.keywords.seasonality.table.seasonal.cell.tooltip";
const MonthsKeysArray = Object.values(ShortenedMonthsKeys);
const i18n = i18nFilter();

enum PositionTypes {
    none,
    middle,
    rightEdge,
    leftEdge,
    single,
}

const getPositionType = (item, index, items) => {
    const itemsLength = items.length;
    if (!item.mark) {
        return PositionTypes.none;
    }
    if (items[(index + itemsLength + 1) % itemsLength].mark) {
        if (items[(index + itemsLength - 1) % itemsLength].mark) {
            return PositionTypes.middle;
        }
        return PositionTypes.leftEdge;
    }
    if (items[(index + itemsLength - 1) % itemsLength].mark) {
        return PositionTypes.rightEdge;
    }
    return PositionTypes.single;
};

export const MonthItem = ({ id, positionType }) => {
    // the plus one in order to prevent 'off by one' bug
    return <Item backgroundType={positionType}>{id + 1}</Item>;
};

export const MonthsItems = ({ items }) => (
    <MonthsItemsContainer>{items.map(MonthItem)}</MonthsItemsContainer>
);

const createTrendingMonthsArray = (item, index, trendingMonths) => ({
    mark: trendingMonths.includes(index + 1),
    id: index,
});

const createEnrichedTrendingMonthsArray = (item, index, items) => ({
    ...item,
    positionType: getPositionType(item, index, items),
});

const isMarkFilter = (month) => month.mark;

const createMonthsTooltipText = (trendingArray) => {
    const tooltipTextArray = trendingArray.filter(isMarkFilter).map(createMonthTooltipText);
    const tooltipText = `${i18n(TooltipPrefixKey)} ${tooltipTextArray.join("")}`;
    // remove the last comma if needed
    return tooltipText.endsWith(TooltipItemsSeparator)
        ? tooltipText.slice(0, -1 * TooltipItemsSeparator.length)
        : tooltipText;
};

const createTooltipContent = (enrichedTrendingArray) => () => (
    <TooltipContainer
        dangerouslySetInnerHTML={{ __html: createMonthsTooltipText(enrichedTrendingArray) }}
    />
);

const createMonthTooltipText = (item, index, items) => {
    const { positionType, id } = item;
    if (positionType === PositionTypes.middle) {
        return;
    }
    const displayValue = i18n(MonthsKeysArray[id]);
    if (positionType === PositionTypes.single) {
        return `<b>${displayValue}</b>${TooltipItemsSeparator}`;
    }
    if (positionType === PositionTypes.leftEdge) {
        let rangeRightEdgeIndex = index;
        const itemsLength = items.length;
        while (items[rangeRightEdgeIndex].positionType !== PositionTypes.rightEdge) {
            rangeRightEdgeIndex = (rangeRightEdgeIndex + itemsLength + 1) % itemsLength;
        }
        return `<b>${displayValue}${TooltipRangeSeparator}${i18n(
            MonthsKeysArray[items[rangeRightEdgeIndex].id],
        )}</b>${TooltipItemsSeparator}`;
    }
};

export const SeasonalityCell = (props) => {
    const { row } = props;
    const { trendingMonths } = row;
    const trendingArray = Array.from(Array(MonthsAmount)).map((item, index) =>
        createTrendingMonthsArray(item, index, trendingMonths),
    );
    const enrichedTrendingArray = trendingArray.map(createEnrichedTrendingMonthsArray);
    return (
        <PopupHoverContainer
            config={popupConfig}
            content={createTooltipContent(enrichedTrendingArray)}
        >
            <div>
                <MonthsItems items={enrichedTrendingArray} />
            </div>
        </PopupHoverContainer>
    );
};

const MonthsItemsContainer = styled.div`
    display: flex;
`;

const popupConfig = {
    cssClassContent: "Popup-content--pro",
    placement: "top",
};

const TooltipContainer = styled.div`
    padding: 10px;
    ${setFont({ $size: 12, $color: colorsPalettes.carbon[500] })};
`;

const Item = styled.div<{ backgroundType: PositionTypes; backgroundColor?: string }>`
    height: 20px;
    width: 20px;
    letter-spacing: -1.2px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    font-weight: 700;
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[300] })};
    ${({ backgroundType, backgroundColor = colorsPalettes.blue[200] }) => {
        switch (backgroundType) {
            case PositionTypes.middle:
                return css`
                    background-color: ${backgroundColor};
                `;
                break;
            case PositionTypes.rightEdge:
                return css`
                    background-color: ${backgroundColor};
                    border-radius: 0 10px 10px 0;
                `;
                break;
            case PositionTypes.leftEdge:
                return css`
                    background-color: ${backgroundColor};
                    border-radius: 10px 0 0 10px;
                `;
                break;
            case PositionTypes.single:
                return css`
                    background-color: ${backgroundColor};
                    border-radius: 10px;
                `;
                break;
            case PositionTypes.none:
                return setFont({ $color: colorsPalettes.carbon[100] });
                break;
        }
    }}
`;
