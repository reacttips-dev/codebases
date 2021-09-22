import React, { useCallback, useMemo, useState } from "react";
import { renderInsightCardFromRecord, renderPromptCard } from "../helpers/InsightRenderer";
import { CarouselContainer } from "@similarweb/ui-components/dist/carousel";
import {
    CarouselButtonIconContainer,
    CarouselButtonLeft,
    CarouselButtonRight,
} from "components/Carousel/src/Carousel.styles";
import { SWReactIcons } from "@similarweb/icons";
import { IInsightCardsProps } from "./InsightCardsTypes";
import {
    InsightCardWrapper,
    InsightsContainer,
    InsightsLoaderContainer,
} from "./InsightCardsStyles";
import { InsightCardLoader } from "./InsightCardLoader";
import { renderNoDataCard } from "pages/competitive-tracking/trackerpage/insights/helpers/InsightRenderer";

export const InsightCards: React.FunctionComponent<IInsightCardsProps> = (props) => {
    const { insightRecords, services, isLoading } = props;
    const [selectedCard, setSelectedCard] = useState(0);

    const InsightCards = useMemo(() => {
        if (!insightRecords || insightRecords.length <= 0) {
            return [renderNoDataCard(services)];
        }

        const insightCards = insightRecords.map((insight, index) => {
            const InsightCardComponent = renderInsightCardFromRecord(insight, services);
            return <InsightCardWrapper key={index}>{InsightCardComponent}</InsightCardWrapper>;
        });

        return [...insightCards, renderPromptCard(services)];
    }, [insightRecords, services]);

    const pickNextCard = () => {
        if (selectedCard >= insightRecords.length) return;
        setSelectedCard(selectedCard + 1);
    };

    const pickPrevCard = () => {
        if (selectedCard <= 0) return;
        setSelectedCard(selectedCard - 1);
    };

    const PrevCardButton = useMemo(() => {
        return (
            <CarouselButtonLeft onClick={pickPrevCard}>
                <CarouselButtonIconContainer>
                    <SWReactIcons iconName="arrow-left" />
                </CarouselButtonIconContainer>
            </CarouselButtonLeft>
        );
    }, [pickPrevCard]);

    const NextCardButton = useMemo(() => {
        return (
            <CarouselButtonRight onClick={pickNextCard}>
                <CarouselButtonIconContainer>
                    <SWReactIcons iconName="arrow-right" />
                </CarouselButtonIconContainer>
            </CarouselButtonRight>
        );
    }, [pickNextCard]);

    if (isLoading) {
        return (
            <InsightsLoaderContainer>
                <InsightCardLoader />
                <InsightCardLoader />
            </InsightsLoaderContainer>
        );
    }

    return (
        <InsightsContainer
            leftVisible={selectedCard > 0}
            rightVisible={selectedCard < insightRecords.length}
        >
            <CarouselContainer selectedItem={selectedCard}>{InsightCards}</CarouselContainer>
            {PrevCardButton}
            {NextCardButton}
        </InsightsContainer>
    );
};
