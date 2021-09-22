import { Injector } from "common/ioc/Injector";
import SWReactTableWrapper from "components/React/Table/SWReactTableWrapper";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { FunctionComponent, useState } from "react";
import { connect } from "react-redux";
import { allTrackers } from "services/track/track";
import OrganicLandingPagesEnriched from "./OrganicLandingPagesEnriched";
import { OrganicLandingPagesTableTopBar } from "pages/website-analysis/traffic-sources/organic-landing-pages/OrganicLandingPagesTableTopBar";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import {
    DEFAULT_SORT,
    tableColumns,
} from "pages/website-analysis/traffic-sources/organic-landing-pages/OrganicLandingPagesColumnsConfig";
import styled from "styled-components";
import { swSettings } from "common/services/swSettings";
import { colorsPalettes, mixins } from "@similarweb/styles";
import {
    StyledEnrichButtonText,
    StyledEnrichButton,
} from "../../../website-analysis/traffic-sources/organic-landing-pages/StyledComponents";

export const OrganicLandingPagesContainer = styled.div`
    & .css-sticky-header {
        z-index: 1051;
    }
`;
OrganicLandingPagesContainer.displayName = "OrganicLandingPagesContainer";

const TableWrapper = styled.div`
    .active-row {
        ${StyledEnrichButton}:not(.enrich--disabled) {
            background: ${colorsPalettes.carbon[0]};
            border: 1px solid ${colorsPalettes.carbon[100]};
            > .SWReactIcons > svg > path {
                fill: ${colorsPalettes.blue[400]};
            }
            ${StyledEnrichButtonText} {
                color: ${colorsPalettes.blue[400]};
            }
        }
    }
`;

export const OrganicLandingPages: FunctionComponent<any> = (props) => {
    const i18n = i18nFilter();
    const {
        params: {
            country,
            IncludeTrendingPages,
            IncludeNewPages,
            selectedDomain,
            webSource,
            isWWW,
            sort = DEFAULT_SORT,
            asc = false,
        },
        chosenItems,
    } = props;
    const chosenSites = Injector.get<any>("chosenSites");

    const domains = chosenSites.sitelistForLegend();
    const swNavigator = Injector.get<any>("swNavigator");
    const isCompare = chosenSites.isCompare();
    const showDomainSelector = isCompare;
    const pageSize = 100;
    const pageParams = swNavigator.getParams();
    const [pageNumber, setPageNumber] = useState(0);

    const changePageCallback = (page) => {
        TrackWithGuidService.trackWithGuid("organic.landing.pages.table.pagination", "switch", {
            page: page,
        });
        setPageNumber(page);
    };
    const { to, from, isWindow } = swNavigator.getApiParams();
    const apiParams = {
        country,
        to,
        from,
        isWindow,
        webSource,
        key: selectedDomain || domains[0].name,
        IncludeTrendingPages,
        IncludeNewPages,
        sort,
        asc,
    };
    const filterParams = { IncludeTrendingPages, IncludeNewPages };

    const serverApi = "/api/websiteOrganicLandingPages";
    const excelUrl = `${serverApi}/excel`;

    const onSort = ({ field, sortDirection }) => {
        swNavigator.applyUpdateParams({
            sort: `${field}`,
            asc: `${sortDirection === "asc"}`,
        });
    };

    const onSelectDomain = (domain) => {
        TrackWithGuidService.trackWithGuid("organic.landing.pages.filters.domain", "click", {
            domain: domain,
        });
        swNavigator.applyUpdateParams({
            selectedDomain: domain.text || null,
        });
    };

    const searchString = pageParams.filter || "";
    const excelAllowed = swSettings.current.resources.IsExcelAllowed;

    return (
        <OrganicLandingPagesContainer>
            <TableWrapper>
                <SWReactTableWrapper
                    initialFilters={{
                        ...apiParams,
                        ...filterParams,
                        includeSubDomains: isWWW === "*",
                    }}
                    tableOptions={{
                        longLoader: {
                            title: i18nFilter()("organic.landing.pages.table.loader.title"),
                            subtitle: i18nFilter()("organic.landing.pages.table.loader.subtitle"),
                        },
                        noDataI18n: "organic.landing.pages.table.nodata",
                        get EnrichedRowComponent() {
                            return (props) => (
                                <OrganicLandingPagesEnriched
                                    {...props}
                                    selectedDomain={apiParams.key}
                                    pageSize={pageSize}
                                    pageNumber={pageNumber}
                                    excelAllowed={excelAllowed}
                                />
                            );
                        },
                        get enrichedRowComponentAppendTo() {
                            return ".organic-landing-pages-table";
                        },
                        onEnrichedRowClick: () => {},
                        get enrichedRowComponentHeight() {
                            return 580;
                        },
                        shouldApplyEnrichedRowHeightToCell: false,
                        shouldEnrichRow: (props, index, e) => {
                            const openEnrich = e?.currentTarget?.classList?.contains("enrich");
                            if (openEnrich) {
                                allTrackers.trackEvent(
                                    "Open",
                                    "Click",
                                    "Organic Landing Pages/Expand",
                                );
                            }
                            return openEnrich;
                        },

                        customTableClass: "organic-landing-pages-table",
                    }}
                    serverApi={serverApi}
                    tableColumns={tableColumns.getColumns(pageParams)}
                    recordsField="Data"
                    totalRecordsField="ResultCount"
                    onSort={onSort}
                    changePageCallback={changePageCallback}
                    fetchServerPages={3}
                    rowsPerPage={100}
                    pageIndent={0}
                >
                    {(topComponentProps) => (
                        <OrganicLandingPagesTableTopBar
                            {...topComponentProps}
                            i18n={i18n}
                            showDomainSelector={showDomainSelector}
                            onSelectDomain={onSelectDomain}
                            selectedDomain={selectedDomain}
                            domains={domains}
                            search={searchString}
                            excelDownloadUrl={excelUrl}
                            excelAllowed={excelAllowed}
                            chosenItems={chosenItems}
                        />
                    )}
                </SWReactTableWrapper>
            </TableWrapper>
        </OrganicLandingPagesContainer>
    );
};
const mapStateToProps = ({ routing: { params, chosenItems } }) => {
    return {
        params,
        chosenItems,
    };
};

const connected = connect(mapStateToProps)(OrganicLandingPages);

export default SWReactRootComponent(connected, "OrganicLandingPages");
