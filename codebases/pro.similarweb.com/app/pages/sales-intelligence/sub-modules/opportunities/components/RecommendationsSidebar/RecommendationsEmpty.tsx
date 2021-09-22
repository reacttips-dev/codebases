import React from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    RecommendationsEmptyStateImageAndText,
    RecommendationsSidebarEmptyStateBoldTitle,
    RecommendationsSidebarEmptyStateButtonReloadContainer,
    RecommendationsSidebarEmptyStateTitle,
    RecommendationsSidebarEmptyStateWrapper,
} from "pages/workspace/common components/RecommendationsSidebar/StyledComponents";
import { RecommendationsEmptyState } from "pages/workspace/common components/RecommendationsSidebar/RecommendationsEmptyState";
import { OpportunityListType } from "../../types";

type RecommendationsEmptyProps = {
    list: OpportunityListType;
    onRefresh(): void;
};

const RecommendationsEmpty = (props: RecommendationsEmptyProps) => {
    const translate = useTranslation();
    const { list, onRefresh } = props;

    return (
        <RecommendationsSidebarEmptyStateWrapper>
            {list.opportunities.length > 0 && (
                <RecommendationsSidebarEmptyStateButtonReloadContainer>
                    <Button
                        type="flat"
                        onClick={onRefresh}
                        dataAutomation="recommendations-sidebar-reload"
                    >
                        {translate("workspace.recommendation_sidebar.refresh")}
                    </Button>
                </RecommendationsSidebarEmptyStateButtonReloadContainer>
            )}
            <RecommendationsEmptyStateImageAndText>
                {RecommendationsEmptyState}
                <RecommendationsSidebarEmptyStateBoldTitle>
                    {translate("workspace.recommendation_sidebar.empty_state.title")}
                </RecommendationsSidebarEmptyStateBoldTitle>
                <RecommendationsSidebarEmptyStateTitle>
                    {translate("workspace.recommendation_sidebar.empty_state")}
                </RecommendationsSidebarEmptyStateTitle>
            </RecommendationsEmptyStateImageAndText>
        </RecommendationsSidebarEmptyStateWrapper>
    );
};

export default RecommendationsEmpty;
