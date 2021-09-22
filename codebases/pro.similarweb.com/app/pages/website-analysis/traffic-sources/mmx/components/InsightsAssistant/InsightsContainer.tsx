import {
    CarouselWrapper,
    InsightsWrapper,
    StyledBoxTitleContainer,
    StyledIconButton,
    StyledRecommendationsIndicatorNumber,
    HideButton,
} from "./StyledComponents";
import * as React from "react";
import { i18nFilter } from "filters/ngFilters";
import { Carousel } from "components/Carousel/src/Carousel";
import { InsightType } from "insights-assistant/insights-types";
import FeedbackCard from "pages/website-analysis/traffic-sources/mmx/components/InsightsAssistant/FeedbackCard";
import { InsightCard } from "pages/website-analysis/traffic-sources/mmx/components/InsightsAssistant/InsightCard";
import { FC, useState } from "react";
import { connect } from "react-redux";
import { OPEN_DURATION_FILTER } from "action_types/website_analysis_action-types";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { InsightsTitle } from "./Common";

export interface IInsight {
    channel: string;
    period?: string;
    domain?: {
        icon: string;
        name: string;
        color: string;
    };
    value?: string;
    isDecrease?: boolean;
    type: InsightType;
}

export interface IInsightProps extends IInsight {
    index: number;
    isClicked: boolean;
    markerColor?: string;
    isVisited: boolean;
}

interface IProps {
    granularity: string;
    insights: IInsightProps[];
    onInsightClick: (chosenChannel: string, type: string, index: number) => void;
    isFetching: boolean;
    channelsData: any;
    resetClickedCard: () => void;
    insightCardClicked: boolean;
    isAllLegendsChecked: boolean;
    durationObject: any;
    open: (action: any) => void;
    isCompare: boolean;
}

const InsightsContainer: FC<IProps> = (props) => {
    const {
        granularity,
        insights,
        onInsightClick,
        channelsData,
        insightCardClicked,
        resetClickedCard,
        isAllLegendsChecked,
        durationObject,
        open,
        isCompare,
    } = props;

    const i18n = i18nFilter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const isExpandDisabled = insights.length === 0;
    const duration = durationObject.raw.to.diff(durationObject.raw.from, "months");
    const showSmallRangeTitle = duration < 2 && granularity === "Monthly";

    const changeDatePickerRange = () => {
        open({ type: OPEN_DURATION_FILTER });
        document.body.click();
    };

    const hideButtonClicked = () => {
        setIsCollapsed(!isCollapsed);

        TrackWithGuidService.trackWithGuid(
            "website_analysis.marketing_channels.channel_analysis.insights.collapse",
            "click",
            {
                is_collapsed: isCollapsed ? "shown" : "hidden",
            },
        );
    };

    return (
        <InsightsWrapper
            data-automation="InsightsAssistance"
            isCollapsed={isCollapsed || isExpandDisabled}
        >
            <StyledBoxTitleContainer isCollapsed={isCollapsed || isExpandDisabled}>
                <InsightsTitle
                    isExpandDisabled={isExpandDisabled}
                    showSmallRangeTitle={showSmallRangeTitle}
                    changeDatePickerRange={changeDatePickerRange}
                    keys={{
                        title: "mmx.insights.carousel.title",
                        titleTooltip: "mmx.insights.info.tooltip",
                        noInsights: "mmx.no-insights.date-range-too-small.sub-title",
                        noInsightsSubtitle: "mmx.no-insights.sub-title",
                        datePickLink: "mmx.no-insights.date-range-too-small.sub-title.link",
                    }}
                />
                <div>
                    {!isCollapsed && insightCardClicked && !isAllLegendsChecked && (
                        <StyledIconButton type="flat" iconName="refresh" onClick={resetClickedCard}>
                            {i18n("mmx.insights.reset.button")}
                        </StyledIconButton>
                    )}
                    <HideButton
                        type="flat"
                        iconName={isCollapsed || isExpandDisabled ? "chev-down" : "chev-up"}
                        isDisabled={isExpandDisabled}
                        onClick={hideButtonClicked}
                    >
                        {isCollapsed || isExpandDisabled ? (
                            <>
                                {i18n("mmx.insights.show-insights.button")}
                                {!isExpandDisabled && (
                                    <StyledRecommendationsIndicatorNumber>
                                        {insights.length}
                                    </StyledRecommendationsIndicatorNumber>
                                )}
                            </>
                        ) : (
                            i18n("mmx.insights.hide.button")
                        )}
                    </HideButton>
                </div>
            </StyledBoxTitleContainer>
            {!isExpandDisabled && !isCollapsed && (
                <CarouselWrapper isCompare={isCompare}>
                    <Carousel margin={16} offset={24} data-automation>
                        {[
                            ...insights.map((card: IInsightProps) => (
                                <InsightCard
                                    data-automation
                                    key={card.index}
                                    {...card}
                                    onInsightClick={onInsightClick}
                                    granularity={granularity}
                                    isCompare={isCompare}
                                    markerColor={
                                        !isCompare &&
                                        channelsData.find(
                                            (channel) => channel.name === card.channel,
                                        ).color
                                    }
                                />
                            )),
                            <FeedbackCard key="feedback" isCompare={isCompare} />,
                        ]}
                    </Carousel>
                </CarouselWrapper>
            )}
        </InsightsWrapper>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        open: (action) => {
            dispatch(action);
        },
    };
};

export default connect(null, mapDispatchToProps)(InsightsContainer);
