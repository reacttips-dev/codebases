import {
    StartPageImage,
    StartPageTitle,
} from "pages/competitive-tracking/startpage/CompetitiveTrackingStartPageStyles";
import { AssetsService } from "services/AssetsService";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { ArenaButton } from "pages/competitive-tracking/arena/ArenaButton";
import { TryTrackerButton } from "pages/competitive-tracking/arena/TryTrackerButton";
import {
    ButtonsContainer,
    TeaserContainer,
    TeaseSubtitle,
} from "pages/competitive-tracking/arena/styled";

export const Teaser = ({ onClickCallback }) => {
    return (
        <>
            <TeaserContainer>
                <StartPageImage
                    imageUrl={AssetsService.assetUrl(
                        "/images/competitive-tracking/new-tracker.svg",
                    )}
                />
                <StartPageTitle>
                    {i18nFilter()("competitive.tracker.arena.teaser.title")}
                </StartPageTitle>
                <TeaseSubtitle>
                    {i18nFilter()("competitive.tracker.arena.teaser.subtitle")}
                </TeaseSubtitle>
                <ButtonsContainer>
                    <ArenaButton onClickCallback={onClickCallback} />
                    <TryTrackerButton onClickCallback={onClickCallback} />
                </ButtonsContainer>
            </TeaserContainer>
        </>
    );
};
