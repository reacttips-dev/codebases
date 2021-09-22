import { Injector } from "common/ioc/Injector";
import { KeywordsIdeas } from "pages/keyword-analysis/KeywordsOverviewPage/Components/KeywordsIdeas";
import {
    AlignEndContainer,
    KeywordsIdeasTableHeader,
    Link,
    RelatedKeywordsRow,
    RelevancyScoreContainer,
    ScoreContainer,
    TableHeaderText,
    TableHeaderVolumeText,
    TableRowContainer,
    VolumeText,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { RelevancyScore } from "components/RelevancyScore/src/RelevancyScore";
import { i18nFilter, swPositionFilter } from "filters/ngFilters";
import { ETableTabDefaultIndex } from "pages/keyword-analysis/keyword-generator-tool/types";
import React from "react";

const TableRowHeight = "36px";
const KeywordColumnHeaderKey = "keyword.generator.tool.table.column.keyword";
const VolumeColumnHeaderKey = "keyword.generator.tool.table.table.column.volume";
const ScoreColumnHeaderKey = "keyword.generator.tool.table.column.score";
const MaxScoreBullets = 5;
const ColumnHeaderSize = 12;

const TableRow = (row, index, routingParams, maxScore) => {
    const { keyword, volume, score } = row;
    const swNavigator = Injector.get<any>("swNavigator");
    const innerLinkPage = "keywordAnalysis_overview";
    const innerLink = swNavigator.href(innerLinkPage, { ...routingParams, keyword });
    return (
        <TableRowContainer key={index} height={TableRowHeight}>
            <RelatedKeywordsRow>
                <Link>
                    <a href={innerLink}>{keyword}</a>
                </Link>
                <ScoreContainer>
                    <RelevancyScoreContainer>
                        <RelevancyScore
                            maxBullets={MaxScoreBullets}
                            bullets={Math.sqrt(Math.min(1, score / maxScore)) * MaxScoreBullets}
                        />
                    </RelevancyScoreContainer>
                </ScoreContainer>
                <AlignEndContainer>
                    <VolumeText>{swPositionFilter()(volume)}</VolumeText>
                </AlignEndContainer>
            </RelatedKeywordsRow>
        </TableRowContainer>
    );
};

const KeywordsIdeasTable = (props) => {
    const { records, routingParams, maxScore } = props;
    const i18n = i18nFilter();
    return (
        <>
            <KeywordsIdeasTableHeader height={TableRowHeight}>
                <RelatedKeywordsRow>
                    <TableHeaderText fontSize={ColumnHeaderSize}>
                        {i18n(KeywordColumnHeaderKey)}
                    </TableHeaderText>
                    <TableHeaderText fontSize={ColumnHeaderSize}>
                        {i18n(ScoreColumnHeaderKey)}
                    </TableHeaderText>
                    <AlignEndContainer>
                        <TableHeaderVolumeText fontSize={ColumnHeaderSize}>
                            {i18n(VolumeColumnHeaderKey)}
                        </TableHeaderVolumeText>
                    </AlignEndContainer>
                </RelatedKeywordsRow>
            </KeywordsIdeasTableHeader>
            {records?.map((record, index) => TableRow(record, index, routingParams, maxScore))}
        </>
    );
};

const EndPoint = "api/recommendations/keywords/related/10";
const HeadLineKey = "keyword.analysis.widgets.related.keywords.title";
const headLineTooltipKey = "keyword.analysis.widgets.related.keywords.title.tooltip";
const SubTitleKey = "keyword.analysis.widgets.related.keywords.subtitle";
const InnerLinkPage = "keywordAnalysis-generator";
const SortArguments = { sort: "score", asc: false, rowsPerPage: 5, page: 1 };
const TableRowsAmount = 5;
const SeeAllKey = "keyword.analysis.overview.ideas.related.keywords.see.all";
const WebSource = "Desktop";
const ComponentName = "RelatedKeywords";
const SelectedTableTab = ETableTabDefaultIndex.relatedKeywords;
const keywordsIdeasTable = (records, routingParams, maxScore) => (
    <KeywordsIdeasTable records={records} routingParams={routingParams} maxScore={maxScore} />
);
const Constants = {
    SortArguments,
    EndPoint,
    TableRowsAmount,
    InnerLinkPage,
    WebSource,
    SelectedTableTab,
    HeadLineKey,
    headLineTooltipKey,
    SubTitleKey,
    SeeAllKey,
    ComponentName,
};

export const RelatedKeywords = (props) => {
    const { noDataState, setNoDataState } = props;
    const noDataCallbackUpdate = (isNoDataState) => {
        if (isNoDataState !== noDataState.ideas.phrases) {
            setNoDataState({
                ...noDataState,
                ideas: { related: isNoDataState, phrases: noDataState.ideas.phrases },
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
