import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    RecommendationsTopTitle,
    RecommendationTile,
} from "pages/workspace/common components/RecommendationsSidebar/RecommendationsSidebar";
import { ListRecommendationType, OpportunityListType } from "../../types";
import CountryService from "services/CountryService";
import { ButtonsWrapper } from "pages/workspace/common components/RecommendationsSidebar/StyledComponents";
import { Button } from "@similarweb/ui-components/dist/button";
import { useTrack } from "components/WithTrack/src/useTrack";

type RecommendationsContentProps = {
    list: OpportunityListType;
    recommendations: ListRecommendationType[];
    onRefresh(): void;
    onRecommendationsAdd(domains: { Domain: string }[]): void;
    onRecommendationDismiss(domain: string): void;
    onLinkClick(domain: string): void;
};

const RecommendationsContent = (props: RecommendationsContentProps) => {
    const [track] = useTrack();
    const translate = useTranslation();
    const {
        list,
        recommendations,
        onRefresh,
        onLinkClick,
        onRecommendationsAdd,
        onRecommendationDismiss,
    } = props;
    const listCountry = React.useMemo(() => {
        return CountryService.getCountryById(list.country);
    }, [list.country]);

    const handleAddAllClick = () => {
        onRecommendationsAdd(
            recommendations.map((r) => ({
                Domain: r.Domain,
            })),
        );
    };

    return (
        <>
            <RecommendationsTopTitle
                translate={translate}
                country={listCountry?.text}
                recommendations={recommendations}
            />
            <ButtonsWrapper>
                <Button
                    type="flat"
                    onClick={handleAddAllClick}
                    dataAutomation="recommendations-sidebar-add-all"
                >
                    {translate("workspace.recommendation_sidebar.button")}
                </Button>
                <Button
                    type="flat"
                    onClick={onRefresh}
                    dataAutomation="recommendations-sidebar-reload"
                >
                    {translate("workspace.recommendation_sidebar.refresh")}
                </Button>
            </ButtonsWrapper>
            {recommendations.map((recommendation) => (
                <RecommendationTile
                    key={recommendation.Domain}
                    track={track}
                    translate={translate}
                    onLinkRecommendation={onLinkClick}
                    onAddRecommendations={onRecommendationsAdd}
                    onDismissRecommendation={onRecommendationDismiss}
                    {...recommendation}
                    TopCountryName={CountryService.getCountryById(recommendation.TopCountry)?.text}
                />
            ))}
        </>
    );
};

export default RecommendationsContent;
