import { colorsPalettes, mixins } from "@similarweb/styles";
import { swSettings } from "common/services/swSettings";
import dayjs from "dayjs";
import { TooltipPartialText } from "pages/website-analysis/TrafficAndEngagement/ChartTooltips/ChartTooltips";
import React from "react";
import { ChangeValue } from "@similarweb/ui-components/dist/change-value";
import styled, { css } from "styled-components";
import { ClosableItemColorMarker } from "components/compare/StyledComponent";
import { i18nFilter } from "filters/ngFilters";
import * as numeral from "numeral";

interface IProps {
    title?: string;
    pointsData: any;
    headersList: string[];
    yFormatter: (arg: any) => any;
    xFormatter?: (arg: any) => any;
    cellWidth?: number;
    changeFormatter?: (arg: any) => any;
    invertColors?: boolean;
}

const TableCellStyle = styled.div<{ isFlex?: boolean; textAlign?: string; cellWidth?: number }>`
    width: ${({ cellWidth }) => (cellWidth ? `${cellWidth}px` : "64px")};
    padding: 4px 16px 4px 16px;
    ${(props) =>
        props.isFlex &&
        css`
            display: flex;
            align-items: center;
        `}

    &:nth-child(1) {
        width: 112px;
    }

    &:nth-child(2),
    &:nth-child(3) {
        text-align: ${({ textAlign }) => textAlign};
        border-right: 1px solid ${colorsPalettes.carbon[50]};
    }

    &:nth-child(4) {
        text-align: ${({ textAlign }) => textAlign};
        width: 88px;
    }

    .ChangeValue {
        display: block;
        line-height: 24px;

        div {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }

    .ChangeValue--unsigned {
        float: right;
    }
`;

const TableHeadersStyle = styled.div<{ marginTop?: number }>`
    display: flex;
    font-size: 12px;
    font-style: normal;
    line-height: 16px;
    font-weight: 400;
    opacity: 0.8;
    margin-top: ${({ marginTop }) => `${marginTop}px`};
`;

const TableRowStyle = styled.div`
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    letter-spacing: 0.6px;
    line-height: 24px;
    display: flex;
`;

const TableCellDomainMarker = styled(ClosableItemColorMarker)<{ background: string }>`
    position: static;
    background-color: ${(p) => p.background};
    margin: 0 8px 0 0;
    flex-shrink: 0;
`;

const TableCellDomainName = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const TooltipStyleContainer = styled.div`
    margin: 8px 0 8px 0;
    color: rgba(42, 62, 82, 0.8);
`;

const Title = styled.span`
    ${mixins.setFont({ $size: 16, color: "rgba(42, 62, 82, 0.8)" })};
    font-weight: bold;
    margin-left: 16px;
`;

const Dash = styled.div`
    background-color: ${colorsPalettes.carbon[100]};
    width: 20px;
    height: 1px;
`;

const ZeroChangeContainer = styled.div`
    display: flex;
    height: 24px;
    align-items: center;
    justify-content: flex-end;
    width: 70px;
`;

export const PoPCompareChangeTooltip = (props: IProps) => {
    const { pointsData, headersList, title, cellWidth } = props;
    const isMTDPartialData = pointsData[0]?.point?.isPartial;

    return (
        <TooltipStyleContainer>
            {title && <Title>{title}</Title>}
            <TableHeaders headers={headersList} title={title} cellWidth={cellWidth} />
            <TableRows pointsList={pointsData} {...props} />
            {isMTDPartialData && (
                <TooltipPartialText>
                    {i18nFilter()("wa.traffic.engagement.over.time.single.pop.partial", {
                        last_supported_day: dayjs(swSettings.current.lastSupportedDailyDate).format(
                            "MMM DD",
                        ),
                        month: headersList[2],
                    })}
                </TooltipPartialText>
            )}
        </TooltipStyleContainer>
    );
};

const TableHeaders = ({ headers, title, cellWidth }) => {
    const headerItems = headers.map((header, index) => (
        <TableCellStyle key={header} cellWidth={cellWidth} textAlign={index !== 0 ? "right" : null}>
            {header}
        </TableCellStyle>
    ));
    return <TableHeadersStyle marginTop={title ? 8 : 0}> {headerItems} </TableHeadersStyle>;
};

const TableRows = (props) => {
    const { pointsList, yFormatter, xFormatter, cellWidth, changeFormatter, invertColors } = props;
    return pointsList.map((pointData) => (
        <TableRow
            point={pointData}
            key={pointData.key}
            yFormatter={yFormatter}
            xFormatter={xFormatter}
            cellWidth={cellWidth}
            changeFormatter={changeFormatter}
            invertColors={invertColors}
        />
    ));
};

const TableRow = (props) => {
    const { point, yFormatter, changeFormatter, cellWidth, invertColors } = props;
    const pointYValue = Math.abs(point.y) < 0.0001 ? 0 : point.y;
    let changeValue =
        pointYValue !== 0
            ? changeFormatter
                ? changeFormatter()(Math.abs(pointYValue))
                : numeral(Math.abs(pointYValue)).format("0[.]00a%").toUpperCase()
            : 0;
    const comparedValue = point.point.values[1].Value;
    const currentValue = point.point.values[0].Value;

    if (comparedValue === 0) {
        changeValue = currentValue === 0 ? 0 : i18nFilter()("common.tooltip.change.new");
    }

    return (
        <TableRowStyle>
            <TableCellStyle isFlex={true}>
                <TableCellDomainMarker background={point.series.color} />
                <TableCellDomainName>{point.series.name} </TableCellDomainName>
            </TableCellStyle>
            <TableCellStyle textAlign={"right"} cellWidth={cellWidth}>
                {yFormatter({ value: comparedValue })}
            </TableCellStyle>
            <TableCellStyle textAlign={"right"} cellWidth={cellWidth}>
                {yFormatter({ value: currentValue })}
            </TableCellStyle>
            <TableCellStyle textAlign={"right"} cellWidth={cellWidth}>
                {changeValue === 0 ? (
                    <ZeroChangeContainer>
                        <Dash />
                    </ZeroChangeContainer>
                ) : (
                    <ChangeValue
                        descriptionText={""}
                        invertColors={invertColors ? invertColors : false}
                        value={changeValue.toString()}
                        isDecrease={point.y < 0}
                        unsigned={comparedValue === 0 && currentValue !== 0}
                    />
                )}
            </TableCellStyle>
        </TableRowStyle>
    );
};
