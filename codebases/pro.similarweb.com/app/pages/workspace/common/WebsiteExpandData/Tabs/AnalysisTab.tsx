import { SWReactCountryIcons, SWReactIcons } from "@similarweb/icons";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import { swSettings } from "common/services/swSettings";
import {
    categoryIconFilter,
    i18nCategoryFilter,
    i18nFilter,
    parentCategoryFilter,
    percentageFilter,
} from "filters/ngFilters";
import _ from "lodash";
import dayjs, { Dayjs } from "dayjs";
import numeral from "numeral";
import React, { useContext } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
    BoxContainer,
    TitleContainer,
} from "../../../../../../.pro-features/pages/app performance/src/page/single/usage section/styledComponents";
import { SidebarGraph } from "../../../../../../.pro-features/pages/workspace/common components/SidebarGraph/SidebarGraph";
import { SidebarGraphWrapper } from "../../../../../../.pro-features/pages/workspace/common components/SidebarGraph/StyledComponents";
import { WorkspaceContext } from "../../../../../../.pro-features/pages/workspace/common components/WorkspaceContext";
import { PrimaryBoxTitle } from "../../../../../../.pro-features/styled components/StyledBoxTitle/src/StyledBoxTitle";
import { FlexRow } from "../../../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import { Injector } from "../../../../../../scripts/common/ioc/Injector";
import { commonWebSources } from "../../../../../components/filters-bar/utils";
import { CircularLoader } from "../../../../../components/React/CircularLoader";
import I18n from "../../../../../components/React/Filters/I18n";
import { CountryCell } from "../../../../../components/React/Table/cells";
import { allTrackers } from "../../../../../services/track/track";
import { ICommonWorkspaceState } from "../../reducers/common_workspace_reducer";
import { selectActiveOpportunityList } from "../../selectors";
import {
    AnalysisTileWrapper,
    circularLoaderOptions,
    LoadingGraphs,
    RankItemContent,
    RankItemHeader,
    RankItemTitle,
    RankItemWrapper,
    RanksWrapper,
    TabWrapper,
} from "./StyledComponents";
import CountryService from "services/CountryService";

const graphsMetrics = [
    "Visits",
    "TopGeo",
    "UniqueUsers",
    "BounceRate",
    "DirectVisits",
    "SearchVisits",
];
const topGeosColumns = [
    {
        field: "Country",
        displayName: "Top 10 Countries",
        type: "string",
        format: "None",
        sortable: false,
        isSorted: false,
        sortDirection: "desc",
        groupable: false,
        cellComponent: CountryCell,
        headTemp: "",
        totalCount: true,
        tooltip: false,
        minWidth: 230,
        ppt: {
            // override the table column format when rendered in ppt
            overrideFormat: "Country",
        },
    },
    {
        field: "Share",
        displayName: "Traffic Share",
        type: "string",
        format: "percentagesign",
        sortable: false,
        isSorted: false,
        isLink: true,
        sortDirection: "desc",
        groupable: false,
        headTemp: "",
        totalCount: false,
        tooltip: false,
        width: "",
    },
];
export const TopGeoContainer = styled.div`
    ${BoxContainer} {
        height: auto;
    }
    .MiniFlexTable {
        padding: 0;
    }
    .MiniFlexTable-container .MiniFlexTable-column .MiniFlexTable-cell {
        padding: 0;
        height: 40px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        &:nth-last-child(n + 2) {
            border-bottom: 1px solid #edf2f7;
        }
    }
    .MiniFlexTable-container .MiniFlexTable-column:first-child {
        .MiniFlexTable-cell {
            padding-left: 23px;
        }
        .MiniFlexTable-headerCell {
            padding-left: 20px;
        }
    }
    .MiniFlexTable-container .MiniFlexTable-column:last-child {
        .MiniFlexTable-cell {
            justify-content: flex-end;
            padding-right: 32px;
        }
        .MiniFlexTable-headerCell {
            justify-content: flex-end;
            padding-right: 18px;
        }
    }
    .MiniFlexTable-headerCell {
        border-top: 1px solid #edf2f7;
        border-bottom: 1px solid #edf2f7;
        height: 32px;
        display: flex;
        box-sizing: border-box;
        align-items: center;
        color: #a1aab3;
    }
`;

export const TopGeoSubtitle = styled.div`
    display: flex;
    align-items: center;
    color: rgba(42, 62, 82, 0.6);
    font-size: 12px;
    margin: 4px 0 16px 0;
`;
export const Icon = styled(SWReactIcons)`
    display: flex;
    margin-right: 4px;
`;
export const WebSource = styled(FlexRow)`
    align-items: center;
    margin-left: 8px;
`;
const TopGeo: React.FunctionComponent<any> = ({ data }: any) => {
    const { lastSnapshotDate } = useContext(WorkspaceContext);
    const { desktop } = commonWebSources;
    const { icon, text } = desktop();
    const countries = data.map((item) => {
        const { Share } = item;
        return {
            Share: `${percentageFilter()("" + Share, 2)}%`,
            Country: item.Country,
        };
    });
    return (
        <TopGeoContainer>
            <SidebarGraphWrapper data-automation="sidebar-table">
                <BoxContainer>
                    <TitleContainer>
                        <PrimaryBoxTitle
                            tooltip={i18nFilter()("workspace.analysis_sidebar.table.geo.tooltip")}
                        >
                            {i18nFilter()("workspace.analysis_sidebar.table.geo.title")}
                        </PrimaryBoxTitle>
                        <TopGeoSubtitle>
                            <span>{dayjs.utc(lastSnapshotDate).format("MMMM YYYY")}</span>
                            <WebSource alignItems="center">
                                <Icon iconName={icon} size={"xs"} />
                                <span>{text}</span>
                            </WebSource>
                        </TopGeoSubtitle>
                    </TitleContainer>
                    <MiniFlexTable
                        className="MiniFlexTable MiniFlexTable--swProTheme"
                        data={countries}
                        columns={topGeosColumns}
                        metadata={{}}
                    />
                </BoxContainer>
            </SidebarGraphWrapper>
        </TopGeoContainer>
    );
};

interface IRankItem {
    iconName: string;
    title: string;
    value: string;
    country?: boolean;
}

const RankItem = ({ iconName, title, value, country }: IRankItem) => (
    <RankItemWrapper>
        <RankItemHeader>
            {iconName ? (
                country ? (
                    <SWReactCountryIcons countryCode={parseInt(iconName, 10)} size="xs" />
                ) : (
                    <SWReactIcons iconName={iconName} size="xs" />
                )
            ) : null}
            {title.length > 15 ? (
                <PopupHoverContainer
                    content={() => <span>{title}</span>}
                    config={{
                        placement: "top",
                        width: 160,
                        cssClassContainer:
                            "Popup-element-wrapper-triangle sidebar-analysis-tab-popup-triangle",
                    }}
                >
                    <RankItemTitle>{title}</RankItemTitle>
                </PopupHoverContainer>
            ) : (
                <RankItemTitle>{title}</RankItemTitle>
            )}
        </RankItemHeader>
        <RankItemContent>{`${
            _.isNumber(value) && value > 0 ? `#${numeral(value).format("0,0")}` : "NA"
        }`}</RankItemContent>
    </RankItemWrapper>
);

const Ranks = ({ GlobalRank, Country, CountryRank, Category, CategoryRank }) => {
    let countryIcon = "";
    let countryText = i18nFilter()(`workspace.analysis_sidebar.country_rank`);
    if (Country) {
        const country = CountryService.getCountryById(Country);
        countryIcon = country.id;
        countryText = country.text;
    }
    let categoryIcon = "";
    let categoryText = i18nFilter()(`workspace.analysis_sidebar.category_rank`);
    if (Category) {
        categoryIcon = categoryIconFilter()(parentCategoryFilter()(Category)).replace(/_/g, "-");
        categoryText = i18nCategoryFilter()(Category);
    }
    return (
        <RanksWrapper data-automation="sidebar-ranks">
            <BoxContainer>
                <RankItem
                    iconName="global-rank"
                    title={i18nFilter()(`workspace.analysis_sidebar.global_rank`)}
                    value={GlobalRank && GlobalRank.Value}
                />
                <RankItem
                    iconName={countryIcon}
                    title={countryText}
                    value={CountryRank && CountryRank.Value}
                    country={true}
                />
                <RankItem
                    iconName={categoryIcon}
                    title={categoryText}
                    value={CategoryRank && CategoryRank.Value}
                />
            </BoxContainer>
        </RanksWrapper>
    );
};

const Graphs = React.memo(({ data }: { data: any }) => {
    return (
        <>
            {graphsMetrics.map((metric) => {
                switch (metric) {
                    case "TopGeo":
                        return !!data.TopGeo && <TopGeo data={data.TopGeo} key={metric} />;
                    default:
                        return (
                            <SidebarGraph
                                key={metric}
                                tab={metric}
                                title={i18nFilter()(
                                    `workspace.analysis_sidebar.graph.${metric.toLowerCase()}.title`,
                                )}
                                tooltip={i18nFilter()(
                                    `workspace.analysis_sidebar.graph.${metric.toLowerCase()}.tooltip`,
                                )}
                                data={data[metric]}
                            />
                        );
                }
            })}
        </>
    );
});
Graphs.displayName = "Graph";

interface IAnalysisTabProps {
    getExcelTableRowHref: (params) => string;
    graphsData: any;
    domain: string;
    isEnrichedDataLoading: boolean;
    lastSnapshotDate: Dayjs;
    activeListId: string;
    activeWorkspaceId: string;
    country: number;
    ranksData: any;
    isRanksDataLoading: boolean;
}

const AnalysisTabContent = React.memo((props: IAnalysisTabProps) => {
    const {
        getExcelTableRowHref,
        graphsData,
        domain,
        country,
        isEnrichedDataLoading,
        lastSnapshotDate,
        activeListId,
        activeWorkspaceId,
        isRanksDataLoading,
        ranksData,
    } = props;

    const isExcelAllowed = swSettings.components.Home.resources.IsExcelAllowed;

    const getExcelParams = () => {
        const to = lastSnapshotDate.format("YYYY|MM|DD");
        const from = lastSnapshotDate.clone().subtract(24, "months").format("YYYY|MM|DD");
        return {
            opportunityListId: activeListId,
            workspaceId: activeWorkspaceId,
            country,
            domain,
            from,
            to,
        };
    };

    const onClickDownloadExcel = () => {
        allTrackers.trackEvent(
            "Expanded Side bar/Download",
            "submit-ok",
            `${domain}/Download Excel`,
        );
    };

    const getWebsiteAnalysisHref = () => {
        const swNavigator = Injector.get("swNavigator") as any;
        return swNavigator.href("websites-worldwideOverview", {
            key: domain,
            country,
            duration: "3m",
            isWWW: "*",
            webSource: "Total",
        });
    };

    const onClickWebsiteAnalysis = () => {
        allTrackers.trackEvent(
            "Expanded Side bar/Internal Link",
            "click",
            `${domain}/website analysis`,
        );
    };

    return (
        <TabWrapper>
            <AnalysisTileWrapper>
                <a
                    href={getWebsiteAnalysisHref()}
                    onClick={onClickWebsiteAnalysis}
                    data-automation="website-analysis-tile"
                    target="_blank"
                    rel="noreferrer"
                >
                    <IconButton type="flat" iconName="arrow-right" placement="right">
                        <I18n>workspace.analysis_sidebar.button.website_analysis</I18n>
                    </IconButton>
                </a>
                {isExcelAllowed && (
                    <a
                        href={getExcelTableRowHref(getExcelParams())}
                        onClick={onClickDownloadExcel}
                        data-automation="excel-tile"
                    >
                        <IconButton type="flat" iconName="excel" />
                    </a>
                )}
            </AnalysisTileWrapper>
            {isEnrichedDataLoading || isRanksDataLoading ? (
                <LoadingGraphs>
                    <CircularLoader options={circularLoaderOptions} />
                </LoadingGraphs>
            ) : (
                <>
                    <Ranks {...ranksData} />
                    <Graphs data={graphsData} />
                </>
            )}
        </TabWrapper>
    );
});
AnalysisTabContent.displayName = "AnalysisTabContent";

const mapStateToProps = ({ commonWorkspace }: { commonWorkspace: ICommonWorkspaceState }) => {
    const activeOpportunitiesList = selectActiveOpportunityList(commonWorkspace);
    return {
        isEnrichedDataLoading: commonWorkspace.isEnrichedDataLoading,
        lastSnapshotDate: commonWorkspace.lastSnapshotDate,
        activeListId: commonWorkspace.activeListId,
        activeWorkspaceId: commonWorkspace.activeWorkspaceId,
        graphsData: _.get(commonWorkspace, "selectedDomain.enrichedData.metrics", {}),
        isRanksDataLoading: commonWorkspace.isRanksDataLoading,
        ranksData: _.get(commonWorkspace, "selectedDomain.ranksData", {}),
        domain: _.get(commonWorkspace, "selectedDomain.domain", ""),
        country: activeOpportunitiesList ? activeOpportunitiesList.country : 0,
    };
};

export const AnalysisTab = connect(mapStateToProps)(AnalysisTabContent);
