import { colorsPalettes } from "@similarweb/styles";
import { Injector } from "common/ioc/Injector";
import { CoreWebsiteCell } from "components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import {
    CompetitorsTableRowContainer,
    CoreWebsiteCellContainer,
    DomainContainer,
    FlexWithSpace,
    PositionContainer,
    TableHeaderText,
    Text,
    TrafficShareContainer,
    TrendCellContainer,
    WideCoreWebsiteCellContainer,
    WideDomainContainer,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { TrendCell } from "components/React/Table/cells";
import { i18nFilter, percentageFilter } from "filters/ngFilters";
import React from "react";
import { connect } from "react-redux";

const DomainColumnHeaderKey = "analysis.competitors.search.organic.table.columns.domain.title";
const TrafficShareColumnHeaderKey =
    "analysis.competitors.search.organic.table.columns.traffic.share.title";
const PositionColumnHeaderKey = "analysis.competitors.search.organic.table.columns.position.title";
const ColumnHeaderSize = 12;
const FractionLength = 2;
const InnerLinkPage = "websites-worldwideOverview";
const TextAndIconMargin = "8px";

const TrafficShare = (props) => {
    const { shareOvertime, totalShare } = props;
    const gradientParams = {
        stop1Color: colorsPalettes.blue[100],
        stop2Color: colorsPalettes.blue[100],
        fillColor: colorsPalettes.blue[400],
    };
    const isZeroShare = totalShare === 0;
    return (
        <TrafficShareContainer>
            <Text>
                {isZeroShare ? "N/A" : percentageFilter()(totalShare, FractionLength) + "%"}
            </Text>
            {!isZeroShare && (
                <TrendCellContainer>
                    <TrendCell
                        value={shareOvertime}
                        row={{ filed: undefined }}
                        params={gradientParams}
                    />
                </TrendCellContainer>
            )}
        </TrafficShareContainer>
    );
};

const Position = ({ value }) => {
    return (
        <PositionContainer>
            <Text>{value}</Text>
        </PositionContainer>
    );
};

const TableRowWithPosition = (row, index, routingParams) => {
    const { Domain: domain, Favicon: favicon, Url: url, Position: position } = row;
    const swNavigator = Injector.get<any>("swNavigator");
    const innerLink = swNavigator.href(InnerLinkPage, { ...routingParams, key: domain });
    return (
        <CompetitorsTableRowContainer key={index}>
            <WideCoreWebsiteCellContainer style={{ width: "70%" }}>
                <CoreWebsiteCell
                    icon={favicon}
                    domain={domain}
                    externalLink={url}
                    internalLink={innerLink}
                    textAndIconMargin={TextAndIconMargin}
                    className="hide-external-link"
                />
            </WideCoreWebsiteCellContainer>
            <Position value={position} />
        </CompetitorsTableRowContainer>
    );
};

const TableRowWithTrafficShare = (row, index, routingParams) => {
    const {
        Domain: domain,
        Favicon: favicon,
        Share: totalShare,
        Url: url,
        trafficShareOvertime,
    } = row;
    const shareOvertime = trafficShareOvertime[0].map(({ Key, Value }) => ({
        Key,
        Value: Value.RelativeShare,
    }));
    const swNavigator = Injector.get<any>("swNavigator");
    const innerLink = swNavigator.href(InnerLinkPage, { ...routingParams, key: domain });
    return (
        <CompetitorsTableRowContainer key={index}>
            <CoreWebsiteCellContainer>
                <CoreWebsiteCell
                    icon={favicon}
                    domain={domain}
                    externalLink={url}
                    internalLink={innerLink}
                    textAndIconMargin={TextAndIconMargin}
                    className="hide-external-link"
                />
            </CoreWebsiteCellContainer>
            <TrafficShare totalShare={totalShare} shareOvertime={shareOvertime} />
        </CompetitorsTableRowContainer>
    );
};

const CompetitorsTableInner = (props) => {
    const i18n = i18nFilter();
    const { competitorsData, params: routingParams } = props;
    const totalShareAllRowsSum = competitorsData.reduce(
        (sum, { Share: totalShare }) => sum + (totalShare ? totalShare : 0),
        0,
    );
    // in the case of all rows have no traffic share we should display position instead
    const shouldDisplayPosition = totalShareAllRowsSum === 0;
    return (
        <div>
            <FlexWithSpace>
                {shouldDisplayPosition ? (
                    <>
                        <WideDomainContainer>
                            <TableHeaderText fontSize={ColumnHeaderSize}>
                                {i18n(DomainColumnHeaderKey)}
                            </TableHeaderText>
                        </WideDomainContainer>
                        <PositionContainer>
                            <TableHeaderText fontSize={ColumnHeaderSize}>
                                {i18n(PositionColumnHeaderKey)}
                            </TableHeaderText>
                        </PositionContainer>
                    </>
                ) : (
                    <>
                        <DomainContainer>
                            <TableHeaderText fontSize={ColumnHeaderSize}>
                                {i18n(DomainColumnHeaderKey)}
                            </TableHeaderText>
                        </DomainContainer>
                        <TrafficShareContainer>
                            <TableHeaderText fontSize={ColumnHeaderSize}>
                                {i18n(TrafficShareColumnHeaderKey)}
                            </TableHeaderText>
                        </TrafficShareContainer>
                    </>
                )}
            </FlexWithSpace>
            {competitorsData.map((row, index) => {
                return shouldDisplayPosition
                    ? TableRowWithPosition(row, index, routingParams)
                    : TableRowWithTrafficShare(row, index, routingParams);
            })}
        </div>
    );
};

const mapStateToProps = ({ routing: { params } }) => ({ params });

export const CompetitorsTable = connect(mapStateToProps)(CompetitorsTableInner);
