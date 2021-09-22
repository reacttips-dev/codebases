import { colorsPalettes } from "@similarweb/styles";
import { SwLog } from "@similarweb/sw-log";
import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import { swSettings } from "common/services/swSettings";
import { NavigatorConnectHOC } from "components/navigatorHOC/navigatorConnectHOC";
import SWReactTableWrapper from "components/React/Table/SWReactTableWrapper";
import _ from "lodash";
import dayjs from "dayjs";
import MonitorKeywordsTableTopBar from "pages/digital-marketing/monitor-lists/keywords/MonitorKeywordsTableTopBar";
import { MonitorKeywordsGroupTableSettings } from "pages/digital-marketing/monitor-lists/keywords/MotinorKeywordsGroupTableSettings";
import PropTypes from "prop-types";
import queryString from "query-string";
import React from "react";
import DurationService from "services/DurationService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { FlexColumn } from "./../../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import { Injector } from "../../../../.././scripts/common/ioc/Injector";
import { CHART_COLORS } from "constants/ChartColors";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import {
    abbrNumberFilter,
    i18nFilter,
    smallNumbersPercentageFilter,
    CPCFilter,
} from "filters/ngFilters";
import { DefaultFetchService } from "services/fetchService";
import { marketingWorkspaceGo } from "pages/workspace/marketing/MarketingWorkspaceCtrl";
import { MarketingWorkspaceDrillDownEllipsis } from "../../../workspace/marketing/shared/MarketingWorkspaceDrillDownEllipsis";
import {
    BenchmarkToArenaLegendStyled,
    MarketingWorkspaceGroupPageContainer,
    ScrollContainer,
} from "../../../workspace/marketing/shared/styledComponents";
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
    RecommendationKeywordTileStyled,
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
import { KeywordGroupsShareModal } from "pages/workspace/marketing/pages/KeywordGroupShareModal";
import styled from "styled-components";
import { SharingService } from "sharing/SharingService";

import "../../../workspace/marketing/marketingWorkspace.scss";
import { KeywordsGroupEditorModal } from "pages/keyword-analysis/KeywordsGroupEditorModal";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";
const i18n = i18nFilter();

export enum EMonitorKeywordsPageMode {
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

const TableWrapper = styled.div`
    & .css-sticky-header {
        top: 0px !important;
    }
`;

class MonitorKeywordsPage extends React.PureComponent<any, any> {
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
            keywordGroups: keywordsGroupsService.userGroups.concat(
                keywordsGroupsService.getSharedGroups(),
            ),
            keywordGroup:
                keywordsGroupsService.userGroups.find(
                    (group) => group.Id === this.props.keywordGroupId,
                ) ||
                keywordsGroupsService
                    .getSharedGroups()
                    .find((group) => group.Id === this.props.keywordGroupId),
            isKeywordGroupSharedWithMe: false,
            mode:
                props.keywordsType === "paid"
                    ? EMonitorKeywordsPageMode.PAID
                    : EMonitorKeywordsPageMode.ORGANIC,
            sortedColumn: {
                sort: MonitorKeywordsGroupTableSettings.defaultSortField,
                asc: MonitorKeywordsGroupTableSettings.defaultSortDirection === "asc",
            },
            scroll: false,
            isRecommendationOpen: false,
            isRecommendationLoading: true,
            isSavingAllRecommendations: false,
            isSavingOneRecommendation: {},
            recommendations: [],
        };
    }

    public async componentDidUpdate(prevProps: Readonly<any>) {
        if (!this.props.sites) {
            const propsHasChanged =
                this.propHasChanged("duration", prevProps.duration) ||
                this.propHasChanged("sites", prevProps.sites) ||
                this.propHasChanged("websource", prevProps.websource) ||
                this.propHasChanged("keywordsType", prevProps.keywordsType);
            if (propsHasChanged) {
                if (!!this.state.keywordGroup.SharedWithAccounts) {
                    this.getRecommendations();
                }
            }
        }
    }

    public async componentDidMount() {
        if (this.scrollContainerRef) {
            this.scrollContainerRef.current.addEventListener("scroll", this.onScroll);
        }
        if (
            !!this.state.keywordGroup.SharedWithAccounts &&
            this.state.recommendations.length === 0
        ) {
            this.getRecommendations();
        }
        const { users } = await SharingService.getAccountUsers();
        this.setState({ users });
    }

    public componentWillUnmount() {
        if (this.scrollContainerRef) {
            this.scrollContainerRef.current.removeEventListener("scroll", this.onScroll);
        }
    }

    public render() {
        const { country, sites, keywordsType, websource, isWWW } = this.props;
        const keywordGroupBeforeTransform = this.state.keywordGroup;
        const keywordGroup = {
            id: keywordGroupBeforeTransform.Id,
            groupHash: keywordGroupBeforeTransform.GroupHash,
            sharedWithAccounts: keywordGroupBeforeTransform.SharedWithAccounts,
            sharedWithUsers: keywordGroupBeforeTransform.SharedWithUsers,
            ...keywordGroupBeforeTransform,
        };

        const benchmarkToArena = sites && sites.split(",").length > 0;
        const { from, to, isWindow } = this.getDurationForApi();
        const { sort, asc } = this.state.sortedColumn;
        const filters: any = {
            country,
            from,
            to,
            isWindow,
            KeywordsGroup: keywordGroup.id,
            groupHash: keywordGroup.groupHash,
            KeywordSource: keywordsType,
            WebSource: websource,
            includeSubDomains: isWWW === "*",
            sort,
            asc,
        };
        if (benchmarkToArena) {
            filters.Keys = sites;
            delete filters.sort;
        }
        const endpoint = benchmarkToArena
            ? "/widgetApi/MonitorKeywordGroup/KeywordGroupBenchmark/Table"
            : "/widgetApi/MonitorKeywordGroup/KeywordGroupTraffic/Table";
        return (
            <>
                <MarketingWorkspaceGroupPageContainer>
                    <FlexColumn style={{ height: "100%" }}>
                        <ScrollContainer ref={this.scrollContainerRef as any}>
                            {sites && (
                                <BenchmarkToArenaLegendStyled
                                    sites={this.getSitesForLegend()}
                                    onClose={this.clearSelectedArena}
                                    margin={true}
                                    inline={true}
                                />
                            )}
                            <TableWrapper>
                                <SWReactTableWrapper
                                    key={keywordGroup.groupHash}
                                    serverApi={endpoint}
                                    tableOptions={{
                                        metric: "MarketingWorkspaceKeywordsGroupTable",
                                    }}
                                    tableColumns={MonitorKeywordsGroupTableSettings.getColumns(
                                        {
                                            field:
                                                MonitorKeywordsGroupTableSettings.defaultSortField,
                                            sortDirection:
                                                MonitorKeywordsGroupTableSettings.defaultSortDirection,
                                        },
                                        benchmarkToArena,
                                        filters.isWindow,
                                    )}
                                    initialFilters={filters}
                                    transformData={this.transformData}
                                    onSort={this.onSort}
                                >
                                    {(topComponentProps) => (
                                        <MonitorKeywordsTableTopBar
                                            searchPlaceholder="workspaces.marketing.search.placeholder"
                                            permissionsComponent={"KeywordAnalysis"}
                                            researchMore={this.getResearchMore()}
                                            options={this.getOptions()}
                                            {...topComponentProps}
                                            totalTrafficTitle="workspaces.marketing.keywordgroup.totaltraffic.title"
                                            tooltipTitle={
                                                "workspaces.marketing.totalvisits.tooltip"
                                            }
                                            onClickRecommended={
                                                !this.state.keywordGroup.SharedWithAccounts
                                                    ? null
                                                    : this.onClickRecommended
                                            }
                                            onClickShare={this.onClickShare}
                                            isRecommendationLoading={
                                                this.state.isRecommendationLoading
                                            }
                                            recommendationNumber={this.state.recommendations.length}
                                            isKeywordGroupSharedWithMe={
                                                !this.state.keywordGroup.SharedWithAccounts
                                            }
                                            keywordGroup={keywordGroup}
                                        />
                                    )}
                                </SWReactTableWrapper>
                            </TableWrapper>
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
                            marginTop={61}
                        />
                    </FlexColumn>
                </MarketingWorkspaceGroupPageContainer>
                {this.state.showKeywordGroupShareModal && (
                    <KeywordGroupsShareModal
                        isOpen={true}
                        keywordGroup={keywordGroup}
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
        const { Id: id } = this.state.keywordGroup;
        const { country, isWWW, keywordsType, websource } = this.props;
        const { from, to, isWindow } = this.getDurationForApi();
        const params = {
            country,
            from,
            to,
            isWindow,
            WebSource: websource,
            KeywordsGroup: id,
            KeywordSource: keywordsType,
            includeSubDomains: isWWW === "*",
        };
        const endpoint = `/widgetApi/MonitorKeywordGroup/KeywordGroupRecommendations/Table`;
        try {
            const recommendations: any = await this.fetchService.get(endpoint, params);
            this.setState({
                recommendations: recommendations.data.map((recommendation) => ({
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
        track("Recommendation modal", "Click", `add recommendation/${eventValue}`);
        await this.manageSavingRecommendationState(keywords, true, index);
        const currentGroup = keywordsGroupsService.findGroupById(this.state.keywordGroup.Id);
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
                    const indexOfTheCurrentGroup = result.findIndex(
                        (x) => x.Id === this.state.keywordGroup.Id,
                    );
                    const afterUpdate = result[indexOfTheCurrentGroup];
                    this.setState({ keywordGroups: result, keywordGroup: afterUpdate });
                }
            }
        }
    };

    private onClickRecommended = () => {
        const { track } = this.context;
        track(
            "Recommendation modal",
            this.state.isRecommendationOpen ? "close" : "open",
            `sidebar/${this.state.keywordGroup.Name}`,
        );
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

    private onFinishSharing = async (group) => {
        const groupId = group?.KeywordGroupId || this.state.keywordGroup.Id;
        const keywordGroup = keywordsGroupsService.findGroupById(groupId);
        this.setState({
            keywordGroup: keywordGroup,
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

    private getSitesForLegend = () => {
        return this.props.sites.split(",").map((site, index) => ({
            domain: site,
            color: CHART_COLORS.main[index],
        }));
    };

    private clearSelectedArena = () => {
        const { track } = this.context;
        track("Clear Filter", "Click", "BENCHMARK AGAINST YOUR ARENA");
        this.swNavigator.updateParams({ sites: null, IsWWW: null });
    };

    private getDurationForApi = () => {
        const { from, to, isWindow } = DurationService.getDurationData(
            this.props.duration,
            "",
            "KeywordAnalysis",
        ).forAPI;
        return { from, to, isWindow };
    };

    private getResearchMore = () => {
        const type = this.props.keywordsType === EMonitorKeywordsPageMode.PAID ? "ppc" : "seo";
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
        const {
            SharedWithAccounts: sharedWithAccounts,
            SharedWithUsers: sharedWithUsers,
        } = this.state.keywordGroup;
        const isGroupShared = sharedWithAccounts?.length > 0 || sharedWithUsers?.length > 0;
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
        const isKeywordGroupSharedWithMe = !this.state.keywordGroup.SharedWithAccounts;
        return (
            <OptionButtonsContainer>
                {!isKeywordGroupSharedWithMe && this.getShareButton()}
                <MarketingWorkspaceDrillDownEllipsis
                    onGroupRowDelete={this.onGroupRowDelete}
                    onGroupRowEdit={this.onGroupRowEdit}
                    onGroupRowDuplicate={this.onGroupRowDuplicate}
                    onDownloadExcel={this.onDownloadExcelClick}
                    groupRowSource={this.state.keywordGroup}
                    getConfirmationContentText={this.getConfirmationContentText}
                    getConfirmationHeaderText={this.getConfirmationHeaderText}
                    editable={!isKeywordGroupSharedWithMe}
                    duplicateable={isKeywordGroupSharedWithMe}
                    duplicateInProgress={this.state.duplicateInProgress}
                    deletable={!isKeywordGroupSharedWithMe}
                    onDeleteClick={this.onDeleteClick}
                />
            </OptionButtonsContainer>
        );
    };

    private onAllCompetitorsClick = () => {
        switch (this.state.mode) {
            case EMonitorKeywordsPageMode.ORGANIC:
                this.swNavigator.go("keywordAnalysis-organic", {
                    country: this.props.country,
                    duration: this.props.duration,
                    tab: "domains",
                    keyword: `*${this.state.keywordGroup.Id}`,
                });
                return;
            case EMonitorKeywordsPageMode.PAID:
                this.swNavigator.go("keywordAnalysis-paid", {
                    country: this.props.country,
                    duration: this.props.duration,
                    tab: "domains",
                    keyword: `*${this.state.keywordGroup.Id}`,
                });
                return;
        }
    };

    private onDeleteClick = () => {
        TrackWithGuidService.trackWithGuid("monitor.keyword.list.page.delete.click", "open");
    };

    private onGroupRowDelete = async (selectedGroupRow): Promise<void> => {
        TrackWithGuidService.trackWithGuid("monitor.keyword.list.page.delete.click", "close");
        const group = keywordsGroupsService.findGroupById(selectedGroupRow.Id);
        if (group) {
            await keywordsGroupsService.deleteGroup(group);
            this.navigateAfterDelete(selectedGroupRow);
        }
    };

    private navigateAfterDelete = (selectedGroupRow): void => {
        const selectedGroupId = selectedGroupRow.id || selectedGroupRow.Id;

        const params = this.swNavigator.getParams();
        // find the next group to redirect
        const Group = this.state.keywordGroups.find((group) => group.id !== selectedGroupId);
        const GroupIndex = this.state.keywordGroups.indexOf(Group);
        const nextGroup = this.state.keywordGroups[GroupIndex + 1];
        if (nextGroup) {
            this.swNavigator.go("monitorkeywords", {
                keywordGroupId: nextGroup.Id,
                duration: params.duration,
                websource: params.websource,
                keywordsType: params.keywordsType,
                isWWW: "*",
                country: params.country,
            });
        } else {
            // last group deleted
            marketingWorkspaceGo("monitorkeywords_home", {
                ...params,
            });
        }
    };

    private onGroupRowEdit = async (selectedGroupRow) => {
        const group = keywordsGroupsService.findGroupById(selectedGroupRow.Id);
        this.setState({ isOpen: true, keywordGroupToEdit: group });
    };

    private onGroupRowDuplicate = async (selectedGroupRow) => {
        await this.setStateAsync({ duplicateInProgress: true });
        try {
            const group = await keywordsGroupsService.duplicateGroup(
                selectedGroupRow.Id,
                selectedGroupRow.Name,
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
        TrackWithGuidService.trackWithGuid(
            "monitor.keyword.list.page.excel.download.click",
            "submit-ok",
        );
        window.location.href = this.getExcelLink();
    };

    private getExcelLink() {
        const { country, sites, websource, keywordsType } = this.props;
        const { keywordGroup } = this.state;
        const { from, to, isWindow } = this.getDurationForApi();
        const { sort, asc } = this.state.sortedColumn;
        const params: any = {
            country,
            from,
            to,
            isWindow,
            websource,
            KeywordSource: keywordsType,
            sort,
            asc,
            KeywordsGroup: keywordGroup.Id,
        };
        if (sites) {
            params.Keys = sites;
        }
        if (sites) {
            return `widgetApi/MonitorKeywordGroup/KeywordGroupBenchmark/excel?${queryString.stringify(
                params,
            )}`;
        } else {
            return `widgetApi/MonitorKeywordGroup/KeywordGroupTraffic/excel?${queryString.stringify(
                params,
            )}`;
        }
    }

    private getConfirmationHeaderText = (groupRowSource) => {
        if (groupRowSource) {
            switch (this.state.mode) {
                case EMonitorKeywordsPageMode.ORGANIC:
                    return i18n("workspaces.marketing.seo.grouprow.confirmation.header.text", {
                        name: groupRowSource.Name,
                    });
                case EMonitorKeywordsPageMode.PAID:
                    return i18n("workspaces.marketing.ppc.grouprow.confirmation.header.text", {
                        name: groupRowSource.Name,
                    });
            }
        }
        return "";
    };

    private getConfirmationContentText = (groupRowSource) => {
        if (groupRowSource) {
            switch (this.state.mode) {
                case EMonitorKeywordsPageMode.ORGANIC:
                    return i18n("workspaces.marketing.seo.grouprow.confirmation.content.text", {
                        name: groupRowSource.Name,
                    });
                case EMonitorKeywordsPageMode.PAID:
                    return i18n("workspaces.marketing.ppc.grouprow.confirmation.content.text", {
                        name: groupRowSource.Name,
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
            records: data.data.map((keywordGroupDetail) => {
                return {
                    ...keywordGroupDetail,
                    volumeTrends: keywordGroupDetail.volumeTrend
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
                        ? keywordGroupDetail.trafficDistribution.map(
                              ({ site, percentage }, index) => {
                                  const colorIndex = this.props.sites.split(",").indexOf(site);
                                  return {
                                      color: colorsPalettes.carbon[0],
                                      backgroundColor: CHART_COLORS.main[colorIndex],
                                      width: percentage,
                                      text: smallNumbersPercentageFilter()(percentage, 1),
                                      name: site,
                                  };
                              },
                          )
                        : [],
                    country,
                };
            }),
            totalRecords: data.totalCount,
        };
    };

    private setStateAsync(newState) {
        return new Promise<void>((resolve, reject) => {
            this.setState(newState, resolve);
        });
    }
}

const mapStateToProps = ({ routing }) => {
    const {
        keywordGroupId,
        country,
        duration,
        websource,
        isWWW,
        keywordsType,
        sites,
    } = routing.params;

    return {
        keywordGroupId: keywordGroupId,
        country,
        duration,
        websource,
        isWWW,
        keywordsType,
        sites,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showToast: (text) => {
            dispatch(showSuccessToast(text));
        },
    };
};

const connected = NavigatorConnectHOC(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {
        areStatesEqual: (next, prev) => {
            const id = next.routing.params.keywordGroupId;
            const workspaceId = next.marketingWorkspace.selectedWorkspace.id;
            const service = keywordsGroupsService;
            const keywordGroup =
                service.userGroups.find((g) => g.Id === id) ||
                service.getSharedGroups().find((g) => g.Id === id);
            if (!id || !keywordGroup || !workspaceId) {
                return true;
            } else {
                return next === prev;
            }
        },
    },
    true,
)(MonitorKeywordsPage);
export default SWReactRootComponent(connected, "MonitorKeywordsPage");
