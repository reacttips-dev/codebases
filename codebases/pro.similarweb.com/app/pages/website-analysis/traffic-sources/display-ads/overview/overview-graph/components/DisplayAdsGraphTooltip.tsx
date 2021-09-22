import React from "react";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { ChangeValue } from "@similarweb/ui-components/dist/change-value";
import styled from "styled-components";
import { ClosableItemColorMarker } from "components/compare/StyledComponent";
import { changeFilter, i18nFilter } from "filters/ngFilters";
import { getChange } from "pages/website-analysis/incoming-traffic/commonOverTime";
import ReactDOMServer from "react-dom/server";
import { FlexRow, RightFlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { getTooltipHeader } from "UtilitiesAndConstants/UtilitiesComponents/chartTooltipHeaderWithMTDSupport";

const TableCellStyle = styled(RightFlexRow)`
    width: 90px;
    padding: 4px 16px 4px 16px;

    &:nth-child(1) {
        width: 176px;
        justify-content: flex-start;
    }

    &:nth-child(2),
    &:nth-child(3) {
        width: 60px;
        border-right: 1px solid ${colorsPalettes.carbon[50]};
    }

    &:last-child {
        border-right: none;
    }

    .ChangeValue--unsigned {
        float: right;
    }
`;

const TableHeadersStyle = styled(FlexRow)`
    font-size: 12px;
    font-style: normal;
    line-height: 16px;
    font-weight: 400;
    opacity: 0.8;
`;

const TableRowStyle = styled(FlexRow)`
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    letter-spacing: 0.6px;
    line-height: 24px;
`;

const TableCellDomainMarker = styled(ClosableItemColorMarker)<{ background: string }>`
    position: static;
    background-color: ${(p) => p.background};
    margin: 0 8px 0 0;
    flex-shrink: 0;
    width: 10px;
    height: 10px;
`;

const TableCellDomainName = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const TooltipContainer = styled.div`
    padding: 16px 0;
    background-color: ${colorsPalettes.carbon[0]};
    box-shadow: 0 3px 6px 0 ${rgba(colorsPalettes.carbon[200], 0.5)};
    border-radius: 5px;
    margin: 12px 0 8px 0;
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
`;

const Title = styled.span`
    ${mixins.setFont({ $size: 16, color: rgba(colorsPalettes.carbon[500], 0.8) })};
    font-weight: bold;
    margin-left: 16px;
`;

const Dash = styled.div`
    background-color: ${colorsPalettes.carbon[100]};
    width: 20px;
    height: 1px;
`;

const ZeroChangeContainer = styled(RightFlexRow)`
    height: 24px;
    width: 70px;
`;

export const DisplayAdsGraphTooltip = ({
    metricName,
    points,
    rawDataMetricName,
    showChangeColumn,
    timeGranularityName,
    lastSupportedDate,
    yTooltipFormatter,
}) => {
    const i18n = i18nFilter();
    const getHeader = getTooltipHeader(timeGranularityName, points, lastSupportedDate);
    const headersList = showChangeColumn
        ? ["Domain", metricName, i18n("common.tooltip.change")]
        : ["Domain", metricName];
    // sort by x by chronological order
    points.forEach((p) => p.series.data.sort((a, b) => (a.x > b.x ? 1 : -1)));

    const pointsList = points.map((point) => {
        const currentIndex = point.series.data.findIndex((p) => p.category === point.x);
        const prevPointYData = point.series.data[currentIndex - 1]?.y;

        const change = prevPointYData ? getChange(prevPointYData, point.y) : 0;

        return {
            share: point.point.share,
            traffic: point.point.y,
            color: point.series.color,
            name: point.series.name,
            change,
            prevTraffic: prevPointYData || prevPointYData === 0 ? prevPointYData : null,
        };
    });

    const TableHeaders = () => {
        const headerItems = headersList.map((header) => (
            <TableCellStyle key={header}>{header}</TableCellStyle>
        ));
        return <TableHeadersStyle> {headerItems} </TableHeadersStyle>;
    };

    const TableRows = () => {
        return pointsList.map((pointData, index) => (
            <TableRow
                point={pointData}
                key={index}
                rawDataMetricName={rawDataMetricName}
                showChangeColumn={showChangeColumn}
            />
        ));
    };

    const TableRow = ({ point, rawDataMetricName, showChangeColumn }) => {
        const formattedChangeValue = Math.abs(point.change) < 0.0001 ? 0 : point.change;
        const isDecrease = formattedChangeValue < 0;
        let changeValue: string | number =
            formattedChangeValue === 0 ? 0 : changeFilter()(Math.abs(formattedChangeValue), 0);

        if (point.prevTraffic === 0) {
            changeValue = point.traffic === 0 ? 0 : i18n("common.tooltip.change.new");
        }

        return (
            <TableRowStyle>
                <TableCellStyle>
                    <TableCellDomainMarker background={point.color} />
                    <TableCellDomainName>{point.name}</TableCellDomainName>
                </TableCellStyle>
                <TableCellStyle>{yTooltipFormatter(point.traffic)}</TableCellStyle>
                {showChangeColumn && (
                    <TableCellStyle>
                        {changeValue === 0 ? (
                            <ZeroChangeContainer>
                                <Dash />
                            </ZeroChangeContainer>
                        ) : (
                            <ChangeValue
                                descriptionText={""}
                                value={changeValue.toString()}
                                isDecrease={isDecrease}
                                invertColors={rawDataMetricName === "BounceRate"}
                                unsigned={point.prevTraffic === 0 && point.traffic !== 0}
                            />
                        )}
                    </TableCellStyle>
                )}
            </TableRowStyle>
        );
    };

    return ReactDOMServer.renderToString(
        <TooltipContainer>
            <Title>{getHeader}</Title>
            <TableHeaders />
            <TableRows />
        </TooltipContainer>,
    );
};
