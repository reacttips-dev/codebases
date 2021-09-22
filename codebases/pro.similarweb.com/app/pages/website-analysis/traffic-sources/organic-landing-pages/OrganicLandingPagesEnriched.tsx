import { Injector } from "common/ioc/Injector";
import { TrafficShare, TrendCell, UrlCellWebsiteAnalysis } from "components/React/Table/cells";
import { i18nFilter } from "filters/ngFilters";
import { connect } from "react-redux";
import * as React from "react";
import { allTrackers } from "services/track/track";
import { IconButton } from "@similarweb/ui-components/dist/button";
import styled from "styled-components";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { DEFAULT_INNER_SORT, innerTableColumns } from "./OrganicLandingPagesColumnsConfig";
import { SWReactTableWrapperWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import { tableActionsCreator } from "actions/tableActions";
import { showSuccessToast } from "actions/toast_actions";
import { getToastItemComponent } from "components/React/Toast/ToastItem";
import { KeywordSelection } from "components/React/TableSelectionComponents/KeywordSelection";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { DownloadExcelContainer } from "pages/workspace/StyledComponent";
import * as queryString from "query-string";

const TopContainer = styled.div`
    display: flex;
    padding: 19px 20px;
    align-items: center;
    justify-content: space-between;
`;
const DataContainer = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 1;
    justify-content: flex-start;
`;

const PageContainer = styled.div`
    height: auto;
    width: 300px;
    border: none;
`;

const HeaderTitle = styled.div`
    margin-bottom: 8px;
`;

const TrafficShareContainer = styled.div`
    width: 170px;
    margin-left: 20px;
    .swTable-progressBar {
        margin-top: -3px;
        margin-bottom: 5px;
    }
`;

const TrendContainer = styled.div`
    width: 100px;
    margin-left: 32px;
`;

export const CloseIconButton = styled(IconButton)`
    margin-left: 8px;
`;

export const IndexContainer = styled.div`
    margin-left: 8px;
`;

export const OrganicLandingPagesEnrichedContainer = styled.div`
    & .css-sticky-header {
        z-index: 1051;
    }
`;
OrganicLandingPagesEnrichedContainer.displayName = "OrganicLandingPagesEnrichedContainer";

const OrganicLandingPagesEnriched = (props) => {
    const swNavigator = Injector.get<any>("swNavigator");
    const pageParams = swNavigator.getParams();
    const {
        pageSize,
        pageNumber,
        row,
        selectedDomain,
        excelAllowed,
        sort = DEFAULT_INNER_SORT,
        asc = false,
    } = props;
    const { Page, PageShare, index, PageTrend } = row;

    const { country, webSource, to, from, isWindow, isWWW } = pageParams;
    const apiParams = {
        country,
        to,
        from,
        isWindow,
        landingPage: row.Page,
        rowsPerPage: 50,
        key: selectedDomain,
        webSource,
        sort,
        asc,
        includeSubDomains: isWWW === "*",
    };

    const serverApi = "/api/websiteOrganicLandingPages/keywords";
    const excelDownloadUrl = `${serverApi}/excel?${queryString.stringify(apiParams)}`;

    const onSort = ({ field, sortDirection }) => {
        swNavigator.applyUpdateParams({
            sort: `${field}`,
            asc: `${sortDirection === "asc"}`,
        });
    };
    const getDataCallback = (data) => {
        return data;
    };
    const transformData = (data) => {
        return data;
    };
    const clickOutsideXButton = (e) => {
        allTrackers.trackEvent("Open", "Click", "Traffic Over Time/Collapsed");
        document.body.click();
    };

    const changePageCallback = (page) => {
        TrackWithGuidService.trackWithGuid("organic.landing.inner.table.pagination", "switch", {
            page: page,
        });
    };
    const trackExcelDownload = () => {
        TrackWithGuidService.trackWithGuid(
            "organic.landing.pages.inner.table.excel.download",
            "click",
        );
    };

    return (
        <OrganicLandingPagesEnrichedContainer>
            <TopContainer>
                <DataContainer>
                    <IndexContainer>{pageNumber * pageSize + index + 1}</IndexContainer>
                    <PageContainer className={"swReactTableCell"}>
                        <UrlCellWebsiteAnalysis {...props.row} value={Page} row={props.row} />
                    </PageContainer>
                    <TrafficShareContainer>
                        <HeaderTitle>
                            {i18nFilter()("organic.landing.pages.enriched.share.title")}
                        </HeaderTitle>
                        <TrafficShare {...props.row} value={PageShare} row={props.row} />
                    </TrafficShareContainer>
                    <TrendContainer>
                        <HeaderTitle>
                            {i18nFilter()("organic.landing.pages.enriched.trend.title")}
                        </HeaderTitle>
                        <TrendCell
                            value={PageTrend}
                            row={props.row}
                            config={{ chart: { height: 20 } }}
                        />
                    </TrendContainer>
                </DataContainer>
                <DownloadExcelContainer href={excelDownloadUrl}>
                    <DownloadButtonMenu
                        Excel={true}
                        downloadUrl={excelDownloadUrl}
                        exportFunction={trackExcelDownload}
                        excelLocked={!excelAllowed}
                    />
                </DownloadExcelContainer>
                <CloseIconButton
                    type="flat"
                    onClick={clickOutsideXButton}
                    iconName="clear"
                    placement="left"
                />
            </TopContainer>
            <SWReactTableWrapperWithSelection
                tableSelectionKey="OrganicPagesKeywords_Table"
                tableSelectionProperty="SearchTerm"
                transformData={transformData}
                initialFilters={apiParams}
                serverApi={"/api/websiteOrganicLandingPages/keywords"}
                tableColumns={innerTableColumns.getColumns(pageParams)}
                tableOptions={{
                    noDataI18n: "organic.landing.pages.inner.table.nodata",
                    longLoader: {
                        title: i18nFilter()("organic.landing.pages.inner.table.loader.title"),
                        subtitle: i18nFilter()("organic.landing.pages.inner.table.loader.subtitle"),
                    },
                    aboveHeaderComponents: [
                        <KeywordSelection
                            key="tableSelection"
                            appendTo=".swReactTable-header-wrapper"
                            clearAllSelectedRows={props.clearAllSelectedRows}
                            notify={true}
                            selectedRows={props.selectedRows}
                            showToast={props.showToast}
                        />,
                    ],
                    metric: "OrganicPagesKeywords_Table",
                }}
                recordsField="Data"
                totalRecordsField="ResultCount"
                onSort={onSort}
                getDataCallback={getDataCallback}
                changePageCallback={changePageCallback}
                fetchServerPages={5}
                rowsPerPage={10}
                pageIndent={0}
            />
        </OrganicLandingPagesEnrichedContainer>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        clearAllSelectedRows: () => {
            dispatch(
                tableActionsCreator(
                    "OrganicPagesKeywords_Table",
                    "SearchTerm",
                ).clearAllSelectedRows(),
            );
        },
        showToast: (href, text, label) => {
            dispatch(
                showSuccessToast(
                    getToastItemComponent({
                        text,
                        linkText: label,
                        href,
                        onClick: allTrackers.trackEvent.bind(
                            allTrackers,
                            "add to keyword group",
                            "click",
                            "internal link/keywordAnalysis.overview",
                        ),
                    }),
                ),
            );
        },
    };
};

const mapStateToProps = ({ routing, tableSelection }) => {
    const { params } = routing;
    return {
        params,
        selectedRows: tableSelection["OrganicPagesKeywords_Table"],
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(OrganicLandingPagesEnriched);
