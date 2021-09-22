import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { minVisitsAbbrFilter, percentageSignFilter } from "filters/ngFilters";
import _ from "lodash";
import dayjs from "dayjs";
import styled from "styled-components";

const TooltipStyleContainer = styled.div`
    margin: 8px 0 8px 17px;
    color: ${colorsPalettes.carbon[500]};
`;

interface IPoint {
    y: number;
}

const sumPoint = (points: IPoint[]) => _.sumBy(points, (p) => p.y);

export const Table = ({ pointsData }) => {
    const totalVisits = sumPoint(pointsData);
    const monthName = dayjs.utc(pointsData[0].x).format("MMMM YYYY");
    return (
        <TooltipStyleContainer>
            <TooltipTitle>{monthName} Deduplicated Audience</TooltipTitle>
            <TableHeader>
                <DeviceContainer>Device</DeviceContainer>
                <VisitorsContainer>Visitors</VisitorsContainer>
                <ShareContainer>Share</ShareContainer>
            </TableHeader>
            <TableRows pointsList={pointsData} />
            <TableRowStyle>
                <TotalContainer>Total</TotalContainer>
                <TotalVisitorContainer>{minVisitsAbbrFilter()(totalVisits)}</TotalVisitorContainer>
            </TableRowStyle>
        </TooltipStyleContainer>
    );
};
export const CompareTooltip = ({ pointsData, graphData }) => {
    const monthName = dayjs.utc(pointsData[0].x).format("MMMM YYYY");
    return (
        <TooltipStyleContainer>
            <TooltipTitle>{monthName} Deduplicated Audience</TooltipTitle>
            <TableHeader>
                <WebsiteContainer>Domains</WebsiteContainer>
                <CompareTotalContainer>Total Audience</CompareTotalContainer>
                <VisitorsContainer>Desktop</VisitorsContainer>
                <CompareMobileContainer>Mobile web</CompareMobileContainer>
                <CompareDedupContainer>Desktop & Mobile Web</CompareDedupContainer>
            </TableHeader>
            <CompareTableRows pointsData={pointsData} graphData={graphData} />
        </TooltipStyleContainer>
    );
};

const CompareTableRows = ({ pointsData, graphData }) => {
    const RowComponent = (site, index) => (
        <CompareTableRow site={site} points={pointsData} enrichData={graphData[index]} />
    );
    return pointsData.map(RowComponent);
};
const CompareTableRow = ({ site, points, enrichData }) => {
    const date = dayjs.utc(points[0].x).format("YYYY-MM-DD");
    const siteName = site.series.name;
    const total = site.y;
    const displayData = (webSource) =>
        percentageSignFilter()(
            enrichData.metricData[webSource][0].find((i) => i.Key === date).Value / total,
            1,
        );
    return (
        <TableRowStyle>
            <WebsiteContainer>
                <LegendContainer>
                    <StyledTooltiplegend color={site.color} />
                </LegendContainer>
                <div>{siteName} </div>
            </WebsiteContainer>
            <CompareTotalContainer>{minVisitsAbbrFilter()(total)}</CompareTotalContainer>
            <CompareSeparator />
            <VisitorsContainer>{displayData("Desktop")}</VisitorsContainer>
            <CompareSeparator />
            <VisitorsContainer>{displayData("Mobile Web")}</VisitorsContainer>
            <CompareSeparator />
            <VisitorsContainer>{displayData("Dedup")}</VisitorsContainer>
        </TableRowStyle>
    );
};
const TableRows = ({ pointsList }) => {
    const totalVisits = sumPoint(pointsList);
    return pointsList.map((pointData) => (
        <TableRow total={totalVisits} point={pointData} key={pointData.key} />
    ));
};
const TableRow = ({ point, total }) => {
    const deviceName = point.series.name === "Dedup" ? "Desktop & Mobile Web" : point.series.name;
    return (
        <TableRowStyle visible={point.series.visible}>
            <DeviceContainer>
                <LegendContainer>
                    <StyledTooltiplegend color={point.series.color} />
                </LegendContainer>
                <div>{deviceName} </div>
            </DeviceContainer>
            <VisitorsContainer>{minVisitsAbbrFilter()(point.y)}</VisitorsContainer>
            <Separator />
            <ShareContainer>{percentageSignFilter()(point.y / total, 1)}</ShareContainer>
        </TableRowStyle>
    );
};
const Separator = styled.div`
    border: 0.5px solid #e9ebed;
`;
const CompareSeparator = styled(Separator)`
    margin-right: 5px;
`;
export const LegendContainer = styled.div.attrs({
    isVisible: (p) => p.isVisible ?? true,
})`
    display: flex;
    align-items: center;
    :nth-child(n + 2) {
        margin-left: 16px;
    }
    user-select: none;
    cursor: pointer;
    font-size: 14px;
    color: ${colorsPalettes.carbon["500"]};
    opacity: ${(props) => (props.isVisible ? 1 : 0.4)};
`;

const StyledTooltiplegend = styled.div`
    border-radius: 50%;
    background-color: ${(props) => props.color};
    width: 8px;
    height: 8px;
    margin-right: 10px;
`;
export const Styledlegend = styled.div`
    border-radius: 50%;
    background-color: ${(props) => props.color};
    width: 10px;
    height: 10px;
`;

interface ITableRowStyleProps {
    visible?: boolean;
}

const TableRowStyle = styled.div.attrs((props: ITableRowStyleProps) => ({
    visible: props.visible ?? true,
}))`
    font-weight: 400;
    font-size: 14px;
    letter-spacing: 0.6px;
    line-height: 20px;
    display: flex;
    margin-right: 10px;
    opacity: ${(props) => (props.visible ? 1 : 0.4)};
`;
const TooltipTitle = styled.div`
    margin-bottom: 10px;
    line-height: 20px;
    font-size: 14px;
    font-weight: 600;
`;
const TableHeader = styled.div`
    display: flex;
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 8px;
`;
const DeviceContainer = styled.div`
    width: 190px;
    display: flex;
    margin-right: 20px;
    padding-bottom: 10px;
`;
const WebsiteContainer = styled.div`
    width: 190px;
    display: flex;
    padding-bottom: 10px;
`;
const VisitorsContainer = styled.div`
    width: 50px;
    margin-right: 20px;
    text-align: right;
    color: rgba(42, 61, 83, 0.8);
`;
const CompareTotalContainer = styled.div`
    width: 80px;
    margin-right: 2px;
    color: rgba(42, 61, 83, 0.8);
`;
const CompareDedupContainer = styled.div`
    width: 120px;
    margin-right: 2px;
    margin-left: 15px;
    text-align: left;
    color: rgba(42, 61, 83, 0.8);
`;
const CompareMobileContainer = styled.div`
    width: 70px;
    text-align: center;
    margin-right: 2px;
    color: rgba(42, 61, 83, 0.8);
`;
const ShareContainer = styled.div`
    width: 45px;
    text-align: right;
    color: rgba(42, 61, 83, 0.8);
`;
const TotalContainer = styled(DeviceContainer)`
    text-align: right;
    font-weight: 600;
    flex-direction: column;
`;
const TotalVisitorContainer = styled(VisitorsContainer)`
    font-weight: 600;
`;
export const Value = styled.span`
    margin: 0 8px;
`;
export const InfoIcon = styled(SWReactIcons)`
    width: 16px;
    height: 16px;
    line-height: 1.4;
`;
export const tooltipPositionCalc = (context, labelWidth, labelHeight, point) => {
    const horizontalOffset = labelWidth / 2 - 150;
    if (point.plotX + horizontalOffset + 25 > context.chart.plotWidth) {
        const offset = point.plotX + horizontalOffset - context.chart.plotWidth;
        return point.plotX - offset;
    } else {
        return point.plotX + horizontalOffset;
    }
};
export const tooltipPositionSingle = (context, labelWidth, labelHeight, point) => {
    const horizontalOffset = labelWidth / 2;
    if (point.plotX + horizontalOffset > context.chart.plotWidth) {
        const offset = point.plotX + horizontalOffset - context.chart.plotWidth;
        return point.plotX + offset;
    } else {
        return point.plotX + horizontalOffset;
    }
};

export const reorderDedupCompareData = ({ Total }) => {
    return {
        Total,
    };
};
