import { Injector } from "common/ioc/Injector";
import { ETableTabDefaultIndex } from "pages/keyword-analysis/keyword-generator-tool/types";
import { KeywordsIdeas } from "pages/keyword-analysis/KeywordsOverviewPage/Components/KeywordsIdeas";
import {
    KeywordsIdeasTableHeader,
    Link,
    TableHeaderText,
    TableRowContainer,
    Text,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { i18nFilter, swPositionFilter } from "filters/ngFilters";
import React from "react";

const TableRowHeight = "36px";
const KeywordColumnHeaderKey = "keyword.generator.tool.table.column.keyword";
const VolumeColumnHeaderKey = "keyword.generator.tool.table.table.column.volume";
const ColumnHeaderSize = 12;

const TableRow = (row, index, routingParams) => {
    const { keyword, volume } = row;
    const swNavigator = Injector.get<any>("swNavigator");
    const innerLinkPage = "keywordAnalysis_overview";
    const innerLink = swNavigator.href(innerLinkPage, { ...routingParams, keyword });
    return (
        <TableRowContainer key={index} height={TableRowHeight}>
            <Link>
                <a href={innerLink}>{keyword}</a>
            </Link>
            <Text>{swPositionFilter()(volume)}</Text>
        </TableRowContainer>
    );
};

const KeywordsIdeasTable = (props) => {
    const { records, routingParams } = props;
    const i18n = i18nFilter();
    return (
        <>
            <KeywordsIdeasTableHeader height={TableRowHeight}>
                <TableHeaderText fontSize={ColumnHeaderSize}>
                    {i18n(KeywordColumnHeaderKey)}
                </TableHeaderText>
                <TableHeaderText fontSize={ColumnHeaderSize}>
                    {i18n(VolumeColumnHeaderKey)}
                </TableHeaderText>
            </KeywordsIdeasTableHeader>
            {records?.map((record, index) => TableRow(record, index, routingParams))}
        </>
    );
};

const EndPoint = "api/recommendations/keywords/similar/10";
const HeadLineKey = "keyword.analysis.widgets.phrase.match.title";
const headLineTooltipKey = "keyword.analysis.widgets.phrase.match.title.tooltip";
const SubTitleKey = "keyword.analysis.widgets.phrase.match.subtitle";
const InnerLinkPage = "keywordAnalysis-generator";
const SortArguments = { sort: "volume", asc: false, rowsPerPage: 5, page: 1 };
const TableRowsAmount = 5;
const SeeAllKey = "keyword.analysis.overview.ideas.phrase.see.all";
const WebSource = "Desktop";
const ComponentName = "PhraseMatch";
const SelectedTableTab = ETableTabDefaultIndex.PhraseMatch;

const keywordsIdeasTable = (records, routingParams) => (
    <KeywordsIdeasTable records={records} routingParams={routingParams} />
);
const Constants = {
    SortArguments,
    EndPoint,
    TableRowsAmount,
    InnerLinkPage,
    WebSource,
    HeadLineKey,
    headLineTooltipKey,
    SubTitleKey,
    SeeAllKey,
    ComponentName,
    SelectedTableTab,
};

export const PhraseMatch = (props) => {
    const { noDataState, setNoDataState } = props;
    const noDataCallbackUpdate = (isNoDataState) => {
        if (isNoDataState !== noDataState.ideas.phrases) {
            setNoDataState({
                ...noDataState,
                ideas: { phrases: isNoDataState, related: noDataState.ideas.related },
            });
        }
    };
    return (
        <KeywordsIdeas
            {...props}
            constants={Constants}
            keywordsIdeasTable={keywordsIdeasTable}
            noDataCallbackUpdate={noDataCallbackUpdate}
        />
    );
};
