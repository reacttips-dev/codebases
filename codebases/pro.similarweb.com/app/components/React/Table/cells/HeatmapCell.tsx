import { ITableCellProps } from "components/React/Table/interfaces/ITableCellProps";
import { DefaultCell } from "components/Workspace/TableCells/DefaultCell";
import { abbrNumberFilter, percentageFilter } from "filters/ngFilters";
import React, { FunctionComponent, useMemo } from "react";
import styled from "styled-components";

import { colorsPalettes } from "@similarweb/styles";

const BRIGHT_TEXT_PERCENT_THRESHOLD = 80;
const TABLE_DEFAULT_MAX_PERCENT = 100;
const TABLE_DEFAULT_MIN_PERCENT = 0;

const CellContainer = styled(DefaultCell)`
    display: flex;
    justify-content: flex-end;
`;

/**
 * The cell's background color.
 * background opacity is used to set how saturated the cell color is
 * the higher the percentage value of the cell - the more saturated the cell is.
 * this way we create a "heatmap" effect.
 */
const CellBackground = styled.div<{ opacityPercent: number }>`
    position: absolute;
    background-color: ${colorsPalettes.blue[400]};
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: -1;
    opacity: ${({ opacityPercent }) => opacityPercent + "%"};
`;

/**
 * Percentage text should be bright / dark according to the background color opacity. design has decided that
 * text should appear as white when the background opacity is above 80%, and dark otherwise.
 * text should also appear as white when the current row / cell is on focus/hover.
 */
const PercentageText = styled.span<{ isBrightText: boolean }>`
    font-size: 14px;
    color: ${({ isBrightText }) =>
        isBrightText ? colorsPalettes.carbon[0] : colorsPalettes.carbon[500]};
    z-index: 1;

    ${CellContainer}:hover &, .active-row & {
        color: ${colorsPalettes.carbon[500]};
    }
`;

/**
 * We want to set the cells with the highest/lowest percentage values on the table
 * to be the most/least saturated cells. for this reason - we normalize the percentage
 * values to between 0% to 100%. the normalized value will be the background's opacity.
 * for normalization formula, see: https://stats.stackexchange.com/questions/70801/how-to-normalize-data-to-0-1-range
 */
const normalizeCellOpacity = (
    cellValue: number,
    maxValueOnTable: number,
    minValueOnTable: number,
) => {
    const normalizedValue = (cellValue - minValueOnTable) / (maxValueOnTable - minValueOnTable);
    return normalizedValue * 100;
};

export const HeatmapCell: FunctionComponent<ITableCellProps> = ({
    value,
    tableMetadata,
    hideZeroValue,
    replaceZeroValue,
    CellValueFormat = "percentagesign",
}) => {
    const hasValue = typeof value !== "undefined" && value && value !== 0;
    const shouldHideValue = hideZeroValue && !hasValue;
    const maxValueOnTable = tableMetadata.maxCellValue ?? TABLE_DEFAULT_MAX_PERCENT;
    const minValueOnTable = tableMetadata.minCellValue ?? TABLE_DEFAULT_MIN_PERCENT;

    const { backgroundOpacity, shouldUseBrightText } = useMemo(() => {
        const opacityValue = hasValue
            ? normalizeCellOpacity(value, maxValueOnTable, minValueOnTable)
            : 0;

        return {
            backgroundOpacity: opacityValue,
            shouldUseBrightText: opacityValue > BRIGHT_TEXT_PERCENT_THRESHOLD,
        };
    }, [value, maxValueOnTable, minValueOnTable]);

    const displayPercentText = useMemo(() => {
        return shouldHideValue
            ? "N/A"
            : value === 0 && replaceZeroValue
            ? replaceZeroValue
            : CellValueFormat === "absNumber"
            ? abbrNumberFilter()(value)
            : `${percentageFilter()(value / 100, 1)}%`;
    }, [value]);

    return (
        <CellContainer>
            <PercentageText isBrightText={shouldUseBrightText}>{displayPercentText}</PercentageText>

            <CellBackground opacityPercent={backgroundOpacity} />
        </CellContainer>
    );
};
HeatmapCell.displayName = "HeatmapCell";
