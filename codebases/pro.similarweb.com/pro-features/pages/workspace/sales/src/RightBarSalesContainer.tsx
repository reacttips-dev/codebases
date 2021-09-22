import React from "react";
import { RightBarHoverContainerProps } from "pages/workspace/sales/components/RightBar/RightBarHoverContainer";
import RecommendationContainer, {
    RecommendationContainerProps,
} from "pages/workspace/sales/src/RecommendationContainer";
import SidebarContainer from "pages/sales-intelligence/sub-modules/right-sidebar/components/Sidebar/SidebarContainer";

type RightBarSalesContainerProps = RecommendationContainerProps & RightBarHoverContainerProps;

const RightBarSalesContainer: React.FC<RightBarSalesContainerProps> = (props) => {
    const {
        getExcelTableRowHref,
        isRecommendationOpen,
        toggleRecommendations,
        onAddRecommendations,
        onDismissRecommendation,
        onLinkRecommendation,
        recommendations,
        isLoading,
    } = props;

    return (
        <>
            <SidebarContainer getExcelTableRowHref={getExcelTableRowHref} />
            <RecommendationContainer
                isRecommendationOpen={isRecommendationOpen}
                toggleRecommendations={toggleRecommendations}
                onAddRecommendations={onAddRecommendations}
                onDismissRecommendation={onDismissRecommendation}
                onLinkRecommendation={onLinkRecommendation}
                recommendations={recommendations}
                isLoading={isLoading}
            />
        </>
    );
};

export default RightBarSalesContainer;
