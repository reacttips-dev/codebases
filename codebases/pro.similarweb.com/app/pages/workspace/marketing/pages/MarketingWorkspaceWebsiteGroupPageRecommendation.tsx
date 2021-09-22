import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import swLog from "@similarweb/sw-log";
import { Button } from "@similarweb/ui-components/dist/button";
import {
    addRecommendedWebsiteGroup,
    clearMarketingWorkspaceSetRecommendationEngine,
    clearWebsiteGroupRecommendation,
    setMarketingWorkspaceSetRecommendationEngine,
} from "actions/marketingWorkspaceActions";
import { swSettings } from "common/services/swSettings";
import { LoaderListItems } from "components/Loaders/src/LoaderListItems";
import { BenchmarkToArenaItem } from "components/Workspace/BenchmarkToArena/src/BenchmarkToArenaItem";
import { BenchmarkToArenaModal } from "components/Workspace/BenchmarkToArena/src/BenchmarkToArenaModal";
import { i18nFilter } from "filters/ngFilters";
import { marketingWorkspaceGo } from "pages/workspace/marketing/MarketingWorkspaceCtrl";
import * as PropTypes from "prop-types";
import * as React from "react";
import { connect } from "react-redux";
import { AssetsService } from "services/AssetsService";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import CountryService from "services/CountryService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { Injector } from "../../../../../scripts/common/ioc/Injector";
import SWReactRootComponent from "../../../../decorators/SWReactRootComponent";
import {
    MarketingWorkspaceGroupPageContainer,
    MarketingWorkspaceOverviewPageHeaderPart,
    MarketingWorkspacePageHeaderContainer,
    MarketingWorkspacePageTitle,
    MarketingWorkspacePageTitleContainer,
} from "../shared/styledComponents";
import categoryService from "common/services/categoryService";

const EmptyStateContainer = styled(FlexColumn)`
    max-width: 470px;
`;

const EmptyStateGraphics = styled.img`
    margin-top: 104px;
    filter: grayscale(1);
`;

const EmptyStateTitle = styled.div`
    ${mixins.setFont({ $color: rgba(colorsPalettes.carbon[500], 0.6), $size: 16, $weight: 500 })};
    margin-bottom: 8px;
    margin-top: 25px;
`;

const EmptyStateSubTitle = styled.div`
    ${mixins.setFont({ $color: rgba(colorsPalettes.carbon[500], 0.6), $size: 16 })};
    margin-bottom: 54px;
    text-align: center;
`;

const ButtonsGroup = styled.div`
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-around;
    align-items: center;
`;

const BackButton = styled(Button)`
    margin-left: 8px;
`;

const PageContainer = styled.div`
    background-color: ${colorsPalettes.bluegrey[100]};
    flex-grow: 1;
`;

const LoaderContainer = styled.div`
    flex-grow: 1;
    padding-top: 160px;
`;

class MarketingWorkspaceWebsiteGroupPageRecommendation extends React.PureComponent<any, any> {
    public static contextTypes = {
        translate: PropTypes.func,
        track: PropTypes.func,
    };
    public static defaultProps = {
        duration: "3m",
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: true,
            showWebsiteGroupRecommendationModal: false,
        };
    }

    public componentDidMount() {
        this.runWebsiteRecommendation();
    }

    public componentDidUpdate(prevProps) {
        if (this.props.arenaId !== prevProps.arenaId) {
            this.runWebsiteRecommendation();
        }
    }

    public runWebsiteRecommendation = async () => {
        try {
            const arena = this.props.arenas.find(({ id }) => id === this.props.arenaId);
            const { title, workspaceId, arenaId } = this.props;
            const params = {
                country: this.props.country,
                sites: [
                    ...arena.allies.map(({ domain }) => domain),
                    ...arena.competitors.map(({ domain }) => domain),
                ].join(","),
                date: swSettings.current.endDate.format("YYYY-MM"),
            };
            this.props.addRecommendedWebsiteGroup(title, workspaceId, arenaId, params);
        } catch (e) {
            swLog.error(e);
        }
    };

    public render() {
        const loading = this.state.loading && !this.props.websiteGroupRecommendationFailed;
        return (
            <MarketingWorkspaceGroupPageContainer>
                <FlexColumn style={{ height: "100%" }}>
                    <MarketingWorkspacePageHeaderContainer isScroll={false}>
                        <MarketingWorkspaceOverviewPageHeaderPart>
                            <MarketingWorkspacePageTitleContainer>
                                <MarketingWorkspacePageTitle>
                                    {this.props.title}
                                </MarketingWorkspacePageTitle>
                            </MarketingWorkspacePageTitleContainer>
                        </MarketingWorkspaceOverviewPageHeaderPart>
                        <MarketingWorkspaceOverviewPageHeaderPart className="react-filters-container"></MarketingWorkspaceOverviewPageHeaderPart>
                    </MarketingWorkspacePageHeaderContainer>
                    <PageContainer>
                        {loading ? (
                            <LoaderContainer>
                                <LoaderListItems
                                    title={i18nFilter()(
                                        "workspaces.marketing.websitegroup.recommendation.loader.title",
                                    )}
                                    subtitle={i18nFilter()(
                                        "workspaces.marketing.websitegroup.recommendation.loader.subtitle",
                                    )}
                                />
                            </LoaderContainer>
                        ) : (
                            this.emptyState()
                        )}
                    </PageContainer>
                </FlexColumn>
                <BenchmarkToArenaModal
                    isOpen={this.state.showWebsiteGroupRecommendationModal}
                    title={i18nFilter()(
                        "workspaces.marketing.websitegroup.recommendation.modal.title",
                    )}
                    subTitle={i18nFilter()(
                        "workspaces.marketing.websitegroup.recommendation.modal.subtitle",
                    )}
                    onCloseClick={this.toggleWebsiteGroupRecommendationModal}
                >
                    {this.getArenas()}
                </BenchmarkToArenaModal>
            </MarketingWorkspaceGroupPageContainer>
        );
    }

    public emptyState = () => {
        const title = i18nFilter()(
            "workspaces.marketing.websitegroup.recommendation.empty.state.title",
        );
        const subtitle = i18nFilter()(
            "workspaces.marketing.websitegroup.recommendation.empty.state.subtitle",
        );
        const back = i18nFilter()(
            "workspaces.marketing.websitegroup.recommendation.empty.state.back",
        );
        const tryAnother = i18nFilter()(
            "workspaces.marketing.websitegroup.recommendation.empty.state.another",
        );
        return (
            <FlexRow justifyContent="space-around">
                <EmptyStateContainer alignItems="center">
                    <EmptyStateGraphics src={AssetsService.assetUrl(`/images/empty.svg`)} />
                    <EmptyStateTitle>{title}</EmptyStateTitle>
                    <EmptyStateSubTitle>{subtitle}</EmptyStateSubTitle>
                    <ButtonsGroup>
                        <BackButton onClick={this.onBackButtonClick}>{back}</BackButton>
                        <Button type="flat" onClick={this.onTryAnotherButtonClick}>
                            {tryAnother}
                        </Button>
                    </ButtonsGroup>
                </EmptyStateContainer>
            </FlexRow>
        );
    };

    public onBackButtonClick = () => {
        TrackWithGuidService.trackWithGuid(
            "workspace.marketing.websiterecommendations.emptystate.back.to.arena",
            "click",
        );
        const { workspaceId, arenaId } = this.props;
        // clear all recommendation engine settings
        this.props.clearWebsiteGroupRecommendation();
        marketingWorkspaceGo("marketingWorkspace-arena", { workspaceId, arenaId });
    };

    public onTryAnotherButtonClick = () => {
        this.setState({
            loading: false,
        });
        this.props.clearWebsiteGroupRecommendation();
        this.setState({
            showWebsiteGroupRecommendationModal: true,
        });
    };

    private getArenas = () => {
        const arenas = this.props.arenas.map((arena, index) => {
            const countryObj = CountryService.getCountryById(arena.country);
            return (
                <BenchmarkToArenaItem
                    key={`arena-${index}`}
                    country={countryObj}
                    title={arena.friendlyName}
                    competitorsIcons={arena.competitors.map((competitor) => competitor.favicon)}
                    mainDomain={arena.allies[0]}
                    onClick={this.onWebsiteGroupRecommendationEngine(arena)}
                />
            );
        });
        if (arenas.length === 0) {
            return null;
        }
        return arenas;
    };

    private onWebsiteGroupRecommendationEngine = (arena) => () => {
        TrackWithGuidService.trackWithGuid(
            "workspace.marketing.websiterecommendations.emptystate.choose.arena",
            "click",
        );
        this.setState(
            {
                showWebsiteGroupRecommendationModal: false,
            },
            () => {
                this.props.setMarketingWorkspaceSetRecommendationEngine(arena.id);
                const params = {
                    ...this.props.params,
                    arenaId: arena.id,
                };
                marketingWorkspaceGo("marketingWorkspace-websiteGroupRecommendation", params);
            },
        );
    };

    private toggleWebsiteGroupRecommendationModal = () => {
        TrackWithGuidService.trackWithGuid(
            "workspace.marketing.websiterecommendations.emptystate.show.modal",
            "click",
        );
        this.setState({
            showWebsiteGroupRecommendationModal: !this.state.showWebsiteGroupRecommendationModal,
        });
    };
}

const mapStateToProps = ({
    marketingWorkspace: { allWorkspaces, selectedWorkspace, websiteGroupRecommendationFailed },
    routing,
}) => {
    const { filters, arenas, customIndustries } = selectedWorkspace;
    const { websiteGroupId } = routing.params;
    const websiteGroup = UserCustomCategoryService.getCustomCategoryById(websiteGroupId);
    return {
        arenas,
        customIndustries,
        country: filters.country,
        websiteGroup,
        websource: filters.websource,
        duration: filters.duration,
        sites: filters.sites,
        title: categoryService.getNextCategoryName(
            i18nFilter()("workspaces.marketing.websitegroup.recommendation.default.name"),
        ),
        workspaceId: selectedWorkspace.id,
        arenaId: routing.params.arenaId,
        websiteGroupRecommendationFailed,
        params: routing.params,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        clearMarketingWorkspaceSetRecommendationEngine: () => {
            dispatch(clearMarketingWorkspaceSetRecommendationEngine());
        },
        addRecommendedWebsiteGroup: (title, workspaceId, arenaId, params) => {
            dispatch(addRecommendedWebsiteGroup(title, workspaceId, arenaId, params));
        },
        setMarketingWorkspaceSetRecommendationEngine: (arenaId) => {
            dispatch(setMarketingWorkspaceSetRecommendationEngine(arenaId));
        },
        clearWebsiteGroupRecommendation: () => {
            dispatch(clearWebsiteGroupRecommendation());
        },
    };
};

const connected = connect(mapStateToProps, mapDispatchToProps, null, {
    areStatesEqual: (next, prev) => {
        const { currentPage } = next.routing;
        const workspaceId = next.marketingWorkspace.selectedWorkspace.id;
        // if we left this page, do not try to re-render the component
        if (!workspaceId || currentPage !== "marketingWorkspace-websiteGroupRecommendation") {
            return true;
        } else {
            return next === prev;
        }
    },
})(MarketingWorkspaceWebsiteGroupPageRecommendation);
export default SWReactRootComponent(connected, "MarketingWorkspaceWebsiteGroupPageRecommendation");
