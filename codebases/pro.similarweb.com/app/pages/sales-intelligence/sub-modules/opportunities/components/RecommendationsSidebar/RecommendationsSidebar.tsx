import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { useTrack } from "components/WithTrack/src/useTrack";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { ListRecommendationType, OpportunityListType } from "../../types";
import OpportunityListPageContext from "pages/sales-intelligence/pages/opportunity-list/context/OpportunityListPageContext";
import { StyledRecommendationContainer } from "pages/workspace/sales/src/styles";
import { CloseContainer } from "pages/workspace/common components/RightBar/src/RightBar";
import { IconButton } from "@similarweb/ui-components/dist/button";
import {
    RecommendationsSidebarContentWrapper,
    RecommendationsSidebarHeader,
    RecommendationsSidebarInfo,
    RecommendationsSidebarSubtitle,
    RecommendationsSidebarTitle,
    RecommendationsSidebarTitleWrapper,
    RecommendationsSidebarTopSection,
    Separator,
} from "pages/workspace/common components/RecommendationsSidebar/StyledComponents";
import RecommendationsContent from "./RecommendationsContent";
import RecommendationsEmpty from "./RecommendationsEmpty";
import RecommendationsLoader from "./RecommendationsLoader";
import { WithSWNavigatorProps } from "pages/sales-intelligence/hoc/withSWNavigator";

type RecommendationsSidebarProps = {
    recommendations: ListRecommendationType[];
    recommendationsBarOpen: boolean;
    recommendationsFetching: boolean;
    navigator: WithSWNavigatorProps["navigator"];
    toggleRecommendationsBar(isOpen: boolean): void;
    fetchListRecommendations(id: OpportunityListType["opportunityListId"]): void;
    addRecommendationsToList(list: OpportunityListType, domains: string[]): void;
    dismissRecommendation(id: OpportunityListType["opportunityListId"], domain: string): void;
};

const RecommendationsSidebar = (props: RecommendationsSidebarProps) => {
    const [track] = useTrack();
    const translate = useTranslation();
    const { list } = React.useContext(OpportunityListPageContext);
    const {
        navigator,
        recommendations,
        recommendationsBarOpen,
        recommendationsFetching,
        fetchListRecommendations,
        toggleRecommendationsBar,
        dismissRecommendation,
        addRecommendationsToList,
    } = props;

    const refreshRecommendations = React.useCallback(() => {
        fetchListRecommendations(list.opportunityListId);
    }, [list.opportunityListId]);

    const handleRecommendationDismiss = React.useCallback(
        (domain: string) => {
            dismissRecommendation(list.opportunityListId, domain);
        },
        [list.opportunityListId, dismissRecommendation],
    );

    const handleRecommendationsAdd = React.useCallback(
        (domains: { Domain: string }[]) => {
            addRecommendationsToList(
                list,
                domains.map((d) => d.Domain),
            );
        },
        [list],
    );

    const navigateToAccountReview = (domain: string) => {
        navigator.go("accountreview_website_overview_websiteperformance", {
            key: domain,
            country: list.country,
            isWWW: "*",
            duration: "1m",
            webSource: "Total",
        });
    };

    React.useEffect(() => {
        fetchListRecommendations(list.opportunityListId);
    }, [list.opportunityListId]);

    const renderContent = () => {
        if (recommendationsFetching) {
            return <RecommendationsLoader />;
        }

        if (recommendations.length === 0) {
            return <RecommendationsEmpty list={list} onRefresh={refreshRecommendations} />;
        }

        return (
            <RecommendationsContent
                list={list}
                recommendations={recommendations}
                onRefresh={refreshRecommendations}
                onLinkClick={navigateToAccountReview}
                onRecommendationsAdd={handleRecommendationsAdd}
                onRecommendationDismiss={handleRecommendationDismiss}
            />
        );
    };

    return (
        <StyledRecommendationContainer isOpen={recommendationsBarOpen}>
            <CloseContainer isPrimaryOpen={recommendationsBarOpen}>
                <IconButton
                    type="flat"
                    iconSize="xs"
                    iconName="clear"
                    onClick={() => toggleRecommendationsBar(false)}
                />
            </CloseContainer>
            <RecommendationsSidebarTopSection>
                <RecommendationsSidebarHeader>
                    <RecommendationsSidebarTitleWrapper>
                        <RecommendationsSidebarTitle>
                            {translate("workspace.recommendation_sidebar.title")}
                        </RecommendationsSidebarTitle>
                        <PlainTooltip
                            tooltipContent={translate(
                                "workspace.recommendation_sidebar.title.tooltip",
                            )}
                        >
                            <RecommendationsSidebarInfo>
                                <SWReactIcons iconName="info" size="xs" />
                            </RecommendationsSidebarInfo>
                        </PlainTooltip>
                    </RecommendationsSidebarTitleWrapper>
                </RecommendationsSidebarHeader>
                <RecommendationsSidebarSubtitle>
                    {translate("workspace.recommendation_sidebar.subtitle.first")}
                </RecommendationsSidebarSubtitle>
            </RecommendationsSidebarTopSection>
            <Separator />
            <RecommendationsSidebarContentWrapper>
                {renderContent()}
            </RecommendationsSidebarContentWrapper>
        </StyledRecommendationContainer>
    );
};

export default RecommendationsSidebar;
