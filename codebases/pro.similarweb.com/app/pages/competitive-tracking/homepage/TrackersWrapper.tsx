import { CompetitiveTrackerService } from "services/competitiveTracker/competitiveTrackerService";
import React from "react";
import { CreateNewTracker } from "pages/competitive-tracking/homepage/CreateNewTracker";
import {
    HeaderContainer,
    VerticalAlignContainer,
    Text,
    TextContainer,
    TrackersContainer,
    TrackersWrapperContainer,
} from "pages/competitive-tracking/homepage/styled";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { colorsPalettes } from "@similarweb/styles";
import { i18nFilter } from "filters/ngFilters";
import { Tracker } from "pages/competitive-tracking/homepage/Tracker";

const Header = () => {
    const { MAX_RESEARCH_TRACKERS } = CompetitiveTrackerService;
    const trackers = CompetitiveTrackerService.get();
    const { length: trackersAmount } = trackers;
    const i18n = i18nFilter();
    return (
        <>
            <HeaderContainer>
                <VerticalAlignContainer>
                    <TextContainer>
                        <Text fontWeight={500}>{i18n("competitive.tracker.home.my.trackers")}</Text>
                        <Text color={colorsPalettes.carbon[200]}>
                            ({trackersAmount}/{MAX_RESEARCH_TRACKERS} {i18n("common.trackers")})
                        </Text>
                    </TextContainer>
                </VerticalAlignContainer>
                <VerticalAlignContainer>
                    <CreateNewTracker buttonComponent={IconButton} />
                </VerticalAlignContainer>
            </HeaderContainer>
        </>
    );
};

const Trackers = ({ segmentsModule }) => {
    const trackers = CompetitiveTrackerService.get();
    return <TrackersContainer>{trackers.map(Tracker(segmentsModule))}</TrackersContainer>;
};

export const TrackersWrapper = ({ segmentsModule }) => {
    return (
        <TrackersWrapperContainer>
            <Header />
            <Trackers segmentsModule={segmentsModule} />
        </TrackersWrapperContainer>
    );
};
