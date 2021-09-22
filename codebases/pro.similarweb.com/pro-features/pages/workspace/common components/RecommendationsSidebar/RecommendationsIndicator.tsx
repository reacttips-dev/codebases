import { Bubble } from "@similarweb/ui-components/dist/bubble";
import React from "react";
import { useState } from "react";
import { i18nFilter } from "../../../../../app/filters/ngFilters";
import UIComponentStateService from "../../../../../app/services/UIComponentStateService";
import WithTrack from "../../../../components/WithTrack/src/WithTrack";
import WithTranslation from "../../../../components/WithTranslation/src/WithTranslation";
import {
    RecommendationIndicatorContentStyle,
    RecommendationsIndicatorLdsRing,
    RecommendationsIndicatorNumber,
    RecommendationsIndicatorText,
    RecommendationsIndicatorWrapper,
} from "./StyledComponents";

interface IRecommendationsIndicatorProps {
    isLoading?: boolean;
    total: number;
    isOpen?: boolean;
    hideNotification?: boolean;
    onClick: () => void;
}

const RecommendationsIndicatorLoader = () => (
    <>
        <RecommendationsIndicatorLdsRing>
            <div />
            <div />
            <div />
            <div />
        </RecommendationsIndicatorLdsRing>
        <RecommendationsIndicatorNumber />
    </>
);

const RecommendationIndicatorContent = ({
    isOpen,
    isLoading,
    total,
    shouldShowRecommendationBubble,
    removeBubble,
}) => {
    return (
        <RecommendationIndicatorContentStyle
            className="recommendation-indicator"
            onClick={(e) => e.stopPropagation()}
        >
            {
                <Bubble
                    isOpen={!isLoading && total > 0 && !shouldShowRecommendationBubble}
                    onClose={removeBubble}
                    title={i18nFilter()("workspace.recommendation.bubble.title")}
                    text={i18nFilter()("workspace.recommendation.bubble.text")}
                    cssClass={"Bubble-element try-bubble recommendation-bubble"}
                    placement={"bottom-left"}
                    appendTo={".recommendation-indicator"}
                >
                    <div>
                        {isLoading ? (
                            <RecommendationsIndicatorLoader />
                        ) : (
                            total > 0 && (
                                <RecommendationsIndicatorNumber>
                                    {total}
                                </RecommendationsIndicatorNumber>
                            )
                        )}
                    </div>
                </Bubble>
            }
        </RecommendationIndicatorContentStyle>
    );
};

export const RecommendationsIndicator = ({
    isLoading,
    total,
    isOpen,
    hideNotification,
    onClick,
}: IRecommendationsIndicatorProps) => {
    const recommendationBubbleLocalStorage = JSON.parse(
        UIComponentStateService.getItem("seenRecommendationBubble", "localStorage", true),
    );
    const [shouldShowRecommendationBubble, removeRecommendationBubble] = useState(
        recommendationBubbleLocalStorage || !!hideNotification,
    );
    const removeBubble = () => {
        UIComponentStateService.setItem("seenRecommendationBubble", "localStorage", "true", true);
        removeRecommendationBubble(true);
    };
    return (
        <WithTranslation>
            {(translate) => (
                <WithTrack>
                    {(track) => {
                        const onToggleRecommendations = () => {
                            onClick();
                            track(
                                "Recommendation model",
                                isOpen ? "close" : "open",
                                "Recommendation",
                            );
                        };

                        return (
                            <RecommendationsIndicatorWrapper
                                isOpen={!!isOpen}
                                onClick={onToggleRecommendations}
                                data-automation="recommendations-sidebar-button"
                            >
                                <RecommendationIndicatorContent
                                    shouldShowRecommendationBubble={shouldShowRecommendationBubble}
                                    isLoading={isLoading}
                                    isOpen={isOpen}
                                    total={total}
                                    removeBubble={removeBubble}
                                />
                                <RecommendationsIndicatorText>
                                    {translate("workspace.recommendation_sidebar.indicator")}
                                </RecommendationsIndicatorText>
                            </RecommendationsIndicatorWrapper>
                        );
                    }}
                </WithTrack>
            )}
        </WithTranslation>
    );
};
