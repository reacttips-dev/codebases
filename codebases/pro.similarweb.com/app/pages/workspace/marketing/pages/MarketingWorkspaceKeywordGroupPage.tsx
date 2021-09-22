import { colorsPalettes } from "@similarweb/styles";
import { SwLog } from "@similarweb/sw-log";
import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import { swSettings } from "common/services/swSettings";
import * as utils from "components/filters-bar/utils";
import _ from "lodash";
import dayjs from "dayjs";
import {
    ESubdomainsType,
    MarketingWorkspaceFilters,
} from "pages/workspace/marketing/shared/MarketingWorkspaceFilters";
import * as PropTypes from "prop-types";
import * as queryString from "query-string";
import * as React from "react";
import CountryService, { ICountryObject } from "services/CountryService";
import DurationService from "services/DurationService";
import { BenchmarkToArena } from "../../../../../.pro-features/components/Workspace/BenchmarkToArena/src/BenchmarkToArena";
import { BenchmarkToArenaItem } from "../../../../../.pro-features/components/Workspace/BenchmarkToArena/src/BenchmarkToArenaItem";
import { FlexColumn } from "../../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import { Injector } from "../../../../../scripts/common/ioc/Injector";
import {
    marketingWorkspaceSetAllParams,
    marketingWorkspaceSetCountry,
    marketingWorkspaceSetDuration,
    marketingWorkspaceSetFilters,
    marketingWorkspaceSetIsWWW,
    marketingWorkspaceSetKeywordsType,
    marketingWorkspaceSetSites,
    marketingWorkspaceSetWebsource,
    marketingWorkspaceSetSelectedWorkspace,
    updateSelectedWorkspaceKeywordGroup,
    setSelectedWorkspaceKeywordGroups,
} from "../../../../actions/marketingWorkspaceActions";
import { preparePresets } from "../../../../components/dashboard/widget-wizard/components/DashboardWizardDuration";
import { NavigatorConnectHOC } from "../../../../components/navigatorHOC/navigatorConnectHOC";
import SWReactTableWrapper from "../../../../components/React/Table/SWReactTableWrapper";
import { CHART_COLORS } from "../../../../constants/ChartColors";
import SWReactRootComponent from "../../../../decorators/SWReactRootComponent";
import {
    abbrNumberFilter,
    i18nFilter,
    smallNumbersPercentageFilter,
    CPCFilter,
} from "../../../../filters/ngFilters";
import { DefaultFetchService, NoCacheHeaders } from "../../../../services/fetchService";
import { IArena } from "../../../../services/marketingWorkspaceApiService";
import { marketingWorkspaceGo } from "../MarketingWorkspaceCtrl";
import { MarketingWorkspaceDrillDownEllipsis } from "../shared/MarketingWorkspaceDrillDownEllipsis";
import MarketingWorkspaceTableTopBar from "../shared/MarketingWorkspaceTableTopBar";
import {
    BenchmarkToArenaLegendStyled,
    MarketingWorkspaceGroupPageContainer,
    MarketingWorkspaceOverviewPageHeaderPart,
    MarketingWorkspacePageHeaderContainer,
    MarketingWorkspacePageTitle,
    MarketingWorkspacePageTitleContainer,
    ScrollContainer,
} from "../shared/styledComponents";
import { MarketingWorkspaceKeywordsGroupTableSettings } from "../tableConfig/MarketingWorkspaceKeywordsGroupTableSettings";
import { RightBar } from "pages/workspace/common components/RightBar/src/RightBar";
import {
    RecommendationsSidebarTopSection,
    RecommendationsSidebarHeader,
    RecommendationsSidebarTitleWrapper,
    RecommendationsSidebarTitle,
    RecommendationsSidebarInfo,
    RecommendationsSidebarSubtitle,
    Separator,
    RecommendationsSidebarContentWrapperKeywords,
    RecommendationKeywordTilesContainer,
    RecommendationsEmptyStateImageAndText,
    RecommendationsSidebarEmptyStateBoldTitle,
    RecommendationsSidebarEmptyStateTitle,
    RecommendationsSidebarEmptyStateWrapper,
    RecommendationsSidebarEmptyStateWrapperKeywords,
} from "pages/workspace/common components/RecommendationsSidebar/StyledComponents";
import { RecommendationKeywordTile } from "pages/workspace/common components/RecommendationsSidebar/RecommendationKeywordTile";
import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip/src/PlainTooltip";
import { Pill } from "components/Pill/Pill";
import { RecommendationsEmptyState } from "pages/workspace/common components/RecommendationsSidebar/RecommendationsEmptyState";
import { KeywordGroupEditorHelpers } from "pages/keyword-analysis/KeywordGroupEditorHelpers";
import { showSuccessToast } from "actions/toast_actions";
import { CircularLoader } from "components/React/CircularLoader";
import I18n from "components/React/Filters/I18n";
import { KeywordGroupsShareModal } from "./KeywordGroupShareModal";
import styled from "styled-components";
import { SharingService } from "sharing/SharingService";

import "../marketingWorkspace.scss";
import { KeywordsGroupEditorModal } from "pages/keyword-analysis/KeywordsGroupEditorModal";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

const i18n = i18nFilter();

export enum EMarketingWorkspaceKeywordGroupPageMode {
    PAID = "paid",
    ORGANIC = "organic",
}

const OptionButtonsContainer = styled.div`
    display: flex;
    align-items: center;

    button {
        margin-left: 8px;
    }
`;

class MarketingWorkspaceKeywordGroupPage extends React.PureComponent<any, any> {
    public static contextTypes = {
        translate: PropTypes.func,
        track: PropTypes.func,
    };
    public static defaultProps = {
        duration: "3m",
        websource: "Desktop",
        arenas: [],
        keywordsType: "both",
    };
    private maxKeywordsInGroup = KeywordGroupEditorHelpers.getMaxGroupCount();
    private readonly swSettings = swSettings;
    private readonly swNavigator = Injector.get<any>("swNavigator");
    private readonly fetchService = DefaultFetchService.getInstance();
    private scrollContainerRef = React.createRef<HTMLDivElement>();
    private cpcFilter = CPCFilter();
    private abbrNumberFilter = abbrNumberFilter();

    constructor(props, context) {
        super(props, context);
        this.state = {
            mode:
                props.keywordsType === "paid"
                    ? EMarketingWorkspaceKeywordGroupPageMode.PAID
                    : EMarketingWorkspaceKeywordGroupPageMode.ORGANIC,
            validArenas: [],
            sortedColumn: {
                sort: MarketingWorkspaceKeywordsGroupTableSettings.defaultSortField,
                asc: MarketingWorkspaceKeywordsGroupTableSettings.defaultSortDirection === "asc",
            },
            scroll: false,
            isRecommendationOpen: false,
            isRecommendationLoading: true,
            isSavingAllRecommendations: false,
            isSavingOneRecommendation: {},
            recommendations: [],
        };
    }

    public componentDidUpdate(prevProps: Readonly<any>) {
        if (!this.props.sites) {
            const propsHasChanged =
                this.propHasChanged("duration", prevProps.duration) ||
                this.propHasChanged("sites", prevProps.sites) ||
                this.propHasChanged("websource", prevProps.websource) ||
                this.propHasChanged("keywordsType", prevProps.keywordsType);
            if (propsHasChanged) {
                this.setAvailableArenas();
                if (!this.props.isKeywordGroupSharedWithMe) {
                    this.getRecommendations();
                }
            }
        }
    }

    public async componentDidMount() {
        if (this.scrollContainerRef) {
            this.scrollContainerRef.current.addEventListener("scroll", this.onScroll, {
                capture: true,
            });
        }
        const { users } = await SharingService.getAccountUsers();
        this.setState({ users });
    }

    public componentWillUnmount() {
        if (this.scrollContainerRef) {
            this.scrollContainerRef.current.removeEventListener("scroll", this.onScroll, {
                capture: true,
            });
        }
    }

    public render() {
        const { country, sites, keywordGroup, keywordsType, websource, isWWW } = this.props;
        const benchmarkToArena = sites && sites.length > 0;
        const { from, to, isWindow } = this.getDurationForApi();
        const filters: any = {
            country,
            from,
            to,
            isWindow,
            sort: MarketingWorkspaceKeywordsGroupTableSettings.defaultSortField,
            asc: MarketingWorkspaceKeywordsGroupTableSettings.defaultSortDirection === "asc",
            rowsPerPage: 100,
            keywordsType,
            websource,
            groupHash: keywordGroup.groupHash,
            includeSubDomains: isWWW === "*",
        };
        if (benchmarkToArena) {
            filters.sites = sites.join(",");
        }
        const minDate = this.swSettings.current.startDate;
        const maxDate = this.swSettings.current.endDate;
        const durationSelectorPresets = this.swSettings.current.datePickerPresets;
        const endpoint = `/api/workspaces/marketing/keywords/groups/${keywordGroup.id}${
            benchmarkToArena ? `/benchmark` : ``
        }/table`;
        const availableWebSources = this.getWebsources();
        const selectedWebSource = availableWebSources.find((w) => w.id === websource);
        const countryObject: ICountryObject = CountryService.getCountryById(country);

        return (
            <>
                <MarketingWorkspaceGroupPageContainer>
                    <FlexColumn style={{ height: "100%" }}>
                        <MarketingWorkspacePageHeaderContainer isScroll={this.state.isScroll}>
                            <MarketingWorkspaceOverviewPageHeaderPart>
                                <MarketingWorkspacePageTitleContainer>
                                    <MarketingWorkspacePageTitle>
                                        {this.state.scroll && benchmarkToArena && (
                                            <BenchmarkToArenaLegendStyled
                                                margin={false}
                                                inline={false}
                                                sites={this.getSitesForLegend()}
                                                onClose={this.clearSelectedArena}
                                            />
                                        )}
                                        {(!benchmarkToArena || !this.state.scroll) &&
                                            this.props.title}
                                    </MarketingWorkspacePageTitle>
                                    {!benchmarkToArena && (
                                        <BenchmarkToArena
                                            loading={this.state.validArenasLoading}
                                            arenas={this.getArenas()}
                                        />
                                    )}
                                </MarketingWorkspacePageTitleContainer>
                            </MarketingWorkspaceOverviewPageHeaderPart>
                            <MarketingWorkspaceOverviewPageHeaderPart className="react-filters-container">
                                <MarketingWorkspaceFilters
                                    selectedCountryId={countryObject.id}
                                    selectedCountryText={countryObject.text}
                                    availableCountries={this.getAvailableCountries()}
                                    onCountryChange={this.onChangeCountry}
                                    onDurationChange={this.onDurationChange}
                                    maxDate={maxDate}
                                    minDate={minDate}
                                    durationSelectorPresets={preparePresets(
                                        durationSelectorPresets,
                                    )}
                                    duration={this.props.duration}
                                    componentId={this.swSettings.current.componentId}
                                    availableWebSources={availableWebSources}
                                    selectedWebSource={selectedWebSource}
                                    onWebSourceChange={this.onWebSourceChange}
                                    showKeywordsTypeFilter={true}
                                    onKeywordsTypeChange={this.onKeywordsTypeChange}
                                    selectedKeywordsType={keywordsType}
                                    showIncludeSubdomainsFilter={benchmarkToArena}
                                    isIncludeSubdomains={isWWW === "*"}
                                    onSubDomainsFilterChange={this.onSubDomainsFilterChange}
                                />
                            </MarketingWorkspaceOverviewPageHeaderPart>
                        </MarketingWorkspacePageHeaderContainer>
                        <ScrollContainer ref={this.scrollContainerRef as any}>
                            {sites && (
                                <BenchmarkToArenaLegendStyled
                                    sites={this.getSitesForLegend()}
                                    onClose={this.clearSelectedArena}
                                    margin={true}
                                    inline={true}
                                />
                            )}
                            <SWReactTableWrapper
                                key={keywordGroup.groupHash}
                                serverApi={endpoint}
                                tableOptions={{
                                    metric: "MarketingWorkspaceKeywordsGroupTable",
                                }}
                                tableColumns={MarketingWorkspaceKeywordsGroupTableSettings.getColumns(
                                    {
                                        field: filters.sort,
                                        sortDirection:
                                            MarketingWorkspaceKeywordsGroupTableSettings.defaultSortDirection,
                                    },
                                    benchmarkToArena,
                                    filters.isWindow,
                                )}
                                initialFilters={filters}
                                transformData={this.transformData}
                                onSort={this.onSort}
                            >
                                {(topComponentProps) => (
                                    <MarketingWorkspaceTableTopBar
                                        searchPlaceholder="workspaces.marketing.search.placeholder"
                                        permissionsComponent={"KeywordAnalysis"}
                                        researchMore={this.getResearchMore()}
                                        options={this.getOptions()}
                                        {...topComponentProps}
                                        totalTrafficTitle="workspaces.marketing.keywordgroup.totaltraffic.title"
                                        tooltipTitle={"workspaces.marketing.totalvisits.tooltip"}
                                        onClickRecommended={
                                            this.props.isKeywordGroupSharedWithMe
                                                ? null
                                                : this.onClickRecommended
                                        }
                                        onClickShare={this.onClickShare}
                                        isRecommendationLoading={this.state.isRecommendationLoading}
                                        recommendationNumber={this.state.recommendations.length}
                                        isKeywordGroupSharedWithMe={
                                            this.props.isKeywordGroupSharedWithMe
                                        }
                                        keywordGroup={this.props.keywordGroup}
                                    />
                                )}
                            </SWReactTableWrapper>
                        </ScrollContainer>
                        <div className="marketing-workspace-table-fixed-container">
                            {this.getResearchMore()}
                        </div>
                        <RightBar
                            primary={() => (
                                <>
                                    <RecommendationsSidebarTopSection>
                                        <RecommendationsSidebarHeader>
                                            <RecommendationsSidebarTitleWrapper>
                                                <RecommendationsSidebarTitle>
                                                    {i18n(
                                                        "workspace.marketing.keywordgroup.recommendation_sidebar.title",
                                                    )}
                                                </RecommendationsSidebarTitle>
                                                <PlainTooltip
                                                    tooltipContent={i18n(
                                                        "workspace.marketing.keywordgroup.recommendation_sidebar.title.tooltip",
                                                    )}
                                                >
                                                    <RecommendationsSidebarInfo>
                                                        <SWReactIcons iconName="info" size="xs" />
                                                    </RecommendationsSidebarInfo>
                                                </PlainTooltip>
                                                <Pill text={"BETA"} />
                                            </RecommendationsSidebarTitleWrapper>
                                        </RecommendationsSidebarHeader>
                                        <RecommendationsSidebarSubtitle>
                                            <I18n
                                                dangerouslySetInnerHTML={true}
                                                dataObj={{
                                                    link:
                                                        "https://support.similarweb.com/hc/en-us/articles/360011016598#keyword-recommendations",
                                                }}
                                            >
                                                workspace.marketing.keywordgroup.recommendation_sidebar.subtitle
                                            </I18n>
                                        </RecommendationsSidebarSubtitle>
                                    </RecommendationsSidebarTopSection>
                                    <Separator />
                                    <RecommendationsSidebarContentWrapperKeywords>
                                        {this.state.isRecommendationLoading ? (
                                            <RecommendationsSidebarEmptyStateWrapper>
                                                <CircularLoader
                                                    options={{
                                                        svg: {
                                                            stroke: "#dedede",
                                                            strokeWidth: "4",
                                                            r: 21,
                                                            cx: "50%",
                                                            cy: "50%",
                                                        },
                                                        style: {
                                                            width: 46,
                                                            height: 46,
                                                        },
                                                    }}
                                                />
                                                <RecommendationsSidebarEmptyStateTitle>
                                                    {i18n(
                                                        "workspace.marketing.keywordgroup.recommendation_sidebar.loading_state",
                                                    )}
                                                </RecommendationsSidebarEmptyStateTitle>
                                            </RecommendationsSidebarEmptyStateWrapper>
                                        ) : this.state.recommendations.length > 0 ? (
                                            <>
                                                <Button
                                                    type={
                                                        this.state.isSavingAllRecommendations
                                                            ? "primary"
                                                            : "flat"
                                                    }
                                                    isLoading={
                                                        this.state.isSavingAllRecommendations
                                                    }
                                                    isDisabled={
                                                        this.state.isSavingAllRecommendations
                                                    }
                                                    onClick={this.onAddKeywordClick(
                                                        this.state.recommendations.map(
                                                            (x) => x.keyword,
                                                        ),
                                                    )}
                                                >
                                                    {this.state.isSavingAllRecommendations
                                                        ? i18n(
                                                              "workspace.marketing.keywordgroup.recommendation_sidebar.addall.adding.button",
                                                          )
                                                        : i18n(
                                                              "workspace.marketing.keywordgroup.recommendation_sidebar.addall.button",
                                                              {
                                                                  keywords: this.state
                                                                      .recommendations.length,
                                                              },
                                                          )}
                                                </Button>

                                                <RecommendationKeywordTilesContainer>
                                                    {this.state.recommendations.map(
                                                        (recommendation, index) => (
                                                            <RecommendationKeywordTile
                                                                key={recommendation.keyword}
                                                                keyword={recommendation.keyword}
                                                                volume={recommendation.volume}
                                                                cpc={recommendation.cpc}
                                                                isLoading={
                                                                    this.state
                                                                        .isSavingOneRecommendation[
                                                                        index
                                                                    ]
                                                                }
                                                                link={this.generateKeywordLink(
                                                                    recommendation.keyword,
                                                                )}
                                                                onClick={this.onAddKeywordClick(
                                                                    [recommendation.keyword],
                                                                    index,
                                                                )}
                                                            />
                                                        ),
                                                    )}
                                                </RecommendationKeywordTilesContainer>
                                            </>
                                        ) : (
                                            <RecommendationsSidebarEmptyStateWrapperKeywords>
                                                <RecommendationsEmptyStateImageAndText>
                                                    {RecommendationsEmptyState}
                                                    <RecommendationsSidebarEmptyStateBoldTitle>
                                                        {i18n(
                                                            "workspace.marketing.keywordgroup.recommendation_sidebar.empty_state.title",
                                                        )}
                                                    </RecommendationsSidebarEmptyStateBoldTitle>
                                                    <RecommendationsSidebarEmptyStateTitle>
                                                        {i18n(
                                                            "workspace.marketing.keywordgroup.recommendation_sidebar.empty_state",
                                                        )}
                                                    </RecommendationsSidebarEmptyStateTitle>
                                                </RecommendationsEmptyStateImageAndText>
                                            </RecommendationsSidebarEmptyStateWrapperKeywords>
                                        )}
                                    </RecommendationsSidebarContentWrapperKeywords>
                                </>
                            )}
                            onCloseSidebar={this.onClickRecommended}
                            isOpen={this.state.isRecommendationOpen}
                            isPrimaryOpen={this.state.isRecommendationOpen}
                            isTableLoading={false}
                        />
                    </FlexColumn>
                </MarketingWorkspaceGroupPageContainer>
                {this.state.showKeywordGroupShareModal && (
                    <KeywordGroupsShareModal
                        isOpen={true}
                        keywordGroup={this.props.keywordGroup}
                        onCloseClick={this.onCloseShareModal}
                        onFinish={this.onFinishSharing}
                        users={this.state.users}
                    />
                )}
                <KeywordsGroupEditorModal
                    onClose={() => this.setState({ isOpen: false })}
                    open={this.state.isOpen}
                    keywordsGroup={this.state.keywordGroupToEdit}
                    hideViewGroupLink
                    onSave={this.onSaveKeywordGroup}
                    onDelete={this.navigateAfterDelete}
                />
            </>
        );
    }

    private getRecommendations = async () => {
        await this.setStateAsync({ isRecommendationLoading: true, recommendations: [] });
        const { id, groupHash } = this.props.keywordGroup;
        const { websource, country, isWWW } = this.props;
        const { from, to, isWindow } = this.getDurationForApi();
        const params = {
            country,
            from,
            to,
            isWindow,
            websource,
            groupHash,
            includeSubDomains: isWWW === "*",
        };
        const endpoint = `/api/workspaces/marketing/keywords/groups/${id}/recommendations`;
        try {
            const recommendations: any[] = await this.fetchService.get(endpoint, params, {
                headers: NoCacheHeaders,
            });
            this.setState({
                recommendations: recommendations.map((recommendation) => ({
                    keyword: recommendation.keyword,
                    cpc: this.cpcFilter(recommendation.cpc),
                    volume:
                        recommendation.volume === 0
                            ? "-"
                            : this.abbrNumberFilter(recommendation.volume),
                })),
                isRecommendationLoading: false,
            });
        } catch (e) {
            SwLog.log(`Failed to get recommendations for groupId ${id}:`, e);
        }
    };

    private generateKeywordLink = (keyword) => {
        const { country, isWWW, duration } = this.props;
        return this.swNavigator.getStateUrl(`keywordAnalysis-organic`, {
            isWWW,
            country,
            duration,
            keyword,
        });
    };

    private manageSavingRecommendationState = async (keywords, state, index?) => {
        if (keywords.length === 1) {
            await this.setStateAsync({
                isSavingOneRecommendation: {
                    ...this.state.isSavingOneRecommendation,
                    [index]: state,
                },
            });
        } else {
            await this.setStateAsync({
                isSavingAllRecommendations: false,
                isSavingOneRecommendation: {},
                recommendations: [],
            });
        }
    };

    private onAddKeywordClick = (keywords, index?) => async () => {
        const { track } = this.context;
        const eventValue =
            keywords.length > 1
                ? `add all recommendations/${keywords.length}`
                : `add recommendation/${keywords[0]}`;
        track("Recommendation modal", "Click", eventValue);
        await this.manageSavingRecommendationState(keywords, true, index);
        const currentGroup = keywordsGroupsService.findGroupById(this.props.keywordGroup.id);
        const currentKeywords: Array<{ text: string }> = currentGroup.Keywords.map((keyword) => {
            return { text: keyword };
        });
        const newKeywords = keywords.map((keyword) => {
            return { text: keyword };
        });
        //This line is for the case when somehow original keyword group with duplicates ¯\_(ツ)_/¯
        const withoutDuplicationsCurrent = _.uniqWith(
            currentKeywords,
            (crr, other) => crr.text === other.text,
        );

        const withoutDuplications = _.uniqWith(
            [...withoutDuplicationsCurrent, ...newKeywords],
            (crr, other) => crr.text === other.text,
        );
        const newKeywordsCount = withoutDuplications.length - withoutDuplicationsCurrent.length;
        // if no new keywords was added
        if (newKeywordsCount === 0) {
            this.props.showToast(
                i18n("workspace.marketing.keywordgroup.recommendation_sidebar.keyword.exists"),
            );
            await this.manageSavingRecommendationState(keywords, false, index);
        } else {
            // new keywords added
            const group = KeywordGroupEditorHelpers.keywordGroupFromList(
                {
                    title: currentGroup.Name,
                    items: withoutDuplications,
                },
                currentGroup,
            );
            if (group.Keywords.length > this.maxKeywordsInGroup) {
                this.props.showToast(
                    i18n(
                        "workspace.marketing.keywordgroup.recommendation_sidebar.keyword.limit.reached",
                    ),
                );
                await this.manageSavingRecommendationState(keywords, false, index);
            } else {
                const result = await keywordsGroupsService.update(group);
                const recommendations = [...this.state.recommendations];
                recommendations.splice(index, 1);
                await this.setStateAsync({ recommendations });
                if (result) {
                    // Two following lines are for the backend refresh each time added. Right now backend takes time, so managing on the client side.
                    // this.getRecommendations();
                    // await this.setStateAsync({isSavingAllRecommendations: false, isSavingOneRecommendation: {}})
                    await this.manageSavingRecommendationState(keywords, false, index);
                    this.props.showToast(
                        keywords.length === 1
                            ? i18n(
                                  "workspace.marketing.keywordgroup.recommendation_sidebar.keyword.added",
                                  { keyword: keywords[0] },
                              )
                            : i18n(
                                  "workspace.marketing.keywordgroup.recommendation_sidebar.keywords.added",
                                  { numOfKeywords: newKeywordsCount },
                              ),
                    );
                    const keywordGroups = [...this.props.selectedWorkspace.keywordGroups];
                    const indexOfTheCurrentGroup = keywordGroups.findIndex(
                        (x) => x.id === this.props.keywordGroup.id,
                    );
                    keywordGroups[indexOfTheCurrentGroup].keywords = withoutDuplications;
                    this.props.setWorkspace({ ...this.props.selectedWorkspace, keywordGroups });
                }
            }
        }
    };

    private onClickRecommended = () => {
        const { track } = this.context;
        track("Recommendation modal", "open", `sidebar/${this.props.keywordGroup.name}`);
        this.setState({ isRecommendationOpen: !this.state.isRecommendationOpen });
    };

    private onClickShare = () => {
        this.setState({
            showKeywordGroupShareModal: true,
        });
    };

    private onCloseShareModal = () => {
        this.setState({
            showKeywordGroupShareModal: false,
        });
    };

    private onFinishSharing = (group) => {
        const groupId = group?.KeywordGroupId || this.props.keywordGroup.id;

        function camelCase(str) {
            return str
                .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
                    return index == 0 ? word.toLowerCase() : word.toUpperCase();
                })
                .replace(/\s+/g, "");
        }

        const keywordGroup = keywordsGroupsService.findGroupById(groupId);
        // set the updated groups in the store
        this.props.updateKeywordGroup(
            Object.fromEntries(
                Object.entries(keywordGroup).map(([key, value]) => {
                    return [camelCase(key), value];
                }),
            ),
        );
        this.setState({
            showKeywordGroupShareModal: false,
        });
    };

    private onScroll = (e) => {
        const scrollTop = (e.target as HTMLDivElement).scrollTop;
        this.setState({
            scroll: scrollTop >= 40,
        });
    };

    private onSort = ({ field, sortDirection }) => {
        this.setState({
            sortedColumn: {
                sort: field,
                asc: sortDirection === "asc",
            },
        });
    };

    private propHasChanged = (propName, propValue) => {
        return this.props[propName] !== propValue;
    };

    private onKeywordsTypeChange = (item) => {
        switch (item.id) {
            case "organic":
                this.setState({ mode: EMarketingWorkspaceKeywordGroupPageMode.ORGANIC });
                break;
            case "paid":
                this.setState({ mode: EMarketingWorkspaceKeywordGroupPageMode.PAID });
                break;
            case "both":
                this.setState({ mode: EMarketingWorkspaceKeywordGroupPageMode.ORGANIC });
                break;
        }
        this.props.setKeywordsType(item.id);
    };

    private getSitesForLegend = () => {
        return this.props.sites.map((site, index) => ({
            domain: site,
            color: CHART_COLORS.main[index],
        }));
    };

    private getArenas = () => {
        const arenas = this.state.validArenas.map(({ id: arenaId }, index) => {
            const arena = _.find<IArena>(this.props.arenas, (arena) => arena.id === arenaId);
            const countryObj = CountryService.getCountryById(arena.country);
            return (
                <BenchmarkToArenaItem
                    key={`arena-${index}`}
                    country={countryObj}
                    title={arena.friendlyName}
                    competitorsIcons={arena.competitors.map((competitor) => competitor.favicon)}
                    mainDomain={arena.allies[0]}
                    onClick={this.onArenaClick(arena)}
                />
            );
        });
        if (arenas.length === 0) {
            return null;
        }
        return arenas;
    };

    /**
     * Set available arenas of the current group
     * by calling to the overview endpoint for each arena
     * and check if there is data for that arena.
     * Show only arenas that have data
     */
    private setAvailableArenas = async () => {
        await this.setStateAsync({
            validArenas: [],
            validArenasLoading: true,
        });
        const keywordGroupId = this.props.keywordGroup.id;
        const { websource, keywordsType } = this.props;
        const { from, to, isWindow } = this.getDurationForApi();
        const params = {
            from,
            to,
            isWindow,
            websource,
            keywordsType,
        };
        const endpoint = `api/workspaces/marketing/keywords/groups/${keywordGroupId}/benchmark/overview`;

        // remove null or undefined values from the params object
        Object.entries(params).forEach(([paramKey, ParamValue]) => {
            if (!ParamValue) {
                delete params[paramKey];
            }
        });

        let counter = 0;
        // loop over arenas, calling the endpoint and add the arena as *valid* arena to the component's state
        this.props.arenas.forEach(async (arena: IArena) => {
            const competitors = arena.competitors.map((competitor) => competitor.domain);
            const main = arena.allies.map((allie) => allie.domain);
            const finalParams = {
                ...params,
                country: arena.country,
                sites: [...main, ...competitors].join(","),
            };
            try {
                const { visits } = await this.fetchService.get<{ visits: number }>(
                    endpoint,
                    finalParams,
                    {
                        headers: NoCacheHeaders,
                    },
                );
                counter++;
                if (visits || counter >= this.props.arenas.length - 1) {
                    this.setState({ validArenasLoading: false });
                }
                // treat 0 visits as no data
                if (!visits) {
                    throw new Error("no data");
                }
                const validArenas = this.state.validArenas;
                const arenaObj = { id: arena.id, visits };
                this.setState({
                    validArenas: [...validArenas, arenaObj].sort((a, b) =>
                        a.visits > b.visits ? -1 : 1,
                    ),
                });
            } catch (e) {
                SwLog.log(`arena ${arena.id} doesn't have data: `, e);
            }
        });
    };

    private clearSelectedArena = () => {
        const { track } = this.context;
        track("Clear Filter", "Click", "BENCHMARK AGAINST YOUR ARENA");
        this.props.setSites(null);
        this.props.setIsWW(null);
    };

    private onArenaClick = (arena) => () => {
        const { track } = this.context;
        track("Pop Up", "Click", `BENCHMARK AGAINST YOUR ARENA/${arena.friendlyName}`);
        const sites = [
            arena.allies[0].domain,
            ...arena.competitors.map((competitor) => competitor.domain),
        ];
        this.props.setSites(sites);
        this.props.setCountry(arena.country);
        this.props.setIsWWW("*");
    };

    private getDurationForApi = () => {
        const { from, to, isWindow } = DurationService.getDurationData(
            this.props.duration,
            "",
            "KeywordAnalysis",
        ).forAPI;
        return { from, to, isWindow };
    };

    private getWebsources = (selectedDuration?) => {
        const duration = selectedDuration ? selectedDuration : this.props.duration;
        const { country } = this.props;
        return utils.getAvailableWebSource(
            { name: "websites-trafficSearch-keywords" },
            { duration, country },
        );
    };

    private getAvailableCountries = () => {
        return utils.getCountries();
    };

    private onWebSourceChange = (websource) => {
        this.props.setWebsource(websource.id);
        if (websource.id === "MobileWeb") {
            this.props.setKeywordsType("organic");
        }
    };

    private onDurationChange = (duration) => {
        const availableWebsources = this.getWebsources(duration);
        if (availableWebsources.length === 1) {
            this.props.setWebsource(availableWebsources[0].id);
        }
        this.props.setDuration(duration);
    };

    private onChangeCountry = (country) => {
        this.props.setCountry(country.id);
    };

    private getResearchMore = () => {
        const type =
            this.props.keywordsType === EMarketingWorkspaceKeywordGroupPageMode.PAID
                ? "ppc"
                : "seo";
        return (
            <PlainTooltip
                placement="top"
                tooltipContent={i18n(`workspaces.${type}.more.all.competitors.tooltip`)}
            >
                <span>
                    <Button
                        type="flat"
                        label={i18n(`workspaces.${type}.more.all.competitors`)}
                        onClick={this.onAllCompetitorsClick}
                    />
                </span>
            </PlainTooltip>
        );
    };

    private getShareButton = () => {
        const { sharedWithAccounts, sharedWithUsers } = this.props.keywordGroup;
        const isGroupShared = sharedWithAccounts.length > 0 || sharedWithUsers.length > 0;
        // do not render anything unless we have the acocunt users
        if (!this.state.users) {
            return null;
        }
        if (isGroupShared) {
            const text = SharingService.getShareTooltip({
                sharedWithAccounts,
                sharedWithUsers,
                users: this.state.users,
            });
            let icon = "users";
            if (sharedWithAccounts.length > 0) {
                icon = "company";
            }
            return (
                <PlainTooltip tooltipContent={text} placement="bottom">
                    <span>
                        <IconButton
                            type="outlined"
                            onClick={this.onClickShare}
                            iconName={icon}
                            iconSize="xs"
                        >
                            {i18n("workspaces.marketing.header.shared")}
                        </IconButton>
                    </span>
                </PlainTooltip>
            );
        } else {
            return (
                <IconButton
                    type="outlined"
                    onClick={this.onClickShare}
                    iconName="employees"
                    iconSize="xs"
                >
                    {i18n("workspaces.marketing.header.share")}
                </IconButton>
            );
        }
    };

    private getOptions = () => {
        const { isKeywordGroupSharedWithMe } = this.props;
        return (
            <OptionButtonsContainer>
                {!isKeywordGroupSharedWithMe && this.getShareButton()}
                <MarketingWorkspaceDrillDownEllipsis
                    onGroupRowDelete={this.onGroupRowDelete}
                    onGroupRowEdit={this.onGroupRowEdit}
                    onGroupRowDuplicate={this.onGroupRowDuplicate}
                    onDownloadExcel={this.onDownloadExcelClick}
                    groupRowSource={this.props.keywordGroup}
                    getConfirmationContentText={this.getConfirmationContentText}
                    getConfirmationHeaderText={this.getConfirmationHeaderText}
                    editable={!this.props.isKeywordGroupSharedWithMe}
                    duplicateable={this.props.isKeywordGroupSharedWithMe}
                    duplicateInProgress={this.state.duplicateInProgress}
                    deletable={!this.props.isKeywordGroupSharedWithMe}
                />
            </OptionButtonsContainer>
        );
    };

    private onMoreDropdownButtonToggle = () => {
        //todo tracking?
    };

    private onAllCompetitorsClick = () => {
        switch (this.state.mode) {
            case EMarketingWorkspaceKeywordGroupPageMode.ORGANIC:
                this.swNavigator.go("keywordAnalysis-organic", {
                    country: this.props.country,
                    duration: "3m",
                    tab: "domains",
                    keyword: `*${this.props.keywordGroup.id}`,
                });
                return;
            case EMarketingWorkspaceKeywordGroupPageMode.PAID:
                this.swNavigator.go("keywordAnalysis-paid", {
                    country: this.props.country,
                    duration: "3m",
                    tab: "domains",
                    keyword: `*${this.props.keywordGroup.id}`,
                });
                return;
        }
    };

    private onGroupRowDelete = async (selectedGroupRow): Promise<void> => {
        const group = keywordsGroupsService.findGroupById(selectedGroupRow.id);
        if (group) {
            await keywordsGroupsService.deleteGroup(group);
            this.navigateAfterDelete(selectedGroupRow);
        }
    };

    private navigateAfterDelete = (selectedGroupRow): void => {
        const selectedGroupId = selectedGroupRow.id || selectedGroupRow.Id;

        const current = this.swNavigator.current();
        const params = this.swNavigator.getParams();
        // find the next group to redirect
        const nextGroup = this.props.keywordGroups.find(
            (group) => group.id !== selectedGroupId && group.linked,
        );
        if (nextGroup) {
            marketingWorkspaceGo(current, { ...params, keywordGroupId: nextGroup.id });
        } else {
            // last group deleted
            marketingWorkspaceGo("marketingWorkspace-arena", {
                ...params,
                arenaId: this.props.arenas[0].id,
            });
        }
    };

    private onGroupRowEdit = async (selectedGroupRow) => {
        const group = keywordsGroupsService.findGroupById(selectedGroupRow.id);
        this.setState({
            isOpen: true,
            keywordGroupToEdit: group,
        });
    };

    private onGroupRowDuplicate = async (selectedGroupRow) => {
        await this.setStateAsync({ duplicateInProgress: true });
        try {
            const group = await keywordsGroupsService.duplicateGroup(
                selectedGroupRow.id,
                selectedGroupRow.name,
            );
            this.onSaveKeywordGroup(group);
        } catch (e) {
        } finally {
            await this.setStateAsync({ duplicateInProgress: false });
        }
    };

    private onSaveKeywordGroup = (group) => {
        const current = this.swNavigator.current();
        this.swNavigator.go(current, { keywordGroupId: group.Id }, { reload: true });
    };

    private onDownloadExcelClick = () => {
        window.location.href = this.getExcelLink();
    };

    private getExcelLink() {
        const { country, sites, keywordGroup, websource, keywordsType } = this.props;
        const { from, to, isWindow } = this.getDurationForApi();
        const { sort, asc } = this.state.sortedColumn;
        const params: any = {
            country,
            from,
            to,
            isWindow,
            websource,
            keywordsType,
            sort,
            asc,
        };
        if (sites) {
            params.sites = sites.join(",");
        }
        if (sites) {
            return `api/workspaces/marketing/keywords/groups/${
                keywordGroup.id
            }/benchmark/excel?${queryString.stringify(params)}`;
        } else {
            return `api/workspaces/marketing/keywords/groups/${
                keywordGroup.id
            }/excel?${queryString.stringify(params)}`;
        }
    }

    private getConfirmationHeaderText = (groupRowSource) => {
        if (groupRowSource) {
            switch (this.state.mode) {
                case EMarketingWorkspaceKeywordGroupPageMode.ORGANIC:
                    return i18n("workspaces.marketing.seo.grouprow.confirmation.header.text", {
                        name: groupRowSource.name,
                    });
                case EMarketingWorkspaceKeywordGroupPageMode.PAID:
                    return i18n("workspaces.marketing.ppc.grouprow.confirmation.header.text", {
                        name: groupRowSource.name,
                    });
            }
        }
        return "";
    };

    private getConfirmationContentText = (groupRowSource) => {
        if (groupRowSource) {
            switch (this.state.mode) {
                case EMarketingWorkspaceKeywordGroupPageMode.ORGANIC:
                    return i18n("workspaces.marketing.seo.grouprow.confirmation.content.text", {
                        name: groupRowSource.name,
                    });
                case EMarketingWorkspaceKeywordGroupPageMode.PAID:
                    return i18n("workspaces.marketing.ppc.grouprow.confirmation.content.text", {
                        name: groupRowSource.name,
                    });
            }
        }
        return "";
    };

    private getUrlForKeyWord(keyword) {
        const { country } = this.props;
        const defaultParams = this.swSettings.components[
            this.swNavigator.getState("keywordAnalysis-overview").configId
        ].defaultParams;
        return this.swNavigator.href("keywordAnalysis-overview", {
            ...defaultParams,
            keyword,
            country,
        });
    }

    private transformData = (data) => {
        const { country } = this.props;
        return {
            ...data,
            records: data.records.map((keywordGroupDetail) => {
                return {
                    ...keywordGroupDetail,
                    volumeTrend: keywordGroupDetail.volumeTrend
                        ? keywordGroupDetail.volumeTrend.map(({ value, key }) => ({
                              value,
                              tooltip: (
                                  <span>
                                      <strong>{`${abbrNumberFilter()(value)}`}</strong>
                                      {` searches in ${dayjs.utc(key).format("MMM, YYYY")}`}
                                  </span>
                              ),
                          }))
                        : [],
                    url: this.getUrlForKeyWord(keywordGroupDetail.keyword),
                    trafficDistribution: keywordGroupDetail.trafficDistribution
                        ? keywordGroupDetail.trafficDistribution.map(({ site, percentage }) => {
                              const colorIndex = this.props.sites.indexOf(site);
                              return {
                                  color: colorsPalettes.carbon[0],
                                  backgroundColor: CHART_COLORS.main[colorIndex],
                                  width: percentage,
                                  text: smallNumbersPercentageFilter()(percentage, 1),
                                  name: site,
                              };
                          })
                        : [],
                    country,
                };
            }),
        };
    };

    private onSubDomainsFilterChange = ({ id }) => {
        this.props.setIsWWW(id === ESubdomainsType.INCLUDE ? "*" : "-");
    };

    private setStateAsync(newState) {
        return new Promise<void>((resolve) => {
            this.setState(newState, resolve);
        });
    }
}

const mapStateToProps = ({ marketingWorkspace: { selectedWorkspace }, routing }) => {
    const { filters, arenas, keywordGroups, sharedKeywordGroups } = selectedWorkspace;
    const { keywordGroupId } = routing.params;
    let keywordGroup;
    let isKeywordGroupSharedWithMe = false;
    keywordGroup = keywordGroups.find((g) => g.id === keywordGroupId);
    if (!keywordGroup) {
        keywordGroup = sharedKeywordGroups.find((g) => g.id === keywordGroupId);
        isKeywordGroupSharedWithMe = true;
    }
    return {
        arenas,
        country: filters.country,
        keywordGroup,
        isKeywordGroupSharedWithMe,
        keywordGroups,
        duration: filters.duration,
        websource: filters.websource,
        sites: filters.sites,
        keywordsType: filters.keywordsType,
        title: keywordGroup.name,
        isWWW: filters.isWWW,
        selectedWorkspace,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setCountry: (value) => {
            dispatch(marketingWorkspaceSetCountry(value));
        },
        setDuration: (value) => {
            dispatch(marketingWorkspaceSetDuration(value));
        },
        setWebsource: (value) => {
            dispatch(marketingWorkspaceSetWebsource(value));
        },
        setIsWWW: (value) => {
            dispatch(marketingWorkspaceSetIsWWW(value));
        },
        setSites: (value) => {
            dispatch(marketingWorkspaceSetSites(value));
        },
        setFilters: (filters) => {
            dispatch(marketingWorkspaceSetFilters(filters));
        },
        setKeywordsType: (type) => {
            dispatch(marketingWorkspaceSetKeywordsType(type));
        },
        setAllParamas: (params) => {
            dispatch(marketingWorkspaceSetAllParams(params));
        },
        showToast: (text) => {
            dispatch(showSuccessToast(text));
        },
        setWorkspace: (workspace) => {
            dispatch(marketingWorkspaceSetSelectedWorkspace(workspace));
        },
        updateKeywordGroup: (group) => {
            dispatch(updateSelectedWorkspaceKeywordGroup(group));
        },
        setKeywordGroups: (groups) => {
            dispatch(setSelectedWorkspaceKeywordGroups(groups));
        },
    };
};

const mapUrlToAction = {
    country: (value) => {
        if (value !== null) {
            return marketingWorkspaceSetCountry(parseInt(value));
        }
    },
    duration: (value) => {
        if (value !== null) {
            return marketingWorkspaceSetDuration(value);
        }
    },
    websource: (value) => {
        if (value !== null) {
            return marketingWorkspaceSetWebsource(value);
        }
    },
    isWWW: (value) => {
        if (value !== null) {
            return marketingWorkspaceSetIsWWW(value);
        }
    },
    sites: (value) => {
        if (value !== null) {
            return marketingWorkspaceSetSites(value.split(",").filter((s) => s));
        } else {
            return marketingWorkspaceSetSites(null);
        }
    },
    keywordsType: (value) => {
        if (value !== null) {
            return marketingWorkspaceSetKeywordsType(value);
        }
    },
};

const connected = NavigatorConnectHOC(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {
        areStatesEqual: (next, prev) => {
            const id = next.routing.params.keywordGroupId;
            const workspaceId = next.marketingWorkspace.selectedWorkspace.id;
            const keywordGroup =
                keywordsGroupsService.userGroups.find((g) => g.Id === id) ||
                keywordsGroupsService.getSharedGroups().find((g) => g.Id === id);
            if (!id || !keywordGroup || !workspaceId) {
                return true;
            } else {
                return next === prev;
            }
        },
    },
    mapUrlToAction,
    true,
)(MarketingWorkspaceKeywordGroupPage);
export default SWReactRootComponent(connected, "MarketingWorkspaceKeywordGroupPage");
