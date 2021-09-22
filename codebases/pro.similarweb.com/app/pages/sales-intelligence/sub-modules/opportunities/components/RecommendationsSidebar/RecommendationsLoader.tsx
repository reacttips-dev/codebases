import React from "react";
import { CircularLoader } from "components/React/CircularLoader";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    RecommendationsSidebarEmptyStateTitle,
    RecommendationsSidebarEmptyStateWrapper,
} from "pages/workspace/common components/RecommendationsSidebar/StyledComponents";

const RecommendationsLoader = () => {
    const translate = useTranslation();

    return (
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
                {translate("workspace.recommendation_sidebar.loading_state")}
            </RecommendationsSidebarEmptyStateTitle>
        </RecommendationsSidebarEmptyStateWrapper>
    );
};

export default React.memo(RecommendationsLoader);
