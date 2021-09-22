import React from "react";
import { CloseContainer } from "pages/workspace/common components/RightBar/src/RightBar";
import {
    IRecommendationsSidebarProps,
    RecommendationsSidebar,
} from "pages/workspace/common components/RecommendationsSidebar/RecommendationsSidebar";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { StyledRecommendationContainer } from "./styles";

export interface RecommendationContainerProps extends IRecommendationsSidebarProps {
    isRecommendationOpen: boolean;
    toggleRecommendations(status: boolean): void;
}

const RecommendationContainer = (props: RecommendationContainerProps) => {
    const {
        isRecommendationOpen,
        toggleRecommendations,
        onAddRecommendations,
        onLinkRecommendation,
        recommendations,
        onDismissRecommendation,
        isLoading,
    } = props;
    return (
        <>
            <StyledRecommendationContainer isOpen={isRecommendationOpen}>
                <CloseContainer isPrimaryOpen={isRecommendationOpen}>
                    <IconButton
                        iconSize="xs"
                        iconName="clear"
                        type="flat"
                        onClick={() => toggleRecommendations(false)}
                    />
                </CloseContainer>
                <RecommendationsSidebar
                    onAddRecommendations={onAddRecommendations}
                    onDismissRecommendation={onDismissRecommendation}
                    onLinkRecommendation={onLinkRecommendation}
                    recommendations={recommendations}
                    isLoading={isLoading}
                />
            </StyledRecommendationContainer>
        </>
    );
};

export default RecommendationContainer;
