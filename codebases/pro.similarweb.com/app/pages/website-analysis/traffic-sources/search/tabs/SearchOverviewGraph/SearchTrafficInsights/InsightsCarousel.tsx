import { CarouselContainer } from "pages/website-analysis/traffic-sources/mmx/components/InsightsAssistant/StyledComponents";
import { Carousel } from "components/Carousel/src/Carousel";
import { InsightSectionHeader } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/SearchTrafficInsights/InsightSectionHeader";
import { Insight } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/SearchTrafficInsights/Insight";
import React from "react";

export const InsightsCarousel = ({
    sortedInsightWithValue,
    setTab,
    setCategoryOnClick,
    setLegends,
    selectedInsightId,
    setSelectedInsightIdAsync,
    setGranularity,
    visitedInsights,
}) => {
    return (
        <CarouselContainer>
            {
                <Carousel margin={16} offset={24}>
                    {...sortedInsightWithValue.map((insight, index, insights) => (
                        <div key={index}>
                            <InsightSectionHeader
                                insights={insights}
                                insight={insight}
                                index={index}
                            />
                            <Insight
                                insightId={index}
                                {...insight}
                                setTab={setTab}
                                setCategory={setCategoryOnClick}
                                setLegends={setLegends}
                                selectedInsightId={selectedInsightId}
                                setSelectedInsightId={setSelectedInsightIdAsync}
                                setGranularity={setGranularity}
                                isVisited={visitedInsights[index]}
                            />
                        </div>
                    ))}
                </Carousel>
            }
        </CarouselContainer>
    );
};
